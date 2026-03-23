import axios from "axios";

const baseUrl = "/api/beans";
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getMyBeans = () =>
  axios.get(baseUrl, { headers: { Authorization: token } }).then((r) => r.data);

const createBean = (bean) =>
  axios.post(baseUrl, bean, { headers: { Authorization: token } }).then((r) => r.data);

const updateBean = (id, bean) =>
  axios.put(`${baseUrl}/${id}`, bean, { headers: { Authorization: token } }).then((r) => r.data);

const deleteBean = (id) =>
  axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: token } });

const getSimilarRecipes = (id) =>
  axios.get(`${baseUrl}/${id}/similar-recipes`, { headers: { Authorization: token } }).then((r) => r.data);

export default { setToken, getMyBeans, createBean, updateBean, deleteBean, getSimilarRecipes };
