import useRecipes from "../hooks/useRecipes";
import { Link } from "react-router";
import { Card, Grid, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router";
function RecipeList() {
  const { recipes } = useRecipes();
  console.log("Recipes in App.jsx:", recipes);
  const navigate = useNavigate();
  return (
    <Grid mt={4} templateColumns="repeat(3, 1fr)" gap="6">
      {" "}
      {recipes.map((recipe) => (
        <Card.Root
          onClick={() => navigate(`/recipes/${recipe.id}`)}
          key={recipe.id}
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
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              variant="outline"
            >
              View
            </Button>
          </Card.Footer>
        </Card.Root>
      ))}
    </Grid>
  );
}

export default RecipeList;
