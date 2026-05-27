import React from 'react';

/**
 * Componente para visualizar los detalles y el historial de mantenimiento de un vehículo.
 * Diseñado bajo un enfoque de pestañas (Tabs) o acordeones para soportar:
 * 1. Ficha Técnica / Detalle del Vehículo
 * 2. Historial Operativo (Órdenes de Trabajo pasadas y diagnósticos previos)
 * 
 * Estructura futura planificada:
 * - `vehiculo`: Objeto completo con los datos del vehículo.
 * - `historial`: Colección de órdenes de trabajo asociadas a este vehículo.
 * - `activeTab`: Estado local ('detalle' | 'historial').
 * 
 * @param {Object} props
 * @param {Object} props.vehiculo - Información del vehículo seleccionado.
 * @param {Array} [props.historial=[]] - Historial de mantenimientos / órdenes.
 */
export const VehiculoDetails = ({ vehiculo, historial = [] }) => {
  // NOTA: Implementación completa planificada para la fase de visualización de historial operativo.
  return (
    <div className="space-y-4 p-5 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-700 rounded-xl">
      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
        Detalle y Historial del Vehículo
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        [Estructura preparada para desplegar Ficha Técnica y el Historial de Órdenes de Trabajo]
      </p>
    </div>
  );
};

export default VehiculoDetails;
