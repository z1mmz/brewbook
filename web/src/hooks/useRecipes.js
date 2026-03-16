import { useQuery } from "@tanstack/react-query";
import recipeService from "../services/recipes.js";

const useRecipes = ({ page = 1, pageSize = 10, search = "" }) => {
  const recipesQuery = useQuery({
    queryKey: ["recipes", page, pageSize, search],
    queryFn: () => recipeService.getAll({ page, pageSize, ...(search ? { search } : {}) }),
  });

  return { data: recipesQuery.data ?? { metadata: {}, recipes: [] } };
};
export default useRecipes;
