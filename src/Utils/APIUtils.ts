import axios from "axios";

const api_endPoint = "https://api.climatehealers.com/"
// const api_endPoint = "http://127.0.0.1:8000/"

const API = axios.create({
    baseURL: api_endPoint,
})

export default API;