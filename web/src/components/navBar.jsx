import { HStack, IconButton, Menu, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router";
import LoginContext from "../loginContext";
import { useLogin } from "../hooks/useLogin";
import { useContext } from "react";
import { Menu as MenuIcon } from "lucide-react";
export default function NavBar() {
  const { loggedInUser } = useContext(LoginContext);
  const { logout } = useLogin();

  const navLinkData = [
    { to: "/recipes", label: "Recipes" },
    { to: "/create", label: "Create a recipe" },
  ];

  const navLinks = navLinkData.map((link) => (
    <ChakraLink key={link.to} asChild>
      <Link to={link.to}>{link.label}</Link>
    </ChakraLink>
  ));

  const navMenuItems = navLinkData.map((link) => (
    <Menu.Item key={link.to} value={link.to}>
      <Link to={link.to}>{link.label}</Link>
    </Menu.Item>
  ));

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
          {navLinks}
        </HStack>
        <Menu.Root>
          <Menu.Trigger asChild hideFrom="md">
            <IconButton aria-label="Open navigation" variant="ghost" size="sm">
              <MenuIcon />
            </IconButton>
          </Menu.Trigger>

          <Menu.Positioner>
            <Menu.Content>{navMenuItems}</Menu.Content>
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
