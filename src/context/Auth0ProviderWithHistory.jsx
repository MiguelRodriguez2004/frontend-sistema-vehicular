import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

/**
 * Envoltorio para Auth0Provider que integra las redirecciones de Auth0
 * con el enrutamiento interno de React Router (useNavigate).
 */
const Auth0ProviderWithHistory = ({ children }) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  // Si no se han configurado las credenciales, advertimos por consola
  // y renderizamos los hijos sin protección para evitar romper el desarrollo local
  if (!domain || !clientId) {
    console.warn(
      'Auth0: Faltan variables de entorno VITE_AUTH0_DOMAIN o VITE_AUTH0_CLIENT_ID. ' +
      'El login de Auth0 no estará disponible.'
    );
    return <>{children}</>;
  }

  // Callback ejecutado tras un inicio de sesión exitoso en Auth0
  const onRedirectCallback = (appState) => {
    // Redirige al usuario a la URL de origen guardada en el estado o a la raíz
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        // Inyectamos la audiencia para que Auth0 nos firme un token JWT de acceso válido
        // para nuestro servidor backend, en lugar de un token de opaco de perfil.
        ...(audience && { audience }),
      }}
      onRedirectCallback={onRedirectCallback}
      // Habilita el refresco de tokens en segundo plano usando Web Workers (práctica recomendada)
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
