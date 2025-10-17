import { useState } from 'react'

function editor({saveRecipe}) {
  const [title, setTitle] = useState('')
  const [dose, setDose] = useState('')
  const [grind, setGrind] = useState('')
  const [water, setWater] = useState('')
  const [steps, setSteps] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    const newRecipe = {
      title,
      dose: Number(dose),
      grind,
      water: Number(water),
      steps: JSON.parse(steps)
    }
    saveRecipe(newRecipe)
  }
  return (
    <div>
      <h1>Create a new recipe</h1>
      <form>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <br/>
        <label>Dose:</label>
        <input
          type="text"
          name="dose"
          value={dose}
          onChange={e => setDose(e.target.value)}
        />
        <br/>
        <label>Grind size:</label>
        <input
          type="text"
          name="grind"
          value={grind}
          onChange={e => setGrind(e.target.value)}
        />
        <br/>
        <label>Water amount:</label>
        <input
          type="text"
          name="water"
          value={water}
          onChange={e => setWater(e.target.value)}
        />
        <br/>
        <label>Steps (JSON format):</label>
        <textarea
          name="steps"
          rows="10"
          cols="50"
          value={steps}
          onChange={e => setSteps(e.target.value)}
        ></textarea>
        <br/>
        <button onClick={(e)=>handleSubmit(e)}>Create Recipe</button>
      </form>
    </div>
  )
}

export default editor
