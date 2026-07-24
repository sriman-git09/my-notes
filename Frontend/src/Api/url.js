import axios from "axios";

const api = axios.create({
  baseURL: "https://my-notes-jafj.onrender.com/api/v1/noteapp/", // Use this if your backend routes require this prefix
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
