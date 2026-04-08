import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Coffee, BookOpen, Users } from "lucide-react";
import recipeService from "../../services/recipes";
import LoginContext from "../../contexts/loginContext";
import RecipeCard from "../recipe/recipeCard";
function FeatureCard({ icon, title, description }) {
  const FeatureIcon = icon;
  return (
    <VStack gap={3} p={6} borderWidth="1px" borderRadius="xl" align="start">
      <Box color="orange.500">
        <FeatureIcon size={28} />
      </Box>
      <Heading size="md">{title}</Heading>
      <Text opacity={0.7}>{description}</Text>
    </VStack>
  );
}

export default function Welcome() {
  const { loggedInUser } = useContext(LoginContext);

  const { data: recentRecipes = [], isLoading } = useQuery({
    queryKey: ["recentRecipes"],
    queryFn: recipeService.getRecent,
    staleTime: 60_000,
  });

  return (
    <VStack gap={0} align="stretch">

      {/* Hero */}
      <Box
        bg="orange.900"
        color="white"
        borderRadius="2xl"
        mt={6}
        px={{ base: 6, md: 16 }}
        py={{ base: 12, md: 20 }}
        textAlign="center"
      >
        <Text
          fontSize="sm"
          fontWeight="semibold"
          letterSpacing="widest"
          opacity={0.7}
          textTransform="uppercase"
          mb={3}
        >
          The coffee brewer's companion
        </Text>
        <Heading
          size={{ base: "3xl", md: "5xl" }}
          fontWeight="extrabold"
          lineHeight="tight"
          mb={4}
        >
          Your recipes.<br />Your community.
        </Heading>
        <Text
          fontSize={{ base: "md", md: "xl" }}
          opacity={0.8}
          maxW="520px"
          mx="auto"
          mb={8}
        >
          Discover hand-crafted brewing recipes, fine-tune your technique,
          and share what works with coffee lovers around the world.
        </Text>

        <HStack gap={3} justify="center" flexWrap="wrap">
          <Button asChild size="lg" colorPalette="orange">
            <Link to="/recipes">Browse Recipes</Link>
          </Button>
          {loggedInUser ? (
            <Button asChild size="lg" variant="outline">
              <Link to="/create">Share a Recipe</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline">
              <Link to="/signup">Join for Free</Link>
            </Button>
          )}
        </HStack>
      </Box>

      {/* Features */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={5} mt={12}>
        <FeatureCard
          icon={Coffee}
          title="Discover great brews"
          description="Browse a growing library of recipes for pour-over, espresso, AeroPress, and more — each with exact ratios and step-by-step guides."
        />
        <FeatureCard
          icon={BookOpen}
          title="Run your recipe"
          description="Follow along with the built-in step runner and timers so your hands stay free and your brew stays on track."
        />
        <FeatureCard
          icon={Users}
          title="Share with the community"
          description="Publish your favourite recipe, read reviews from other brewers, and help everyone make a better cup."
        />
      </SimpleGrid>

      {/* Recent recipes */}
      <Box mt={14}>
        <HStack justify="space-between" mb={5} align="baseline">
          <Heading size="xl">Recently added</Heading>
          <ChakraLink asChild fontSize="sm" opacity={0.7}>
            <Link to="/recipes">View all →</Link>
          </ChakraLink>
        </HStack>

        {isLoading ? (
          <Text opacity={0.5}>Loading recipes…</Text>
        ) : recentRecipes.length === 0 ? (
          <Text opacity={0.5}>No recipes yet — be the first to add one!</Text>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            gap={5}
          >
            {recentRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </Grid>
        )}
      </Box>

      {/* CTA — logged-out */}
      {!loggedInUser && (
        <Box
          mt={16}
          mb={8}
          p={{ base: 8, md: 14 }}
          bg="orange.50"
          _dark={{ bg: "orange.950" }}
          borderRadius="2xl"
          textAlign="center"
        >
          <Heading size="2xl" mb={3}>Ready to share your recipe?</Heading>
          <Text opacity={0.7} mb={7} maxW="460px" mx="auto">
            Join thousands of brewers who use BrewBook to document, refine,
            and share their craft.
          </Text>
          <HStack gap={3} justify="center" flexWrap="wrap">
            <Button asChild size="lg" colorPalette="orange">
              <Link to="/signup">Create a free account</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/login">Sign in</Link>
            </Button>
          </HStack>
        </Box>
      )}

      {/* CTA — logged-in */}
      {loggedInUser && (
        <Box
          mt={16}
          mb={8}
          p={{ base: 8, md: 14 }}
          bg="orange.50"
          _dark={{ bg: "orange.950" }}
          borderRadius="2xl"
          textAlign="center"
        >
          <Heading size="2xl" mb={3}>What are you brewing today?</Heading>
          <Text opacity={0.7} mb={7} maxW="460px" mx="auto">
            Document a new recipe or jump back into one of yours.
          </Text>
          <HStack gap={3} justify="center" flexWrap="wrap">
            <Button asChild size="lg" colorPalette="orange">
              <Link to="/create">Add a recipe</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/my-recipes">My recipes</Link>
            </Button>
          </HStack>
        </Box>
      )}

    </VStack>
  );
}
