import axios from "axios";
const baseUrl = "/api/reviews";

let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getByRecipe = (recipeId) =>
  axios.get(baseUrl, { params: { recipe: recipeId } }).then((r) => r.data);

const createReview = (review) =>
  axios
    .post(baseUrl, review, { headers: { Authorization: token } })
    .then((r) => r.data);

const deleteReview = (id) =>
  axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: token } });

export default { getByRecipe, createReview, deleteReview, setToken };
