import React, { useEffect } from 'react';
import axiosInstance from './axiosInstance';

/**
 * Componente que inyecta de forma transparente el Token de Acceso JWT
 * desde localStorage en todas las peticiones salientes realizadas a través de Axios.
 */
const AxiosInterceptor = ({ children }) => {
  useEffect(() => {
    const interceptorId = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Ejecta (desregistra) el interceptor cuando el componente se desmonta
    return () => {
      axiosInstance.interceptors.request.eject(interceptorId);
    };
  }, []);

  return <>{children}</>;
};

export default AxiosInterceptor;
