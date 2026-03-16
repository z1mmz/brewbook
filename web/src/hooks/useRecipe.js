import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import recipeService from "../services/recipes.js";
import { toaster } from "../components/ui/toaster";

export const useRecipe = (id) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const recipeQuery = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => recipeService.getRecipe(id),
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;
      const cachedLists = queryClient.getQueriesData({ queryKey: ["recipes"] });
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
    onError: (error) => {
      toaster.create({
        type: "error",
        title: "Failed to create recipe",
        description: error.response?.data?.error || "Please try again",
      });
    },
  });

  const updateRecipeMutation = useMutation({
    mutationFn: ({ recipeId, recipe }) => recipeService.updateRecipe(recipeId, recipe),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", updated.id] });
      navigate(`/recipes/${updated.id}`);
    },
    onError: (error) => {
      toaster.create({
        type: "error",
        title: "Failed to update recipe",
        description: error.response?.data?.error || "Please try again",
      });
    },
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: (recipeId) => recipeService.deleteRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["myRecipes"] });
      navigate("/my-recipes");
    },
  });

  return {
    recipe: recipeQuery.data ?? [],
    createRecipe: (recipe) => createRecipeMutation.mutate(recipe),
    updateRecipe: (recipeId, recipe) => updateRecipeMutation.mutate({ recipeId, recipe }),
    deleteRecipe: (recipeId) => deleteRecipeMutation.mutate(recipeId),
  };
};
export default useRecipe;
