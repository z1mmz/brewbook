import { useQuery } from "@tanstack/react-query";
import recipeService from "../services/recipes.js";
import { useContext } from "react";
import LoginContext from "../contexts/loginContext";

const useMyRecipes = ({ page = 1, pageSize = 10 } = {}) => {
  const { loggedInUser } = useContext(LoginContext);

  const myRecipesQuery = useQuery({
    queryKey: ["myRecipes", page, pageSize, loggedInUser?.id],
    queryFn: () =>
      loggedInUser
        ? recipeService.getByUser(loggedInUser.id, { page, pageSize })
        : Promise.resolve({ metadata: {}, recipes: [] }),
    enabled: !!loggedInUser,
  });

  return { data: myRecipesQuery.data ?? { metadata: {}, recipes: [] } };
};

export default useMyRecipes;
