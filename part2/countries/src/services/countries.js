import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/";
const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

const getAll = () => {
  const request = axios.get(`${baseUrl}/api/all`);
  return request
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

export async function getWeather(city) {
  if (!city) return;

  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
  );
  const data = response.data;
  return data;
}

export default {
  getAll,
  create,
  deleteItem,
  updateNumber,
};
