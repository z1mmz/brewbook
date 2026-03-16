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

const updateRecipe = async (id, recipe) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.put(`${baseUrl}/${id}`, recipe, config);
  return response.data;
};

const deleteRecipe = async (id) => {
  const config = { headers: { Authorization: token } };
  await axios.delete(`${baseUrl}/${id}`, config);
};

const getRecent = () =>
  axios.get(`${baseUrl}/recent`).then((r) => r.data);

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
  getRecent,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getByUser,
  toggleSaveRecipe,
  getSavedRecipes,
  setToken,
};
