import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';

/**
 * Componente presentacional para informar que el sistema no registra ninguna orden activa.
 * Proporciona un botón premium "Crear Orden" para re-dirigir de forma interactiva.
 * 
 * @param {Object} props
 * @param {Function} [props.onCreateClick] - Callback personalizado opcional para la navegación.
 */
export const OrdenEmptyState = ({ onCreateClick }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onCreateClick) {
      onCreateClick();
    } else {
      navigate('/ordenes/nueva');
    }
  };

  return (
    <Card className="animate-fadeIn">
      <div className="px-6 py-12 text-center flex flex-col items-center justify-center">
        {/* Contenedor del Icono */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-400 mb-4 shrink-0 shadow-2xs">
          <ClipboardList className="w-12 h-12 text-slate-350 dark:text-slate-650" />
        </div>
        
        {/* Textos descriptivos */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No existen órdenes registradas
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm leading-relaxed">
          No se ha ingresado ninguna orden de trabajo al sistema aún. Comience por registrar una nueva para el ingreso de vehículos.
        </p>

        {/* Botón de acción */}
        <Button
          onClick={handleAction}
          icon={Plus}
          variant="primary"
          className="mt-6 shadow-md h-10 font-bold"
        >
          Crear Orden
        </Button>
      </div>
    </Card>
  );
};

export default OrdenEmptyState;
