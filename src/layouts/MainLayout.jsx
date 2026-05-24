import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

/**
 * Layout principal de la aplicación.
 * Coordina el Sidebar fijo, el Navbar superior y el scroll independiente del contenido principal.
 */
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar de navegación */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenedor principal con margen izquierdo correspondiente al Sidebar en escritorios */}
      <div className="flex flex-col md:pl-64 min-h-screen">
        {/* Navbar superior */}
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />

        {/* Área del contenido principal con scroll independiente y límite de ancho fluido */}
        <main className="flex-grow p-6 overflow-y-auto w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
