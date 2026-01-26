import axios from "axios";
const baseUrl = "/api/recipes";

let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
  console.log(token);
};

const getAll = (params = {}) => {
  console.log("Fetching recipes with params:", params);
  const request = axios.get(baseUrl, { params });
  return request.then((response) => response.data);
};
const getRecipe = (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};
const createRecipe = async (recipe) => {
  console.log("creating recipe", recipe);
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, recipe, config);
  return response.data;
};

const getByUser = (userId, params = {}) => {
  console.log("Fetching recipes for user:", userId);
  const request = axios.get(`${baseUrl}/user/${userId}`, { params });
  return request.then((response) => response.data);
};

const toggleSaveRecipe = async (recipeId) => {
  console.log("Toggling save for recipe:", recipeId);
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(`${baseUrl}/${recipeId}/save`, {}, config);
  return response.data;
};

const getSavedRecipes = (params = {}) => {
  console.log("Fetching saved recipes with params:", params);
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.get(`${baseUrl}/saved/all`, { params, ...config });
  return request.then((response) => response.data);
};

export default {
  getAll,
  getRecipe,
  createRecipe,
  getByUser,
  toggleSaveRecipe,
  getSavedRecipes,
  setToken,
};
