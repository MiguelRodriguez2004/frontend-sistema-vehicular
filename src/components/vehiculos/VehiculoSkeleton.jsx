import React from 'react';

/**
 * Componente presentacional que simula el layout de vehículos durante la carga.
 */
export const VehiculoSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
      {[1, 2].map((i) => (
        <div 
          key={i} 
          className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/10 flex items-start gap-3"
        >
          <div className="p-2 w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0"></div>
          <div className="flex-grow space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehiculoSkeleton;
