import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Vote = ({setValue, value, selected, text}) => {
  const copy = {...points}

  const voteadd = () => {
    copy[selected] += 1
    points[selected] = copy[selected]
    setValue(value + 1)    
  }

  return(
    <button onClick={voteadd}>{text}</button>
  )
}

const Botton = ({setValue, text}) => {
  return(
    <button onClick={() => setValue(Math.floor(Math.random() * length))}>{text}</button>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(0)
  const voteMost = Math.max(...points)
  const voteIndexMost = points.findIndex(point => point === voteMost)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Vote setValue={setVote} value={vote} selected={selected} text='vote' />
      <Botton setValue={setSelected} text='next anecdote'/>
      
      <h1>Anecdote with most votes</h1>
      <p>{props.anecdotes[voteIndexMost]}</p>
      <p>has {voteMost} votes</p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]
const length = anecdotes.length
const points = Array(length).fill(0)

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)