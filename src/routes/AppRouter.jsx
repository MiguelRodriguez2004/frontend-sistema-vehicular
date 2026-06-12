import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import OrdenesPage from '../pages/OrdenesPage';
import NuevaOrdenPage from '../pages/NuevaOrdenPage';
import DetalleOrdenPage from '../pages/DetalleOrdenPage';
import PerfilPage from '../pages/PerfilPage';
import ConfiguracionPage from '../pages/ConfiguracionPage';
import AdminUsuariosPage from '../pages/AdminUsuariosPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';

/**
 * Enrutador principal de la aplicación.
 * Define la estructura de rutas anidadas bajo el layout principal y maneja redirecciones.
 * Nota: El componente BrowserRouter se movió a main.jsx para permitir el uso de react-router en Auth0Provider.
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas base protegidas por el layout principal */}
      <Route path="/" element={<ProtectedRoute component={MainLayout} />}>
        {/* Redirección automática de la ruta raíz hacia el listado de órdenes */}
        <Route index element={<Navigate to="/ordenes" replace />} />
        
        {/* Vistas operativas */}
        <Route path="ordenes" element={<OrdenesPage />} />
        <Route path="ordenes/nueva" element={<NuevaOrdenPage />} />
        <Route path="ordenes/:id" element={<DetalleOrdenPage />} />

        {/* Perfil y Configuración del usuario */}
        <Route path="perfil" element={<PerfilPage />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />

        {/* Administración (solo accesible por ADMIN, protegido en el componente) */}
        <Route path="admin/usuarios" element={<AdminUsuariosPage />} />
      </Route>

      {/* Control de ruta no encontrada - Página 404 estética */}
      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-6 text-center">
            <h1 className="text-7xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              404
            </h1>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
              Sección No Encontrada
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm leading-relaxed">
              Lo sentimos, la página que buscas no existe o ha sido trasladada a otra ubicación.
            </p>
            <a
              href="/ordenes"
              className="px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-200"
            >
              Volver a Órdenes de Trabajo
            </a>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRouter;
