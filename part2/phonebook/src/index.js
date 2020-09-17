import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react'
import noteService from './services/note.js'
import './index.css'

const Filter = ({ persons, setPersonsShow}) => {
  const [ filter, setFilter ] = useState('')
  
  const handleFilterChange = (event) => {
    const personsFilter = persons.filter(person => 
      person.name.toLowerCase().includes(event.target.value))
    setFilter(event.target.value)
    setPersonsShow(personsFilter)
  }

  return(
    <div>
      filter show with
      <input 
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  )
}

const PersonForm = ({ persons, setPersons, personsShow, setPersonsShow, setaddMessage, seterrorMessage }) => {
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject ={
      name: newName,
      number: newNumber,
      id: persons[persons.length-1].id + 1
    }
    
    const nameRepeat = persons.filter(person => person.name === newName)

    if (nameRepeat.length !== 0) {
      const replaceFlag = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)

      if (replaceFlag) {
        const copyAndChange = (persons, personsShow, newId, newNumber) => {
          let personsCopy = [...persons]
          let personsShowCopy = [...personsShow]
  
          const index = personsCopy.findIndex(value => value.id === newId)
          const indexShow = personsShowCopy.findIndex(value => value.id === newId)
  
          personsCopy[index].number = newNumber
          personsShowCopy[indexShow].number = newNumber
  
          return(
            {
              persons: personsCopy,
              personsShow: personsShowCopy
            }
          )
        }

        const personsReplace = copyAndChange(persons, personsShow, nameRepeat[0].id, personObject.number)
        setPersons(personsReplace.persons)
        setPersonsShow(personsReplace.personsShow)

        noteService
          .update(nameRepeat[0].id, personObject)
          .catch(error => {
            seterrorMessage(`Update fail`)
            setTimeout(() => seterrorMessage(null), 5000)
          })
      }
    }
    else if (newName !== '' || newNumber !== '') {
      setPersons(persons.concat(personObject))
      setPersonsShow(personsShow.concat(personObject))

      noteService
        .create(personObject)
        .then(() => {
          setaddMessage(`Added ${newName}`)
          setTimeout(() => setaddMessage(null), 5000)
        })
        .catch(response => {
          seterrorMessage(`Post fail`)
          setTimeout(() => seterrorMessage(null), 5000)
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  return(
    <form onSubmit={addPerson}>
      <table>
      <tbody>
        <tr>
          <td>name:</td>
          <td>
            <input 
              value={newName}
              onChange={handleNameChange}
            />
          </td>
        </tr>
        <tr>
          <td>number:</td>
          <td>
            <input 
              value={newNumber}
              onChange={handleNumberChange}
            />
          </td>
        </tr>
      </tbody>
      </table>
      <div>
        <button type="submit">add</button>
      </div>
    </form>  
  )
}

const Person = ({ person, persons, setPersons, personsShow, setPersonsShow, seterrorMessage }) => {
  const personDelete = () => {
    const personsAfterDelete = persons.filter(value => value.id !== person.id )
    const personsShowAfterDelete = personsShow.filter(value => value.id !== person.id )

    setPersons(personsAfterDelete)
    setPersonsShow(personsShowAfterDelete)

    noteService
      .remove(person.id)
      .catch(response => {
        seterrorMessage(`Information of ${person.name} has already beed removed from server`)
        setTimeout(() => seterrorMessage(null), 5000)
      })
  }
  return(
    <tr>
      <td>{person.name}</td>
      <td>{person.number}</td>
      <td><button onClick={personDelete}>delete</button></td>
    </tr>
  )
}

const Persons = ({ persons, setPersons, personsShow, setPersonsShow, seterrorMessage}) => {
  return(
    <table>
    <tbody>
      {personsShow.map(person => 
        <Person key={person.id} person={person}
        persons={persons} setPersons={setPersons}
        personsShow={personsShow} setPersonsShow={setPersonsShow}
        seterrorMessage={seterrorMessage}
        />
      )}
    </tbody>
  </table>  
  )
}

const Message = ({ addMessage, setaddMessage }) => {
  if (addMessage === null)
    return (null)
  else
    return(
      <div>
        <p className='message'>{addMessage}</p>
      </div>
    )
}

const ErrorMessage = ({ errorMessage, seterrorMessage }) => {
  if (errorMessage === null)
    return (null)
  else
    return(
      <div>
        <p className='error'>{errorMessage}</p>
      </div>
    )
}

const App = () => {

  const [ persons, setPersons ] = useState([])
  const [ personsShow, setPersonsShow ] = useState(persons)
  const [ addMessage, setaddMessage ] = useState(null)
  const [ errorMessage, seterrorMessage ] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setPersons(response)
        setPersonsShow(response)
      })
      .catch(response => {
        seterrorMessage(`Get data fail from the server`)
        setTimeout(() => seterrorMessage(null), 5000)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Message addMessage={addMessage} setaddMessage={setaddMessage} />
      <ErrorMessage errorMessage={errorMessage} seterrorMessage={seterrorMessage} />
      <Filter
        persons={persons} setPersonsShow={setPersonsShow} seterrorMessage={seterrorMessage}
      />
      <h3>Add a new</h3>
      <PersonForm
        persons={persons} setPersons={setPersons}
        personsShow={personsShow} setPersonsShow={setPersonsShow}
        addMessage={addMessage} setaddMessage={setaddMessage}
        seterrorMessage={seterrorMessage}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons} setPersons={setPersons}
        personsShow={personsShow} setPersonsShow={setPersonsShow}
        seterrorMessage={seterrorMessage}
      />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)