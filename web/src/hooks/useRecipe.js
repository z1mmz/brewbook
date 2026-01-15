import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import recipeService from "../services/recipes.js";

export const useRecipe = (id) => {
  const queryClient = useQueryClient();
  const recipeQuery = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => recipeService.getRecipe(id),
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;
      const cachedLists = queryClient.getQueriesData({ queryKey: ["recipes"] });
      console.log("cachedLists:", cachedLists);
      for (const [, data] of cachedLists) {
        const found = data?.recipes?.find((r) => r._id === id);
        if (found) return found;
      }
      return undefined;
    },
    staleTime: 30_000,
  });

  const createRecipeMutation = useMutation({
    mutationFn: (newRecipe) => recipeService.createRecipe(newRecipe),
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
