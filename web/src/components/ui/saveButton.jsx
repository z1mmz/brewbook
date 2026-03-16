import { Button } from "@chakra-ui/react";
import { Heart } from "lucide-react";
import useSaveRecipe from "../../hooks/useSaveRecipe";
import useSavedRecipes from "../../hooks/useSavedRecipes";
import { useContext } from "react";
import LoginContext from "../../contexts/loginContext";

function SaveButton({ recipeId, size = "md", variant = "solid" }) {
  const { loggedInUser } = useContext(LoginContext);
  const saveRecipeMutation = useSaveRecipe();
  const { data } = useSavedRecipes();

  if (!loggedInUser) return null;

  const isSaved = (data?.recipes ?? []).some(
    (r) => r._id === recipeId || r.id === recipeId
  );

  const handleSave = (e) => {
    e.stopPropagation();
    saveRecipeMutation.mutate(recipeId);
  };

  return (
    <Button
      onClick={handleSave}
      size={size}
      variant={variant}
      colorPalette={isSaved ? "red" : "gray"}
      loading={saveRecipeMutation.isPending}
    >
      <Heart fill={isSaved ? "currentColor" : "none"} />
      {isSaved ? "Saved" : "Save"}
    </Button>
  );
}

export default SaveButton;
