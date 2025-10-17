import { useState } from 'react'

function Recipe({recipe,handleClose}) {
  const {expanded, setExpanded} = useState(false)
  console.log(recipe)
 
  return (
    <div>
      <h1>{recipe.title}</h1><button onClick={handleClose}>close</button>
      <p>Dose:{recipe.dose}</p>
      <p>Gind size:{recipe.grind}</p>
      <p>water:{recipe.water}</p>
      <div style={{overflow:'scroll'}}><pre>{ JSON.stringify(recipe.steps, null, 2) }</pre></div>
      
    </div>
  )
}

export default Recipe
