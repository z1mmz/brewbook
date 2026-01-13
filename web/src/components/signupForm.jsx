import { Flex, Heading, Link as ChakraLink } from "@chakra-ui/react";
import { Field, Input, Button } from "@chakra-ui/react";
import { PasswordInput } from "./ui/password-input";
import { useState } from "react";
import { Link } from "react-router";

function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSignUp = (event) => {
    event.preventDefault();
    // Sign up logic here
  };

  return (
    <Flex
      gap="4"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Heading>Register:</Heading>
      <form onSubmit={handleSignUp}>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input
            value={email}
            name="Email"
            onChange={({ target }) => setEmail(target.value)}
          />
        </Field.Root>
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
        Gave an account?{" "}
        <ChakraLink asChild>
          <Link to="/login">Login here</Link>
        </ChakraLink>
      </div>
    </Flex>
  );
}
export default SignupForm;
