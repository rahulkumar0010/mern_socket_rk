import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4001/api/v1",
  timeout: 1000,
});

export default API;
