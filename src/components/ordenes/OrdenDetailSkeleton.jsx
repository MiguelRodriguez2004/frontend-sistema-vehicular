import React from 'react';

/**
 * Componente presentacional para simular la vista de detalle en dos columnas
 * durante la carga inicial. Protege la simetría y elimina el parpadeo de carga.
 */
export const OrdenDetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse select-none">
      
      {/* 1. Cabecera simulada */}
      <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-5">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0"></div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 bg-slate-250 dark:bg-slate-700 rounded w-28"></div>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
            </div>
          </div>
          <div className="h-8.5 bg-slate-200 dark:bg-slate-700 rounded-lg w-28 shrink-0"></div>
        </div>
      </div>

      {/* 2. Cuerpo en dos columnas (Desktop) / Apilamiento móvil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda (Ancha - 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Diagnóstico simulado */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/40 rounded-xl p-5 space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-44"></div>
            <div className="space-y-2 pl-4 border-l-3 border-slate-200 dark:border-slate-700/60">
              <div className="h-4 bg-slate-250 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-250 dark:bg-slate-700 rounded w-5/6"></div>
              <div className="h-4 bg-slate-250 dark:bg-slate-700 rounded w-2/3"></div>
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-24 pt-2"></div>
          </div>

          {/* Timeline simulado */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/40 rounded-xl p-5 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100/50 dark:border-slate-700/30 pb-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
              <div className="h-4.5 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
            </div>
            <div className="pl-6 border-l border-slate-150 dark:border-slate-700 space-y-5 ml-2">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2 relative">
                  <div className="absolute -left-[30px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-36"></div>
                  <div className="h-10 bg-slate-50 dark:bg-slate-900/20 border border-slate-150/40 dark:border-slate-800/30 rounded-xl w-full"></div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Columna Derecha (Estrecha - 1/3): Sidebar Card consolidada */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/40 rounded-xl divide-y divide-slate-100 dark:divide-slate-700/40">
            {/* Sección 1 */}
            <div className="p-4 space-y-3">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
              <div className="h-4.5 bg-slate-250 dark:bg-slate-700 rounded w-40"></div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
            </div>
            {/* Sección 2 */}
            <div className="p-4 space-y-3">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
              <div className="flex justify-between items-center gap-3">
                <div className="h-4.5 bg-slate-250 dark:bg-slate-700 rounded w-36"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12 shrink-0"></div>
              </div>
              <div className="h-10 bg-slate-50 dark:bg-slate-900/10 rounded-lg w-full"></div>
            </div>
            {/* Sección 3 */}
            <div className="p-4 space-y-3">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-250 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default OrdenDetailSkeleton;
