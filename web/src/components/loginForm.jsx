import { useLogin } from "../hooks/useLogin";
import { useState } from "react";
import {
  Field,
  Input,
  Flex,
  Button,
  Heading,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "./ui/password-input";
import { Link } from "react-router";
function LoginForm() {
  const { login } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [visible, setVisible] = useState(false);
  const handleLogin = (event) => {
    event.preventDefault();
    login({ username, password });
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
        <Field.Root>
          <Field.Label>Password</Field.Label>
          <PasswordInput
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            onVisibleChange={setVisible}
          />
        </Field.Root>
      </form>
      <Button type="submit">Login</Button>
      <div>
        Dont have an account?{" "}
        <ChakraLink asChild>
          <Link to="/signup">Create one?</Link>
        </ChakraLink>
      </div>
    </Flex>
  );
}
export default LoginForm;
