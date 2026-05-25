import React from 'react';

/**
 * Componente presentacional para informar que el cliente no tiene vehículos.
 */
export const VehiculoEmptyState = () => {
  return (
    <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-250 dark:border-slate-800 animate-fadeIn">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Este cliente no tiene vehículos registrados aún. Registre uno para proceder.
      </p>
    </div>
  );
};

export default VehiculoEmptyState;
