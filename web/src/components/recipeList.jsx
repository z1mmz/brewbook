import useRecipes from "../hooks/useRecipes";
import { Link } from "react-router";
function RecipeList() {
  const { recipes } = useRecipes();
  console.log("Recipes in App.jsx:", recipes);

  return (
    <div>
      {" "}
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
        </li>
      ))}
    </div>
  );
}

export default RecipeList;
