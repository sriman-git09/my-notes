import axios from "axios";

const BACKEND_URL = axios.create({
  baseURL: "https://my-notes-jafj.onrender.com",
});

export default BACKEND_URL;
