import { useMutation, useQueryClient } from "@tanstack/react-query";
import recipeService from "../services/recipes.js";
import { toaster } from "../components/ui/toaster";

const useSaveRecipe = () => {
  const queryClient = useQueryClient();

  const saveRecipeMutation = useMutation({
    mutationFn: (recipeId) => recipeService.toggleSaveRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedRecipes"] });
    },
    onError: () => {
      toaster.create({
        type: "error",
        title: "Failed to save recipe",
        description: "Please try again",
      });
    },
  });

  return saveRecipeMutation;
};

export default useSaveRecipe;
