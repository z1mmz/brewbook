import { useState } from 'react'

function Recipe({recipe}) {
  console.log(recipe)

  return (
    <div>
      <h1>{recipe.title}</h1>
      <div><pre>{ JSON.stringify(recipe.recipe, null, 2) }</pre></div>

    </div>
  )
}

export default Recipe
