import { useState, useEffect} from 'react'
import editor from './components/editor'
import './App.css'
import Recipe from './components/recipe'
import login from './services/login'
import recipeService from './services/recipes'


function App() {
  const [recipes, setRecipes] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const getAllRecipes = async () => {
    recipeService.getAll().then(recipes =>
      setRecipes(recipes)
    ).then(console.log(recipes))
  }
  useEffect(() => {
    getAllRecipes()

  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('brewbookLoggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      recipeService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (e) => {
    e.preventDefault()
    try{
      const user = await login.login({ username,password })
      window.localStorage.setItem('brewbookLoggedInUser',JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
    } catch(exception){
      statusMessage('Wrong username or password', 'error')
      console.error(exception)
    }
  }
  const handleLogout = async () => {
    window.localStorage.removeItem('brewbookLoggedInUser')
    setUser(null)
  }
  const handleExpand = (recipe) => {
    console.log(`expand recipe ${recipe.id}`)
    setSelectedRecipe(recipe)
  }

  const loginForm = (
    <form onSubmit={handleLogin}>
      <div>
      Username <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)}></input>
      </div>
      <div>
    Password <input type='text' value={password} name='Password' onChange={({ target }) => setPassword(target.value)}></input>
      </div>
      <button type='submit'>Login</button>
    </form>
  )


  const recipeList = (<div> {recipes.map(recipe =>
    <li key={recipe.id}>{recipe.title} <button onClick={() => handleExpand(recipe)}>Expand</button></li>
  )}</div>)

  console.log(recipeList)

  return (
  <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
    <div className={`listPane ${selectedRecipe ? 'shrunk' : ''}`}>
    {user === null ? loginForm : <div>{user.name} logged in <button onClick={handleLogout}>Logout</button></div>}
    <ul className='list'>{recipeList}</ul>
    </div>
 
    {selectedRecipe && <Recipe user={user} recipe={selectedRecipe} handleClose={()=>{setSelectedRecipe(null)}}/> }

  </div>
  )
}

export default App
