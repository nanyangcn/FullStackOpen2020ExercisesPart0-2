import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Bottons =({data}) => {
  const setGood = data.state[0].setValue
  const setNeutral = data.state[1].setValue
  const setBad = data.state[2].setValue

  const good = data.state[0].value
  const neutral = data.state[1].value
  const bad = data.state[2].value

  return(
    <div>
      <Botton setValue={setGood} value={good} text='good' />
      <Botton setValue={setNeutral} value={neutral} text='neutral' />
      <Botton setValue={setBad} value={bad} text='bad' />
    </div>
  )
}
const Botton = ({setValue, value, text}) => {
  return(
    <button onClick={() => setValue(value + 1)}>{text}</button>
  )
}

const Statistics = ({data}) => {
  const good = data.state[0].value
  const neutral = data.state[1].value
  const bad = data.state[2].value

  const values = data.state.map(value => value.value)
  data.all = values.reduce((a, b) => a + b)

  const scores = data.state.map(value => value.value * value.score)
  data.average = scores.reduce((a, b) => a + b) / data.all

  data.percentage = good / data.all * 100

  if (data.all === 0)
    return (<p>No feedback given</p>)
  else
    return(
      <table>
        <tbody>
          <Statistic text='good' value={good} />
          <Statistic text='neutral' value={neutral} />
          <Statistic text='bad' value={bad} />
          <Statistic text='all' value={data.all} />
          <Statistic text='average' value={data.average} />
          <Statistic text='percentage' value={data.percentage} /> 
        </tbody>
      </table>
    )
}

const Statistic = ({text, value}) => {
  if (text === 'percentage')
    return (
      <tr>
        <td>{text}</td>
        <td>{value}%</td>
      </tr>
    )
  else
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const data = {
    state: [
      {
        text: 'good',
        value: good,
        setValue: setGood,
        score: 1
      },
      {
        text: 'neutral',
        value: neutral,
        setValue: setNeutral,
        score: 0
      },
      {
        text: 'bad',
        value: bad,
        setValue: setBad,
        score: -1
      }
    ],
    all: 0,
    average: 0,
    percentage: 0
  }
  
  return (
    <div>
      <h1>give feedback</h1>
      <Bottons data={data} />
      <h1>statistics</h1>
      <Statistics data={data} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)