import useRecipes from "../hooks/useRecipes";
import { Link } from "react-router";
import {
  Card,
  Grid,
  Button,
  HStack,
  VStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { useState } from "react";
function RecipeList(user = null) {
  const [page, setPage] = useState(1);
  const pageSize = useBreakpointValue({ base: 2, sm: 2, md: 8 });
  if (user) {
    console.log("Fetching recipes for user:", user);
  } else {
    console.log("Fetching all recipes");
  }
  const { data } = useRecipes({ page, pageSize });
  const { metadata, recipes } = data;
  console.log("RecipeList recipes:", recipes);
  console.log("RecipeList metadata:", metadata);

  const totalPages = Math.max(
    1,
    Math.ceil((metadata.totalCount ?? 0) / pageSize)
  );
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  console.log("hasPrev:", hasPrev, "hasNext:", hasNext);

  const navigate = useNavigate();
  return (
    <VStack spacing={4} align="stretch">
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
            {" "}
            <Card.Root
              onClick={() => navigate(`/recipes/${recipe._id}`)}
              bg={{ _hover: "tan" }}
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
    </VStack>
  );
}

export default RecipeList;
