import axios from 'axios';

const api = axios.create({
    baseURL: 'https://floating-brushlands-74410.herokuapp.com'
});

export default api;