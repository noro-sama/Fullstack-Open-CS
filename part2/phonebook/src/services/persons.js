import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const persons = axios.get(baseUrl);
  return persons
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("Failed to fetch contacts", err);
    });
};

const create = (content) => {
  const request = axios.post(baseUrl, content);
  return request.then((res) => res.data);
};

const deleteItem = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request;
};

const updateNumber = (id, content) => {
  const request = axios.put(`${baseUrl}/${id}`, content);
  return request.then((res) => res.data);
};

export default {
  getAll,
  create,
  deleteItem,
  updateNumber,
};
