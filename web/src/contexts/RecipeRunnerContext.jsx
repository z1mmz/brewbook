import { createContext, useContext } from "react";

export const RecipeRunnerContext = createContext(null);

export function useRecipeRunnerContext() {
  const context = useContext(RecipeRunnerContext);
  if (!context) {
    throw new Error(
      "useRecipeRunnerContext must be used within RecipeRunnerProvider"
    );
  }
  return context;
}
