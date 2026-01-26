import { useQuery } from "@tanstack/react-query";
import recipeService from "../services/recipes.js";
import { useContext } from "react";
import LoginContext from "../loginContext";

const useSavedRecipes = ({ page = 1, pageSize = 10 } = {}) => {
  const { loggedInUser } = useContext(LoginContext);

  const savedRecipesQuery = useQuery({
    queryKey: ["savedRecipes", page, pageSize, loggedInUser?.id],
    queryFn: () =>
      loggedInUser
        ? recipeService.getSavedRecipes({ page, pageSize })
        : Promise.resolve({ metadata: {}, recipes: [] }),
    enabled: !!loggedInUser,
  });

  return { data: savedRecipesQuery.data ?? { metadata: {}, recipes: [] } };
};

export default useSavedRecipes;
