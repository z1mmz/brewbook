import { useParams } from "react-router";
import useRecipes from "../hooks/useRecipes";

function Recipe() {
  const { id } = useParams();
  const { recipes } = useRecipes();
  const recipe = recipes.find((r) => r.id === id) || {};
  console.log("Recipe in Recipe.jsx:", recipe);

  return (
    <div>
      {id}
      <h1>{recipe.title}</h1>
      {/* <p>by: {recipe.user.username ? recipe.user.username : null}</p> */}
      <p>Dose:{recipe.dose}</p>
      <p>Gind size:{recipe.grind}</p>
      <p>water:{recipe.water}</p>
      {/* <div style={{ overflow: "scroll" }}>
        <pre>{JSON.stringify(recipe.steps, null, 2)}</pre>
      </div> */}
    </div>
  );
}

export default Recipe;
