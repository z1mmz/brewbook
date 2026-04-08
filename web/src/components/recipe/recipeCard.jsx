import {
    Card,
    HStack,
    Text
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
export default function RecipeCard({ recipe }) {
    const navigate = useNavigate();
    return (    <Card.Root
          onClick={() => navigate(`/recipes/${recipe.id}`)}
          cursor="pointer"
          _hover={{ shadow: "md", transform: "translateY(-2px)" }}
          transition="all 0.15s"
        >
          <Card.Header pb={1}>
            <Text fontWeight="bold" lineClamp={1}>{recipe.title}</Text>
            <Text fontSize="sm" opacity={0.6}>
              by {recipe.user?.username ?? "Unknown"}
            </Text>
          </Card.Header>
          <Card.Body pt={0}>
            <HStack gap={4} fontSize="sm" opacity={0.8}>
              <Text>☕ {recipe.dose}g</Text>
              <Text>💧 {recipe.water}ml</Text>
              <Text>⚙️ {recipe.grind}</Text>
            </HStack>
            {recipe.description && (
              <Text fontSize="sm" mt={2} opacity={0.7} lineClamp={2}>
                {recipe.description}
              </Text>
            )}
          </Card.Body>
        </Card.Root>
)
}