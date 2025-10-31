import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:9191' // API Gateway URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    config => {
        // Get the token from local storage
        const token = localStorage.getItem('token');

        // If the token exists, add it to the Authorization header
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }

        return config;
    },
    error => {
        // Do something with request error
        return Promise.reject(error);
    }
);

export default axiosInstance;