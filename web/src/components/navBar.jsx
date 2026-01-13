import { HStack, IconButton, Menu, Link as ChakraLink } from "@chakra-ui/react";
import HamburgerIcon from "./ui/HamburgerIcon";
import { Link, useNavigate } from "react-router";
import { Icon } from "@chakra-ui/react";
import LoginContext from "../loginContext";
import { useLogin } from "../hooks/useLogin";
import { useContext } from "react";
import { Menu as MenuIcon } from "lucide-react";
export default function NavBar() {
  const { loggedInUser, loggedInUserDispatch } = useContext(LoginContext);
  const { logout } = useLogin();
  const navigate = useNavigate();
  return (
    <HStack
      as="nav"
      px={4}
      py={3}
      borderBottomWidth="1px"
      justify="space-between"
    >
      {/* LEFT: Brand + nav */}
      <HStack gap={4}>
        <ChakraLink asChild fontWeight="bold">
          <Link to="/">BrewBook</Link>
        </ChakraLink>

        {/* Desktop nav links */}
        <HStack gap={3} hideBelow="md">
          <ChakraLink asChild>
            <Link to="/recipes">Recipes</Link>
          </ChakraLink>
        </HStack>
        <Menu.Root>
          <Menu.Trigger asChild hideFrom="md">
            <IconButton aria-label="Open navigation" variant="ghost" size="sm">
              <MenuIcon />
            </IconButton>
          </Menu.Trigger>

          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="/recipes">
                <Link to="/recipes">Recipes</Link>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </HStack>

      {/* RIGHT: User login/logout */}
      <HStack gap={3}>
        {loggedInUser ? (
          <>
            <span style={{ opacity: 0.8 }}>{loggedInUser.username}</span>
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton
                  aria-label="Open user navigation"
                  variant="ghost"
                  size="sm"
                >
                  <MenuIcon />
                </IconButton>
              </Menu.Trigger>

              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item>
                    <ChakraLink onClick={logout} cursor="pointer">
                      Logout
                    </ChakraLink>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </>
        ) : (
          <ChakraLink asChild>
            <Link to="/login">Login</Link>
          </ChakraLink>
        )}
      </HStack>
    </HStack>
  );
}
