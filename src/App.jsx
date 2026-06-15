import AppRouter from './routes/AppRouter';
import { PerfilProvider } from './context/PerfilContext';

/**
 * Componente principal de la aplicación.
 * Renderiza el proveedor de perfil y el enrutador.
 */
function App() {
  return (
    <PerfilProvider>
      <AppRouter />
    </PerfilProvider>
  );
}

export default App;
