import axios from 'axios'
const baseUrl = '/api/recipes'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
  console.log(token)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getAll, setToken }