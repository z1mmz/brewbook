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
  const recipes = await Recipe.find({}).populate("user");
  response.json(recipes);
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
