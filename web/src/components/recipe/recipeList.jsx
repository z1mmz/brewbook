import useRecipes from "../../hooks/useRecipes";
import {
  Card,
  Grid,
  Button,
  HStack,
  VStack,
  Text,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import RecipeCard from "./recipeCard";
function RecipeList() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const pageSize = useBreakpointValue({ base: 2, sm: 2, md: 8 });

  // Debounce: wait 400ms after the user stops typing before querying
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data } = useRecipes({ page, pageSize, search });
  const { metadata, recipes } = data;

  const totalPages = Math.max(
    1,
    Math.ceil((metadata.totalCount ?? 0) / pageSize)
  );
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <VStack spacing={4} align="stretch">
      <Input
        mt={4}
        placeholder="Search recipes by title, description, grind, type…"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <HStack justify="space-between">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!hasPrev}
        >
          Prev
        </Button>

        <Text>
          {search
            ? `${metadata.totalCount ?? 0} result${metadata.totalCount === 1 ? "" : "s"}`
            : `Page ${page} of ${totalPages}`}
        </Text>

        <Button onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>
          Next
        </Button>
      </HStack>

      {recipes.length === 0 && search ? (
        <Text color="gray.500" textAlign="center" mt={8}>
          No recipes found for &ldquo;{search}&rdquo;
        </Text>
      ) : (
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
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </Grid>
      )}
    </VStack>
  );
}

export default RecipeList;
