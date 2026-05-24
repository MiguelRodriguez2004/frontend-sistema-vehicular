import React from 'react';

/**
 * Componente de etiqueta (Badge) reutilizable para representar estados, categorías o tipos.
 */
const Badge = ({
  children,
  variant = 'info',
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase select-none';
  
  const variants = {
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-2xs',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-350 border border-amber-200 dark:border-amber-800/60 shadow-2xs',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 shadow-2xs',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 border border-slate-200 dark:border-slate-700 shadow-2xs',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
