import { useState } from 'react'

function Recipe({recipe,handleClose}) {
  const {expanded, setExpanded} = useState(false)
  console.log(recipe)

  return (
    <div>
      <h1>{recipe.title}</h1><button onClick={handleClose}>close</button>
      <div style={{overflow:'scroll'}}><pre>{ JSON.stringify(recipe.recipe, null, 2) }</pre></div>
      
    </div>
  )
}

export default Recipe
