import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Link as ChakraLink } from "@chakra-ui/react";
export default function Welcome() {
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentRecipes = async () => {
    try {
      const response = await fetch("/api/recipes/recent");
      const data = await response.json();
      setRecentRecipes(data);
    } catch (error) {
      console.error("Error fetching recent recipes:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecentRecipes();
  }, []);

  return (
    <div className="welcome-container">
      <h1>Welcome to BrewBook</h1>
      <p>Discover and share your favorite recipes</p>

      <section className="top-recipes">
        <h2>Recently created recipes</h2>
        {loading ? (
          <p>Loading recipes...</p>
        ) : (
          <div className="recipes-grid">
            {recentRecipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <h3>
                  <ChakraLink asChild variant={"underline"} fontWeight="normal">
                    <Link to={`/recipes/${recipe.id}`}>
                      {recipe.title} by {recipe.user?.name || "Unknown User"}
                    </Link>
                  </ChakraLink>
                </h3>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
