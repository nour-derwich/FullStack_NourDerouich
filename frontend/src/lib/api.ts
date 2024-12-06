import axios from "axios";

const baseURL = 'http://localhost:3000/api/products';

const api = axios.create({
    baseURL: baseURL,
    
});



export default api;