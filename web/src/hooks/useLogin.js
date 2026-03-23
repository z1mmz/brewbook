import { useMutation } from "@tanstack/react-query";
import recipeService from "../services/recipes";
import reviewsService from "../services/reviews";
import beansService from "../services/beans";
import loginService from "../services/login";
import LoginContext from "../contexts/loginContext";
import { useContext } from "react";
import { toaster } from "../components/ui/toaster";

export const useLogin = () => {
  const { loggedInUserDispatch } = useContext(LoginContext);
  const loginMutation = useMutation({
    mutationFn: (credentials) => {
      return loginService.login(credentials);
    },
    onSuccess: (loggedInUser) => {
      window.localStorage.setItem(
        "BrewBookLoggedInUser",
        JSON.stringify(loggedInUser)
      );
      loggedInUserDispatch({ type: "SET_LOGIN", payload: loggedInUser });
      recipeService.setToken(loggedInUser.token);
      reviewsService.setToken(loggedInUser.token);
      beansService.setToken(loggedInUser.token);
    },
    onError: (error) => {
      toaster.create({
        type: "error",
        title: "Login failed",
        description: error.response?.data?.error || "Invalid username or password",
      });
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
