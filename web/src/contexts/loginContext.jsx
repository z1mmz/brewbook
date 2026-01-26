import { createContext, useReducer } from "react";
import recipeService from "../services/recipes";

const loginReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOGIN":
      return action.payload;
    case "CLEAR_LOGIN":
      return null;
    default:
      return state;
  }
};

const LoginContext = createContext();

const initUser = () => {
  const loggedUserJSON = window.localStorage.getItem("BrewBookLoggedInUser");
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    recipeService.setToken(user.token);
    return user;
  }
  return null;
};

export const LoginContextProvider = (props) => {
  const [loggedInUser, loggedInUserDispatch] = useReducer(
    loginReducer,
    "",
    initUser
  );

  return (
    <LoginContext.Provider value={{ loggedInUser, loggedInUserDispatch }}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
