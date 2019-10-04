import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: 
            'Client-ID 98e6e3d80fac3caba2ab4c21afbe9bba1966dd3c3ab7b9f71e38b1af7da049fa'
    },
});