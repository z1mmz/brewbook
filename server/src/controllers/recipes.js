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

recipeRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const recipe = await Recipe.findById(id);
  response.json(recipe);
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
  }
);
module.exports = recipeRouter;
