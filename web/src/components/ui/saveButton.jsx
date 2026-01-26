import { Button } from "@chakra-ui/react";
import { Heart } from "lucide-react";
import useSaveRecipe from "../../hooks/useSaveRecipe";
import { useContext, useEffect, useState } from "react";
import LoginContext from "../../contexts/loginContext";
import recipeService from "../../services/recipes";

function SaveButton({ recipeId, size = "md", variant = "solid" }) {
  const { loggedInUser } = useContext(LoginContext);
  const [isSaved, setIsSaved] = useState(false);
  const saveRecipeMutation = useSaveRecipe();

  useEffect(() => {
    // Check if recipe is saved when component mounts or loggedInUser changes
    if (loggedInUser) {
      checkSaveStatus();
    }
  }, [loggedInUser, recipeId]);

  const checkSaveStatus = async () => {
    // This would require an endpoint to check if a recipe is saved
    // For now, we'll track it locally, but ideally the backend would provide this
    // You might want to add this info to the user context or store it locally
  };

  const handleSave = async (e) => {
    e.stopPropagation(); // Prevent triggering parent click handlers

    if (!loggedInUser) {
      alert("Please log in to save recipes");
      return;
    }

    try {
      const result = await saveRecipeMutation.mutateAsync(recipeId);
      setIsSaved(result.saved);
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe");
    }
  };

  if (!loggedInUser) {
    return null;
  }

  return (
    <Button
      onClick={handleSave}
      size={size}
      variant={variant}
      colorScheme={isSaved ? "red" : "gray"}
      isLoading={saveRecipeMutation.isPending}
      leftIcon={<Heart fill={isSaved ? "currentColor" : "none"} />}
    >
      {isSaved ? "Saved" : "Save"}
    </Button>
  );
}

export default SaveButton;
