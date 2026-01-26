import { Routes, Route, Link } from "react-router";
import "./App.css";
import Recipe from "./components/recipe";
import RecipeList from "./components/recipeList";
import RecipeCreator from "./components/recipeCreator";
import MyRecipes from "./components/myRecipes";
import SavedRecipes from "./components/savedRecipes";
import LoginForm from "./components/loginForm";
import SignupForm from "./components/signupForm";
import NavBar from "./components/navBar";

function App() {
  return (
    <div>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<h2>Welcome to brewbook</h2>} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/:id" element={<Recipe />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
          <Route path="/recipes/create" element={<RecipeCreator />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/create" element={<RecipeCreator />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
