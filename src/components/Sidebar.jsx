import React from 'react';
import { NavLink } from 'react-router-dom';
import { ClipboardList, PlusCircle, Wrench, X, Settings, Users, LayoutDashboard } from 'lucide-react';
import { usePerfil } from '../context/PerfilContext';

/**
 * Componente Sidebar desacoplado y reutilizable para navegación.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = usePerfil();

  const links = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true
    },
    {
      to: '/ordenes',
      label: 'Órdenes de Trabajo',
      icon: ClipboardList,
      end: true
    },
    {
      to: '/ordenes/nueva',
      label: 'Nueva Orden',
      icon: PlusCircle,
      end: false
    },
    {
      to: '/configuracion',
      label: 'Configuración',
      icon: Settings,
      end: false
    },
  ];

  // Solo mostrar la sección de administración si el usuario es ADMIN
  if (isAdmin) {
    links.push({
      to: '/admin/usuarios',
      label: 'Administrar Usuarios',
      icon: Users,
      end: false,
    });
  }

  return (
    <>
      {/* Backdrop en pantallas móviles cuando el Sidebar está abierto */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Contenedor del Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-slate-900 text-slate-100 border-r border-slate-800 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabecera / Branding */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Track<span className="text-blue-500">Garage</span>
            </span>
          </div>
          {/* Botón de cerrar para pantallas móviles */}
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-slate-400 hover:text-white rounded-lg md:hidden hover:bg-slate-800 cursor-pointer"
            aria-label="Cerrar menú lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enlaces de Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 select-none ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/20">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Versión 1.0.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
