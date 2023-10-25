import axios from "axios";

const api_endPoint = "https://api.climatehealers.com/"
// const api_endPoint = "https://foodhealers.climatehealers.com/"
// const api_endPoint = "https://7ba7-117-216-168-17.ngrok-free.app"

const API = axios.create({
    baseURL: api_endPoint,
})

export default API;

