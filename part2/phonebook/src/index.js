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

const PersonForm = ({ persons, setPersons, setPersonsShow, setAddMessage, setErrorMessage }) => {
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    
    const newIdnumber = () => {
      // if (persons.length === 0){
      //   return(1)
      // }
      // else {
      //   return(Math.max(...persons.map(value => value.id)) + 1)
      // }
      return(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
    }

    const personObject ={
      name: newName,
      number: newNumber,
      id: newIdnumber()
    }
    
    const nameRepeat = persons.filter(person => person.name === newName)

    if (nameRepeat.length !== 0) { // replace
      const replaceFlag = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)

      if (replaceFlag) {
        const copyAndChange = (persons, replaceId, newNumber) => {
          let personsCopy = [...persons]
  
          const index = personsCopy.findIndex(value => value.id === replaceId)
  
          personsCopy[index].number = newNumber
  
          return(personsCopy)
        }

        const personsReplace = copyAndChange(persons, nameRepeat[0].id, personObject.number)
        setPersons(personsReplace)
        setPersonsShow(personsReplace)

        noteService
          .update(nameRepeat[0].id, personObject)
          .then(() => {
            setAddMessage('Update sucessfully')
            setTimeout(() => setAddMessage(null), 5000)
          })
          .catch(() => {
            setErrorMessage(`Update fail`)
            setTimeout(() => setErrorMessage(null), 5000)
          })
      }
    }
    else if (newName !== '' || newNumber !== '') { // add

      noteService
        .create(personObject)
        .then((response) => {
          personObject.id = response.id
          setAddMessage(`Added ${newName}`)
          setTimeout(() => setAddMessage(null), 5000)
        })
        .catch(() => {
          setErrorMessage(`Post fail`)
          setTimeout(() => setErrorMessage(null), 5000)
        })
      
      setPersons(persons.concat(personObject))
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

const Person = ({ person, persons, setPersons, setPersonsShow, setAddMessage, setErrorMessage }) => {
  const personDelete = () => {
    const personsAfterDelete = persons.filter(value => value.id !== person.id )

    setPersons(personsAfterDelete)
    setPersonsShow(personsAfterDelete)

    noteService
      .remove(person.id)
      .then(() => {
        setAddMessage('Delete sucessfully')
        setTimeout(() => setAddMessage(null), 5000)
      })
      .catch(() => {
        setErrorMessage(`Information of ${person.name} has already beed removed from server`)
        setTimeout(() => setErrorMessage(null), 5000)
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

const Persons = ({ persons, setPersons, setPersonsShow, personsShow, setAddMessage, setErrorMessage}) => {
  return(
    <table>
    <tbody>
      {personsShow.map(person => 
        <Person key={person.id} person={person}
        persons={persons} setPersons={setPersons} setPersonsShow={setPersonsShow}
        setAddMessage={setAddMessage} setErrorMessage={setErrorMessage}
        />
      )}
    </tbody>
  </table>  
  )
}

const Message = ({ message, className }) => {
  if (message === null)
    return (null)
  else
    return(
      <div>
        <p className={className}>{message}</p>
      </div>
    )
}

const App = () => {

  const [ persons, setPersons ] = useState([])
  const [ personsShow, setPersonsShow ] = useState(persons)
  const [ addMessage, setAddMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(response => setPersons(response))
      .catch(() => {
        setErrorMessage(`Get data fail from the server`)
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }, [])

  useEffect(() => setPersonsShow(persons), [persons])
  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={addMessage} className='message' />
      <Message message={errorMessage} className='error' />
      <Filter
        persons={persons} setPersonsShow={setPersonsShow} setErrorMessage={setErrorMessage}
      />
      <h3>Add a new</h3>
      <PersonForm
        persons={persons} setPersons={setPersons} setPersonsShow={setPersonsShow}
        addMessage={addMessage} setAddMessage={setAddMessage}
        setErrorMessage={setErrorMessage}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons} setPersons={setPersons}
        personsShow={personsShow} setPersonsShow={setPersonsShow}
        setAddMessage={setAddMessage} setErrorMessage={setErrorMessage}
      />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)