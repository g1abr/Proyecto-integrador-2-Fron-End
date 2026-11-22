import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api-catalogo-peliculas-iu.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
