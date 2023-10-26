import axios from "axios";

const api_endPoint = "https://api.climatehealers.com/"
// const api_endPoint = "https://foodhealers.climatehealers.com/"
// const api_endPoint = "https://ec13-117-211-30-66.ngrok-free.app"

const API = axios.create({
    baseURL: api_endPoint,
})

export default API;

