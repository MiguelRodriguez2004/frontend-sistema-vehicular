import React from 'react';

/**
 * Formulario modular reutilizable para vehículos.
 * Preparado para soportar tanto modo de CREACIÓN como modo de EDICIÓN.
 * 
 * Estructura futura planificada:
 * - `initialData`: Objeto con datos del vehículo para pre-cargar en modo edición.
 * - `onSubmit`: Callback para procesar el envío (creación o edición).
 * - `isReadOnly`: Para modo vista de solo lectura.
 * 
 * @param {Object} props
 * @param {Object} [props.initialData] - Datos iniciales para el modo edición.
 * @param {Function} props.onSubmit - Callback de guardado.
 * @param {boolean} [props.isSaving=false] - Estado de envío para feedback en el botón.
 */
export const VehiculoForm = ({ initialData, onSubmit, isSaving = false }) => {
  // NOTA: Implementación completa planificada para la fase de administración de vehículos.
  // Por ahora, el flujo de creación rápida se maneja de forma optimizada en CreateVehiculoModal.jsx.
  return (
    <div className="p-4 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/10 rounded-xl text-center">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        [Formulario de Vehículo - Estructura preparada para Edición y Creación Completa]
      </p>
    </div>
  );
};

export default VehiculoForm;
