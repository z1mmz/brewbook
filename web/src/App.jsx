import { useState, useEffect } from "react";
import Editor from "./components/editor";
import "./App.css";
import Recipe from "./components/recipe";
import login from "./services/login";
import useRecipes from "./hooks/useRecipes";

function App() {
  const { recipes } = useRecipes();

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
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      <h2>Brewbook</h2>
      {recipeList}
    </div>
  );
}

export default App;
