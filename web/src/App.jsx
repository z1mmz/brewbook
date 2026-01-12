import { Routes, Route } from "react-router";
import "./App.css";
import Recipe from "./components/recipe";
import RecipeList from "./components/recipeList";
import RecipeCreator from "./components/recipeCreator";
function App() {
  return (
    <div>
      <h2>Brewbook</h2>
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes/:id" element={<Recipe />} />
          <Route path="/recipes/create" element={<RecipeCreator />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
