import {
    Card,
    Button
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
export default function RecipeCard({ recipe }) {
    const navigate = useNavigate();
    return (<div key={recipe._id}>
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
    </div>)
}