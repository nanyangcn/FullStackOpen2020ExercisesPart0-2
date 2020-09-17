import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({ countries, setcountries, setcountriesShow, setShow}) => {
  const [ filter, setFilter ] = useState('')
  
  const handleFilterChange = (event) => {
    const countriesFilter = countries.filter(country => 
      country.name.toLowerCase().includes(event.target.value))
    setFilter(event.target.value)
    setcountriesShow(countriesFilter)
    setShow(Infinity)
  }

  return(
    <div>
      find countries
      <input 
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  )
}

const Weather =({ city }) => {
  const [ weather, setWeather ] = useState()
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${city}`)
      .then(response => setWeather(response.data))
  }, [])
  console.log(weather)
  if (weather !== undefined)
    return(
      <div>
        <h2>Weather in {city}</h2>
        <p><b>temperature:</b> {weather.current.temperature} Celcius</p>
        <img src={weather.current.weather_icons} alt='weather' width="50" />
        <p><b>wind:</b> {weather.current.wind_speed} mph direction {weather.current.wind_dir} </p>
      </div>
    )
  else
    return(
      <div>
        <h2>Weather in {city}</h2>
        <p>wait for a second</p>
      </div>
    )
}

const CountryDetail = ({ country }) => {
  return(
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>lauguages</h2>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt='flag' width="100" />
      <Weather city={country.capital} />
    </div>
  )
}
const BottonShow = ({ number, setShow }) => {
  return(
    <button onClick={() => setShow(number)}>
      show
    </button>
  )
}

const Countries = ({ show, setShow, countries }) => {
  if (countries.length > 10)
    return(
      <div>
        Too many matches, specify another filter
      </div>
    )
  else if (countries.length ===0)
    return(
      <div>
        No match, specify another filter
      </div>
    )  
  else if (countries.length !== 1)
    if (show === Infinity)
      return(
        <div>
          {countries.map((country, i) => 
            <p key={country.name}>
              {country.name} <BottonShow number={i} setShow={setShow} />
            </p>
          )}
        </div>
      )
    else
      return(<CountryDetail country={countries[show]} />)
  else if (countries.length === 1)
    return(<CountryDetail country={countries[0]} />)
}

const App = () => {

  const [ countries, setcountries ] = useState([])
  const [ countriesShow, setcountriesShow ] = useState(countries)
  const [ show, setShow ]= useState(Infinity)

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setcountries(response.data)
        setcountriesShow(response.data)
      })
  }, [])

  return (
    <div>
      <Filter
        countries={countries} setcountries={setcountries}
        setcountriesShow={setcountriesShow} setShow={setShow}
      />
      <Countries show={show} setShow={setShow}
       countries={countriesShow} 
      />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
