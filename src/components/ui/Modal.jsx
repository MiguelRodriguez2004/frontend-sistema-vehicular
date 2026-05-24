import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Componente modal interactivo y accesible, perfecto para creación rápida de clientes/vehículos.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  // Desactiva el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />
      
      {/* Contenedor del Modal */}
      <div className={`relative bg-white dark:bg-slate-800 w-full ${sizes[size]} rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700 flex flex-col max-h-[90vh] z-10 transition-all duration-200`}>
        
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <button 
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo con Scroll independiente */}
        <div className="px-6 py-5 overflow-y-auto flex-1 text-slate-600 dark:text-slate-300 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
