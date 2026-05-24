import axios from 'axios';

// Instancia base de Axios para llamadas a la API del backend
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;