import AppRouter from './routes/AppRouter';
import AxiosInterceptor from './api/AxiosInterceptor';
import { useAuth0 } from '@auth0/auth0-react';
import { PerfilProvider } from './context/PerfilContext';

/**
 * Componente principal de la aplicación.
 * Captura errores globales de Auth0 para evitar bucles de redirección
 * y proveer guía de depuración, luego renderiza el interceptor y el enrutador.
 */
function App() {
  const { error, isLoading } = useAuth0();

  // Si hay un error de comunicación o configuración con Auth0
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-6 text-center">
        <div className="p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 rounded-2xl max-w-lg shadow-sm">
          <h1 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-2">
            Error de Configuración (Auth0)
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 font-semibold leading-relaxed">
            {error.message}
          </p>
          <div className="text-left text-xs bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 font-mono mb-5 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            <strong className="text-slate-700 dark:text-slate-300 block mb-1">Pasos sugeridos para solucionar:</strong>
            1. Ve al Dashboard de Auth0 (<a href="https://manage.auth0.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">manage.auth0.com</a>).<br />
            2. En el menú izquierdo, ve a <strong className="text-slate-700 dark:text-slate-200">Applications ➔ APIs</strong>.<br />
            3. Verifica si tienes creada una API con el Identificador (Audience) exacto:<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<code className="bg-slate-100 dark:bg-slate-850 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400 font-bold">https://api.sistema-vehicular.com</code><br />
            4. Si no existe, créala usando ese mismo identificador.
          </div>
          <button
            onClick={() => {
              // Limpiar query params de error de la URL y recargar
              window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
              window.location.reload();
            }}
            className="px-5 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition-all duration-200 cursor-pointer"
          >
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  return (
    <AxiosInterceptor>
      <PerfilProvider>
        <AppRouter />
      </PerfilProvider>
    </AxiosInterceptor>
  );
}

export default App;
