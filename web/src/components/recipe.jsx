import { useParams } from "react-router";
import useRecipes from "../hooks/useRecipes";
import { Heading, VStack } from "@chakra-ui/react";
import RecipeStep from "./recipeStep";
function Recipe() {
  const { id } = useParams();
  const { data } = useRecipes();
  const { recipes } = data;
  const recipe = recipes.find((r) => r._id === id) || {};
  console.log("Recipe in Recipe.jsx:", recipe);

  return (
    <div>
      <Heading mt={4} mb={4}>
        {recipe.title}
      </Heading>
      {recipe.description ? <p>{recipe.description}</p> : null}
      <p>by: {recipe.user ? recipe.user.username : null}</p>
      <p>Dose:{recipe.dose}</p>
      <p>Gind size:{recipe.grind}</p>
      <p>water:{recipe.water}</p>

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
    </div>
  );
}

export default Recipe;
