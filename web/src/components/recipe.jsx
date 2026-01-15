import { useParams } from "react-router";
import useRecipe from "../hooks/useRecipe";
import { Heading, VStack } from "@chakra-ui/react";
import RecipeStep from "./recipeStep";

import { QueryClient } from "@tanstack/react-query";
function Recipe() {
  // TODO: fetch recipe by id from useRecipe hook

  const { id } = useParams();
  const { recipe } = useRecipe(id);

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
