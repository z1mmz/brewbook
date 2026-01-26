import { useMutation } from "@tanstack/react-query";
import recipeService from "../services/recipes";
import loginService from "../services/login";
import LoginContext from "../contexts/loginContext";
import { useContext } from "react";

export const useLogin = () => {
  const { loggedInUserDispatch } = useContext(LoginContext);
  const loginMutation = useMutation({
    mutationFn: (credentials) => {
      return loginService.login(credentials);
    },
    onSuccess: (loggedInUser) => {
      console.log("login onSuccess", loggedInUser);
      window.localStorage.setItem(
        "BrewBookLoggedInUser",
        JSON.stringify(loggedInUser)
      );
      loggedInUserDispatch({ type: "SET_LOGIN", payload: loggedInUser });
      recipeService.setToken(loggedInUser.token);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => {
      window.localStorage.removeItem("BrewBookLoggedInUser");
      loggedInUserDispatch({ type: "CLEAR_LOGIN" });
    },
  });
  return {
    login: (credentials) => loginMutation.mutate(credentials),
    logout: logoutMutation.mutate,
  };
};
