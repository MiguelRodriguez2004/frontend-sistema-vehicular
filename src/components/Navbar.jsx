import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, Settings, UserCircle, ChevronDown } from 'lucide-react';
import { usePerfil } from '../context/PerfilContext';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Navbar superior desacoplado y reutilizable.
 * Muestra el título de la página actual dinámicamente y posee un menú interactivo
 * de perfil de usuario con acciones rápidas integradas con PerfilContext.
 */
const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { logout } = useAuth();
  const { perfil, isAdmin } = usePerfil();

  const rolLabels = { ADMIN: 'Administrador', TECNICO: 'Técnico' };

  // Datos del usuario
  const displayName = perfil?.nombre || 'Usuario';
  const displayEmail = perfil?.email || '';
  const displayRole = perfil?.rol ? (rolLabels[perfil.rol] || perfil.rol) : 'Usuario';

  // Función para determinar el título de la vista según la ruta actual
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/ordenes') return 'Órdenes de Trabajo';
    if (path === '/ordenes/nueva') return 'Registrar Nueva Orden';
    if (path.startsWith('/ordenes/')) return 'Detalle de Orden';
    if (path === '/perfil') return 'Mi Perfil';
    if (path === '/configuracion') return 'Configuración';
    if (path === '/admin/usuarios') return 'Administración de Usuarios';
    return 'TrackGarage';
  };

  // Cerrar el menú desplegable al hacer clic fuera del mismo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700/50 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Botón de Hamburguesa para responsive */}
        <button
          onClick={onMenuToggle}
          type="button"
          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg md:hidden hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          aria-label="Abrir menú lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Título Dinámico de la Sección */}
        <h2 className="text-lg font-bold text-slate-800 dark:text-white transition-all duration-200">
          {getPageTitle()}
        </h2>
      </div>

      {/* Espacio del Usuario con Dropdown de Acciones */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          type="button"
          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-5-0 dark:hover:bg-slate-700/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 transition-all duration-200 cursor-pointer select-none"
        >
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {displayName}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {displayRole}
            </span>
          </div>
          
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200/40 dark:border-blue-800/30 text-blue-600 dark:text-blue-400">
            <User className="w-4 h-4" />
          </div>

          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Menú Desplegable Flotante */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700/50">
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Sesión Activa</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{displayEmail}</p>
            </div>
            
            <div className="p-1 space-y-0.5">
              <button
                onClick={() => { setDropdownOpen(false); navigate('/perfil'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-650 dark:text-slate-300 hover:bg-slate-55 dark:hover:bg-slate-700/60 rounded-lg transition-colors text-left cursor-pointer"
              >
                <UserCircle className="w-4 h-4 text-slate-400" />
                Mi Perfil
              </button>
              
              <button
                onClick={() => { setDropdownOpen(false); navigate('/configuracion'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-650 dark:text-slate-300 hover:bg-slate-55 dark:hover:bg-slate-700/60 rounded-lg transition-colors text-left cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Configuración
              </button>
            </div>

            <div className="p-1 border-t border-slate-100 dark:border-slate-700/50 mt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

