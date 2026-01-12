import { Routes, Route } from "react-router";
import "./App.css";
import useRecipes from "./hooks/useRecipes";

function App() {
  const { recipes } = useRecipes();
  console.log("Recipes in App.jsx:", recipes);
  const recipeList = (
    <div>
      {" "}
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <h2>{recipe.title}</h2>
        </li>
      ))}
    </div>
  );

  console.log(recipeList);

  return (
    <div>
      <h2>Brewbook</h2>
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <Routes>
          <Route path="/" element={<div>{recipeList}</div>} />
          <Route path="/recipes/:id" element={<div>Recipe Details Page</div>} />
          <Route path="/create" element={<div>Create Recipe Page</div>} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
