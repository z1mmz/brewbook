import { useParams } from "react-router";
import { Heading, VStack, Button, HStack } from "@chakra-ui/react";
import useRecipe from "../../hooks/useRecipe";
import { useRecipeRunner } from "../../hooks/useRecipeRunner";
import { RecipeRunnerContext } from "../../contexts/RecipeRunnerContext";
import RecipeStep from "./recipeStep";
import Runner from "./runner";
import SaveButton from "../ui/saveButton";
import ReviewList from "../review/reviewList";
import ReviewForm from "../review/reviewForm";
import LexicalRecipeRenderer from "./lexicalRenderer";

function Recipe() {
  const { id } = useParams();
  const { recipe, isLoading, isError } = useRecipe(id);
  const recipeRunner = useRecipeRunner(recipe);

  if (isLoading) return <div className="recipe-loading">Loading recipe…</div>;
  if (isError || !recipe) return <div className="recipe-loading">Recipe not found.</div>;

  return <RecipeRunnerContext.Provider value={recipeRunner}>
    <article className="recipe-page">
      <header className="recipe-hero">
        <p className="eyebrow">{recipe.iced ? "Iced brew" : "Pour-over recipe"}</p>
        <Heading as="h1">{recipe.title}</Heading>
        <p className="recipe-byline">By {recipe.user?.username ?? "BrewBook community"}</p>
        <div className="recipe-stats">
          <span><strong>{recipe.dose}g</strong> coffee</span><span><strong>{recipe.water}ml</strong> water</span><span><strong>{recipe.grind}</strong> grind</span><span>{recipe.iced ? "🧊 Iced" : "☕ Hot"}</span>
        </div>
      </header>
      <div className="recipe-page-layout">
        <main>
          {recipe.description && <section className="recipe-reading-card recipe-prose"><LexicalRecipeRenderer value={recipe.description} /></section>}
          {recipe.bean && <p className="recipe-bean">Beans: <strong>{recipe.bean.name}</strong> by {recipe.bean.roaster}{recipe.bean.process ? ` · ${recipe.bean.process}` : ""}</p>}
          <section className="recipe-method"><div className="section-heading"><div><p className="eyebrow">The method</p><h2>Brewing steps</h2></div></div><VStack spacing={4} align="stretch">{recipe.steps?.map((step, index) => <RecipeStep key={index} step={step} index={index} />)}</VStack></section>
          <section className="recipe-reviews"><Heading size="md">Reviews</Heading><ReviewList recipeId={id} /><ReviewForm recipeId={id} /></section>
        </main>
        <aside className="recipe-actions"><Button onClick={() => recipeRunner.start()} disabled={!recipe.steps?.length}>Run recipe</Button><SaveButton recipeId={id} variant="outline" /></aside>
      </div>
      <Runner isOpen={recipeRunner.isRunnerOpen} onClose={() => recipeRunner.close()} recipe={recipe} />
    </article>
  </RecipeRunnerContext.Provider>;
}

export default Recipe;
