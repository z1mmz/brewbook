const mongoose = require("mongoose");
const User = require("./user");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dose: {
    type: Number,
    required: true,
  },
  grind: {
    type: String,
    required: true,
  },
  water: {
    type: Number,
    required: true,
  },
  steps: {
    type: JSON,
    required: true,
  },
  reviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
recipeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
