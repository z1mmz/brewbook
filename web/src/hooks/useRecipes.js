import { useQuery } from "@tanstack/react-query";
import recipeService from "../services/recipes.js";

const useRecipes = ({ page = 1, pageSize = 10 }) => {
  console.log(page, pageSize);
  const recipesQuery = useQuery({
    queryKey: ["recipes", page, pageSize],
    queryFn: () => recipeService.getAll({ page, pageSize }),
    // keepPreviousData: true,
  });

  return { data: recipesQuery.data ?? { metadata: {}, recipes: [] } };
};
export default useRecipes;
