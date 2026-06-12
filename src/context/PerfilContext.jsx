import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ShieldAlert, LogOut, Mail, Loader2 } from 'lucide-react';
import usuarioService from '../services/usuarioService';

/**
 * Contexto global del perfil del usuario autenticado.
 *
 * Proporciona los datos del usuario cargados desde el backend (GET /api/usuarios/me)
 * a todo el árbol de componentes, evitando consultas repetidas y controlando la autorización local.
 */
const PerfilContext = createContext(null);

export const PerfilProvider = ({ children }) => {
  const { isAuthenticated, isLoading: auth0Loading, user, logout, getAccessTokenSilently } = useAuth0();

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null); // 'unauthorized' | 'inactive' | 'other'

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorType(null);

      // Obtener el token directamente antes de la petición para evitar condiciones de carrera con el interceptor de Axios
      let token = null;
      try {
        token = await getAccessTokenSilently();
      } catch (tokenErr) {
        console.warn("No se pudo obtener el token de acceso de Auth0 de forma silenciosa:", tokenErr);
      }

      const data = await usuarioService.obtenerPerfil(token);
      setPerfil(data);
    } catch (err) {
      console.error('Error cargando perfil del usuario:', err);

      const status = err.response?.status;
      const backendError = err.response?.data?.error;

      if (status === 403) {
        if (backendError === 'inactive_user') {
          setError('Tu cuenta se encuentra inactiva en el sistema.');
          setErrorType('inactive');
        } else {
          setError('Este correo electrónico no está registrado en el sistema.');
          setErrorType('unauthorized');
        }
      } else if (status === 401) {
        setError('Sesión no válida o expirada. Vuelve a iniciar sesión.');
        setErrorType('other');
      } else {
        setError('Error al cargar tu perfil. Intenta de nuevo más tarde.');
        setErrorType('other');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // 1. Pantalla de carga mientras se consulta el perfil local
  if (isAuthenticated && loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-6 text-center">
        <div className="relative flex items-center justify-center mb-4">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-500" />
        </div>
        <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 mb-1">
          Validando Autorización
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          Comprobando tus permisos y cargando tu rol asignado...
        </p>
      </div>
    );
  }

  // 2. Pantalla de Acceso Denegado para CUALQUIER error o perfil no cargado
  //    Bloquea el acceso si: hay error (cualquier tipo) O si el perfil es null después de cargar.
  //    Esto garantiza que SOLO usuarios registrados y activos en la BD local puedan ver la app.
  if (isAuthenticated && !loading && (error || !perfil)) {
    // Determinar el mensaje y título según el tipo de error
    const esNoRegistrado = errorType === 'unauthorized';
    const esInactivo = errorType === 'inactive';

    const titulo = esInactivo ? 'Cuenta Inactiva' : 'Acceso Denegado';
    const mensaje = error || 'No se pudo verificar tu autorización en el sistema.';
    const descripcion = esInactivo
      ? 'Tu cuenta ha sido desactivada por un administrador. Contacta con soporte si crees que es un error.'
      : 'El sistema de TrackGarage requiere registro previo. Si eres un nuevo técnico o administrador, por favor contacta con el administrador del sistema para que cree tu cuenta.';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-6 text-center">
        <div className="p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl max-w-md shadow-xl">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-200/50 dark:border-rose-800/30">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-black text-slate-800 dark:text-white mb-2">
            {titulo}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            {mensaje}
          </p>

          <div className="flex items-center gap-2 justify-center px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl mb-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <Mail className="w-3.5 h-3.5" />
            <span>{user?.email}</span>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 leading-relaxed">
            {descripcion}
          </p>

          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión / Cambiar Cuenta
          </button>
        </div>
      </div>
    );
  }

  return (
    <PerfilContext.Provider value={value}>
      {children}
    </PerfilContext.Provider>
  );
};

export const usePerfil = () => {
  const context = useContext(PerfilContext);
  if (!context) {
    throw new Error('usePerfil debe ser usado dentro de un <PerfilProvider>');
  }
  return context;
};

export default PerfilContext;
