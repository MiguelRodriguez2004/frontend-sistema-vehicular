import AppRouter from './routes/AppRouter';
import AxiosInterceptor from './api/AxiosInterceptor';

/**
 * Componente principal de la aplicación.
 * Renderiza el enrutador global AppRouter envuelto en el AxiosInterceptor.
 */
function App() {
  return (
    <AxiosInterceptor>
      <AppRouter />
    </AxiosInterceptor>
  );
}

export default App;
