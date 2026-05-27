import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Componente presentacional para informar que el cliente no tiene vehículos.
 * Ofrece un botón de registro rápido cuando se suministra el callback onRegister.
 * 
 * @param {Object} props
 * @param {Function} [props.onRegister] - Callback para abrir el flujo de creación.
 */
export const VehiculoEmptyState = ({ onRegister }) => {
  return (
    <div className="text-center py-8 px-4 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-250 dark:border-slate-800 animate-fadeIn flex flex-col items-center justify-center gap-4">
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
        Este cliente no tiene vehículos registrados aún. Registre uno para proceder.
      </p>
      {onRegister && (
        <Button
          onClick={onRegister}
          icon={Plus}
          variant="outline"
          size="sm"
          className="mt-1"
        >
          Registrar Vehículo
        </Button>
      )}
    </div>
  );
};

export default VehiculoEmptyState;
