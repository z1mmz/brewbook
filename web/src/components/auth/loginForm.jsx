import { useLogin } from "../../hooks/useLogin";
import { useState } from "react";
import {
  Field,
  Input,
  Flex,
  Button,
  Heading,
  Link as ChakraLink,
  Separator,
  Text,
} from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "../ui/password-input";
import { Link, useNavigate } from "react-router";
function LoginForm() {
  const { login, isLoggingIn } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setVisible] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await login({ username, password });
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <Flex
      gap="4"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Heading>Login:</Heading>
      <form onSubmit={handleLogin}>
        <Field.Root>
          <Field.Label>Username</Field.Label>
          <Input
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Field.Root>
        <Field.Root mb={4}>
          <Field.Label>Password</Field.Label>
          <PasswordInput
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            onVisibleChange={setVisible}
          />
        </Field.Root>
        <Button type="submit" width="full" loading={isLoggingIn}>Login</Button>
      </form>

      <Separator width="full" />

      <Button
        variant="outline"
        width="full"
        onClick={handleGoogleLogin}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          style={{ marginRight: "8px" }}
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Login with Google
      </Button>

      <Text fontSize="sm" color="gray.500">
        Dont have an account?{" "}
        <ChakraLink asChild>
          <Link to="/signup">Create one?</Link>
        </ChakraLink>
      </Text>
    </Flex>
  );
}
export default LoginForm;
