import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://resiflowproject.onrender.com/',
    withCredentials: true, // Important for cookies
});

// Interceptor to handle token refresh logic if needed
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Wait for refresh logic here if applicable, or redirect to login
            // For now, if refresh token fails or isn't handled here, we just reject
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;
