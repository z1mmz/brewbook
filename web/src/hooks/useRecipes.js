import { useQuery } from "@tanstack/react-query";
import recipeService from "../services/recipes.js";

const useRecipes = () => {
  const recipesQuery = useQuery({
    queryKey: ["recipes"],
    queryFn: () => recipeService.getAll(),
    keepPreviousData: true,
  });

  return { recipes: recipesQuery.data ?? [] };
};
export default useRecipes;
