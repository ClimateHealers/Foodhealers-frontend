import axios from "axios";

const api_endPoint = "https://api.climatehealers.com/"
// const api_endPoint = "https://dd48-49-207-214-157.in.ngrok.io"

const API = axios.create({
    baseURL: api_endPoint,
})

export default API;