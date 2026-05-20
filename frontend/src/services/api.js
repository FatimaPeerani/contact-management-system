import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const changePassword = (data) => api.post('/auth/change-password', data);

// Contact APIs
export const getContacts = (page = 0, size = 10) => api.get(`/contacts?page=${page}&size=${size}`);
export const searchContacts = (keyword, page = 0, size = 10) => api.get(`/contacts/search?keyword=${keyword}&page=${page}&size=${size}`);
export const createContact = (data) => api.post('/contacts', data);
export const updateContact = (id, data) => api.put(`/contacts/${id}`, data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);

// User APIs
export const getUserProfile = () => api.get('/user/profile');

export default api;