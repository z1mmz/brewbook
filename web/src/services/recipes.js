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
const createRecipe = async (recipe) => {
  console.log('creating recipe', recipe)
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, recipe, config)
  return response.data
}

export default { getAll,createRecipe ,setToken }