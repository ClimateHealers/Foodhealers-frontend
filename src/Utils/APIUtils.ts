import axios from "axios";

const api_endPoint = "https://api.climatehealers.com/"

const API = axios.create({
    baseURL: api_endPoint,
})

export default API;