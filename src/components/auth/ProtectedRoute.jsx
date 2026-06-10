import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

/**
 * HOC/Componente que protege una vista o un layout.
 * Si el usuario no ha iniciado sesión, lo redirige automáticamente a la pantalla de Auth0.
 * Durante la comprobación de credenciales, muestra una pantalla de carga limpia y moderna.
 */
const ProtectedRoute = ({ component, ...args }) => {
  const SecuredComponent = withAuthenticationRequired(component, {
    // Componente visual a mostrar mientras Auth0 realiza la redirección
    onRedirecting: () => (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-55 dark:bg-slate-900 p-6 text-center">
        <div className="relative flex items-center justify-center mb-4">
          {/* Spinner dinámico con la paleta de colores del proyecto */}
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 dark:border-t-blue-500"></div>
        </div>
        <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 mb-1">
          Verificando Credenciales
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          Por favor espera un momento mientras validamos tu sesión de forma segura.
        </p>
      </div>
    ),
  });

  return <SecuredComponent {...args} />;
};

export default ProtectedRoute;
