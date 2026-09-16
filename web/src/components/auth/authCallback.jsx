import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Center, Spinner } from "@chakra-ui/react";
import LoginContext from "../../contexts/loginContext";
import recipeService from "../../services/recipes";
import reviewsService from "../../services/reviews";
import beansService from "../../services/beans";
import { toaster } from "../../components/ui/toaster";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loggedInUserDispatch } = useContext(LoginContext);

  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");
    const id = searchParams.get("id");
    const name = searchParams.get("name");

    if (!token || !username || !id) {
      toaster.create({
        type: "error",
        title: "Authentication failed",
        description: "Missing credentials from Google login.",
      });
      navigate("/login");
      return;
    }

    const loggedInUser = { token, username, id, name };
    window.localStorage.setItem(
      "BrewBookLoggedInUser",
      JSON.stringify(loggedInUser)
    );
    loggedInUserDispatch({ type: "SET_LOGIN", payload: loggedInUser });
    recipeService.setToken(token);
    reviewsService.setToken(token);
    beansService.setToken(token);
    navigate("/");
  }, [searchParams, navigate, loggedInUserDispatch]);

  return (
    <Center minH="50vh">
      <Spinner size="xl" />
    </Center>
  );
}

export default AuthCallback;
