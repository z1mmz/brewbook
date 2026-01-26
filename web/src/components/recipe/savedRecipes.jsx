import { useState, useContext } from "react";
import useSavedRecipes from "../../hooks/useSavedRecipes";
import LoginContext from "../../contexts/loginContext";
import {
  Card,
  Grid,
  Button,
  HStack,
  VStack,
  Text,
  useBreakpointValue,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";

function SavedRecipes() {
  const [page, setPage] = useState(1);
  const { loggedInUser } = useContext(LoginContext);
  const pageSize = useBreakpointValue({ base: 2, sm: 2, md: 8 });
  const { data } = useSavedRecipes({ page, pageSize });
  const { metadata, recipes } = data;

  const navigate = useNavigate();

  if (!loggedInUser) {
    return (
      <VStack spacing={4} align="center" mt={8}>
        <Heading>Saved Recipes</Heading>
        <Text>Please log in to view your saved recipes.</Text>
        <Button onClick={() => navigate("/login")} colorScheme="blue">
          Log In
        </Button>
      </VStack>
    );
  }

  const totalPages = Math.max(
    1,
    Math.ceil((metadata.totalCount ?? 0) / (pageSize || 8))
  );
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <VStack spacing={4} align="stretch">
      <Heading mt={4} mb={4}>
        Saved Recipes
      </Heading>

      {recipes.length === 0 ? (
        <VStack spacing={4} align="center" mt={8}>
          <Text>You haven't saved any recipes yet.</Text>
          <Button onClick={() => navigate("/recipes")} colorScheme="green">
            Browse Recipes
          </Button>
        </VStack>
      ) : (
        <>
          <HStack justify="space-between" mt={4}>
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrev}
            >
              Prev
            </Button>

            <Text>
              Page {page} of {totalPages}
            </Text>

            <Button onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>
              Next
            </Button>
          </HStack>

          <Grid
            mt={4}
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            }}
            gap="6"
          >
            {recipes.map((recipe) => (
              <div key={recipe._id}>
                <Card.Root
                  onClick={() => navigate(`/recipes/${recipe._id}`)}
                  _hover={{ bg: "tan", cursor: "pointer" }}
                >
                  <Card.Header>
                    <b>{recipe.title}</b>
                  </Card.Header>
                  <Card.Body>
                    <p>Dose: {recipe.dose}g</p>
                    <p>Grind: {recipe.grind}</p>
                    <p>Water: {recipe.water}ml</p>
                  </Card.Body>
                  <Card.Footer justifyContent="flex-end">
                    <Button
                      onClick={() => navigate(`/recipes/${recipe._id}`)}
                      variant="outline"
                    >
                      View
                    </Button>
                  </Card.Footer>
                </Card.Root>
              </div>
            ))}
          </Grid>
        </>
      )}
    </VStack>
  );
}

export default SavedRecipes;
