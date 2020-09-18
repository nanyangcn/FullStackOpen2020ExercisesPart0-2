import axios from 'axios'

const baseUrl = 'https://lit-beach-60745.herokuapp.com/api/persons'

const getAll = () => {
  return(
    axios
      .get(baseUrl)
      .then(res => res.data)
  )
}

const create = (newObject) => {
  return(
    axios
      .post(baseUrl, newObject)
      .then(res => res.data)
  )
}

const remove = (id) => {
  return(
    axios
      .delete(`${baseUrl}/${id}`)
      .then(res => res.data)
  )
}

const update = (id, newObject) => {
  return(
    axios
      .put(`${baseUrl}/${id}`, newObject)
      .then(res => res.data)
  )
}

export default { getAll, create, remove, update }