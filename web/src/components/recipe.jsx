import { useParams } from "react-router";
import useRecipe from "../hooks/useRecipe";
import { useRecipeRunner } from "../hooks/useRecipeRunner";
import { RecipeRunnerContext } from "../contexts/RecipeRunnerContext";
import { Heading, VStack, Button, HStack } from "@chakra-ui/react";
import RecipeStep from "./recipeStep";
import Runner from "./runner";

function Recipe() {
  const { id } = useParams();
  const { recipe } = useRecipe(id);
  const recipeRunner = useRecipeRunner(recipe);

  return (
    <RecipeRunnerContext.Provider value={recipeRunner}>
      <div>
        <Heading mt={4} mb={4}>
          {recipe.title}
        </Heading>
        {recipe.description ? <p>{recipe.description}</p> : null}
        <p>by: {recipe.user ? recipe.user.username : null}</p>
        <p>Dose: {recipe.dose}</p>
        <p>Grind size: {recipe.grind}</p>
        <p>Water: {recipe.water}</p>

        <HStack mt={4} mb={4}>
          <Button
            onClick={() => recipeRunner.start()}
            disabled={!recipe.steps || recipe.steps.length === 0}
          >
            Run Recipe
          </Button>
        </HStack>

        <Heading mt={4} mb={4}>
          Steps:
        </Heading>
        <VStack spacing={4} align="stretch">
          {recipe.steps
            ? recipe.steps.map((step, index) => (
                <RecipeStep key={index} step={step} index={index} />
              ))
            : null}
        </VStack>

        <Runner
          isOpen={recipeRunner.isRunnerOpen}
          onClose={() => recipeRunner.close()}
          recipe={recipe}
        />
      </div>
    </RecipeRunnerContext.Provider>
  );
}

export default Recipe;
