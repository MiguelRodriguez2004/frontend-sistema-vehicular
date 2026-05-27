import React from 'react';

/**
 * Componente presentacional que simula el esqueleto pulsante de carga
 * en base a la nueva grilla de 3 columnas de cards compactas administrativas.
 * Resguarda la simetría y estabilidad del layout durante llamadas asíncronas de red.
 */
export const OrdenSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-pulse select-none">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div 
          key={i} 
          className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/40 rounded-xl flex flex-col justify-between overflow-hidden p-4 space-y-3"
        >
          {/* Header simulado */}
          <div className="flex items-center justify-between pb-1">
            <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
          </div>

          {/* Info principal: Vehículo, cliente y placa */}
          <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700/40 pb-2.5">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-4 bg-slate-250 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
            <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded-lg w-16 shrink-0 ml-2"></div>
          </div>

          {/* Fila media: Servicio y Km */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-700/40 pb-2.5">
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
              <div className="h-4.5 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-14"></div>
            </div>
          </div>

          {/* Diagnóstico simulado */}
          <div className="space-y-1.5">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
          </div>

          {/* Barra de pie simulada */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/40">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
            <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded-lg w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdenSkeleton;
