import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import usuarioService from '../services/usuarioService';

/**
 * Contexto global del perfil del usuario autenticado.
 *
 * Proporciona los datos del usuario cargados desde el backend (GET /api/usuarios/me)
 * a todo el árbol de componentes, evitando consultas repetidas.
 *
 * Expone:
 * - perfil: Datos del usuario (nombre, email, rol, activo, createdAt)
 * - loading: true mientras se cargan los datos
 * - error: Mensaje de error si la carga falla
 * - isAdmin: true si el rol del usuario es ADMIN
 * - refrescarPerfil: Función para recargar los datos del perfil manualmente
 */
const PerfilContext = createContext(null);

export const PerfilProvider = ({ children }) => {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.obtenerPerfil();
      setPerfil(data);
    } catch (err) {
      console.error('Error cargando perfil del usuario:', err);

      const status = err.response?.status;
      if (status === 403) {
        setError('Tu cuenta no está registrada en el sistema. Contacta a un administrador.');
      } else if (status === 401) {
        setError('Sesión no válida. Vuelve a iniciar sesión.');
      } else {
        setError('Error al cargar tu perfil. Intenta de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Solo cargar si Auth0 terminó su verificación y el usuario está autenticado
    if (!auth0Loading && isAuthenticated) {
      cargarPerfil();
    } else if (!auth0Loading && !isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, auth0Loading]);

  const isAdmin = perfil?.rol === 'ADMIN';

  const value = {
    perfil,
    loading,
    error,
    isAdmin,
    refrescarPerfil: cargarPerfil,
  };

  return (
    <PerfilContext.Provider value={value}>
      {children}
    </PerfilContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto del perfil.
 * Debe ser usado dentro de un componente hijo de PerfilProvider.
 */
export const usePerfil = () => {
  const context = useContext(PerfilContext);
  if (!context) {
    throw new Error('usePerfil debe ser usado dentro de un <PerfilProvider>');
  }
  return context;
};

export default PerfilContext;
