import React, { forwardRef } from 'react';

/**
 * Componente de campo de entrada reutilizable compatible con React Hook Form (usa forwardRef).
 */
const Input = forwardRef(({
  label,
  error,
  type = 'text',
  id,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={id}
        required={required}
        className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border ${
          error
            ? 'border-rose-500 focus:ring-rose-500/30 focus:border-rose-500'
            : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500/30 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500'
        } rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-900/50 ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-rose-500">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
