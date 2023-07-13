import axios from "axios";

const api = axios.create({
  baseURL: "https://ticket-manager-sree.onrender.com/api",
});
export default api;
