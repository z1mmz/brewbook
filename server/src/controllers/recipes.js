const jwt = require("jsonwebtoken");
const recipeRouter = require("express").Router();
const { default: mongoose } = require("mongoose");
const Recipe = require("../models/recipe");
const User = require("../models/user");
const middleware = require("../utils/middleware");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

recipeRouter.get("/", async (request, response) => {
  let { page, pageSize } = request.query;
  page = parseInt(page) || 1;
  pageSize = Math.min(parseInt(pageSize) || 10, 100); // Limit pageSize to 100 max so stop abuse
  try {
    // Use aggregation to get paginated results along with total count
    const recipes = await Recipe.aggregate([
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ]);
    await User.populate(recipes[0].data, { path: "user" }); // Populate user field

    // Return paginated results with metadata
    return response.status(200).json({
      metadata: {
        totalCount: recipes[0].metadata[0].total,
        page,
        pageSize,
      },
      recipes: recipes[0].data,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
});

recipeRouter.get("/recent", async (request, response) => {
  try {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 }).limit(5);
    response.json(recipes);
  } catch (error) {
    console.error("Error fetching recent recipes:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});
recipeRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const recipe = await Recipe.findById(id);
  response.json(recipe);
});

recipeRouter.get("/user/:userId", async (request, response) => {
  let { page, pageSize } = request.query;
  const { userId } = request.params;

  page = parseInt(page) || 1;
  pageSize = Math.min(parseInt(pageSize) || 10, 100);

  try {
    // Use aggregation to get paginated results for a specific user
    const recipes = await Recipe.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ]);

    await User.populate(recipes[0].data, { path: "user" });

    return response.status(200).json({
      metadata: {
        totalCount: recipes[0].metadata[0]?.total || 0,
        page,
        pageSize,
      },
      recipes: recipes[0].data,
    });
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
});

recipeRouter.post("/", middleware.userExtractor, async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(400).json({ error: "UserId missing or not valid" });
  }

  const recipe = new Recipe(request.body);
  recipe.user = user.id;
  const result = await recipe.save();
  user.recipes = user.recipes.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

recipeRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const id = request.params.id;
    const recipe = await Recipe.findById(id).populate("user");
    const user = request.user;
    if (!user) {
      return response
        .status(400)
        .json({ error: "UserId missing or not valid" });
    }
    if (blog.user.id === user.id) {
      await Recipe.findByIdAndDelete(id);
      response.status(204).end();
    } else {
      response.status(401).json({
        error: "unauthorized",
      });
    }
  },
);

recipeRouter.post(
  "/:id/save",
  middleware.userExtractor,
  async (request, response) => {
    const recipeId = request.params.id;
    const user = request.user;

    if (!user) {
      return response
        .status(400)
        .json({ error: "UserId missing or not valid" });
    }

    try {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return response.status(404).json({ error: "Recipe not found" });
      }

      // Check if recipe is already saved
      const isSaved = user.savedRecipes.includes(recipeId);

      if (isSaved) {
        // Remove from saved
        user.savedRecipes = user.savedRecipes.filter(
          (id) => id.toString() !== recipeId,
        );
      } else {
        // Add to saved
        user.savedRecipes = user.savedRecipes.concat(recipeId);
      }

      await user.save();
      response.status(200).json({ saved: !isSaved, user });
    } catch (error) {
      console.error("Error saving recipe:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },
);

recipeRouter.get(
  "/saved/all",
  middleware.userExtractor,
  async (request, response) => {
    let { page, pageSize } = request.query;
    const user = request.user;

    if (!user) {
      return response
        .status(400)
        .json({ error: "UserId missing or not valid" });
    }

    page = parseInt(page) || 1;
    pageSize = Math.min(parseInt(pageSize) || 10, 100);

    try {
      // Use aggregation to get paginated saved recipes
      const recipes = await Recipe.aggregate([
        {
          $match: {
            _id: {
              $in: user.savedRecipes.map(
                (id) => new mongoose.Types.ObjectId(id),
              ),
            },
          },
        },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
          },
        },
      ]);

      await User.populate(recipes[0].data, { path: "user" });

      return response.status(200).json({
        metadata: {
          totalCount: recipes[0].metadata[0]?.total || 0,
          page,
          pageSize,
        },
        recipes: recipes[0].data,
      });
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  },
);
module.exports = recipeRouter;
