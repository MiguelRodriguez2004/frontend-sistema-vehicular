import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from './axiosInstance';

/**
 * Componente que inyecta de forma transparente el Token de Acceso JWT
 * en todas las peticiones salientes realizadas a través de la instancia de Axios.
 */
const AxiosInterceptor = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    // Si no está autenticado o no hay variables de Auth0 configuradas, no registramos el interceptor
    if (!isAuthenticated) return;

    const interceptorId = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          // Obtiene el token de acceso de Auth0 (de forma silenciosa utilizando caché o refresh tokens)
          const token = await getAccessTokenSilently();
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error('Error al obtener el Token de Acceso de Auth0 para Axios:', error);
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
  }, [getAccessTokenSilently, isAuthenticated]);

  return <>{children}</>;
};

export default AxiosInterceptor;
