import { useMutation, useQueryClient } from "@tanstack/react-query";
import recipeService from "../services/recipes.js";

const useSaveRecipe = () => {
  const queryClient = useQueryClient();

  const saveRecipeMutation = useMutation({
    mutationFn: (recipeId) => recipeService.toggleSaveRecipe(recipeId),
    onSuccess: () => {
      // Invalidate both saved recipes and user data to refresh
      queryClient.invalidateQueries({ queryKey: ["savedRecipes"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return saveRecipeMutation;
};

export default useSaveRecipe;
