import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRecipe, createRecipe } from "./services/recipes.js";

export const useRecipe = (id) => {
  const queryClient = useQueryClient();
  const recipeQuery = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipe(id),
    enabled: !!id,
  });

  const createRecipeMutation = useMutation({
    mutationFn: (newRecipe) => createRecipe(newRecipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
  return {
    recipe: recipeQuery.data ?? [],
    createRecipe: (recipe) => createRecipeMutation.mutate(recipe),
  };
};
export default useRecipe;
