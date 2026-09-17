import axios from "axios";
const baseUrl = "/api/recipes";

let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = (params = {}) => {
  const request = axios.get(baseUrl, { params });
  return request.then((response) => response.data);
};
const getRecipe = (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};
const createRecipe = async (recipe) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, recipe, config);
  return response.data;
};

const getByUser = (userId, params = {}) => {
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
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(`${baseUrl}/${recipeId}/save`, {}, config);
  return response.data;
};

const getSavedRecipes = (params = {}) => {
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
