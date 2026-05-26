import React from 'react';
import { Car, Bike, Check } from 'lucide-react';
import Badge from '../ui/Badge';

/**
 * Componente presentacional puro para mostrar la tarjeta de un vehículo.
 * 
 * @param {Object} props
 * @param {Object} props.vehiculo - Datos del vehículo.
 * @param {boolean} props.isSelected - Si el vehículo está seleccionado actualmente.
 * @param {Function} props.onClick - Evento emitido al hacer clic en la tarjeta.
 */
export const VehiculoCard = ({ vehiculo, isSelected, onClick }) => {
  const isAutomovil = vehiculo.tipo?.toLowerCase() === 'auto' || vehiculo.tipo?.toLowerCase() === 'automovil';
  
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer relative flex items-start gap-3 select-none ${
        isSelected
          ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-900/10'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-650 bg-white dark:bg-slate-800'
      }`}
    >
      {/* Icono del tipo de Vehículo */}
      <div className={`p-2 rounded-lg shrink-0 transition-colors ${
        isSelected 
          ? 'bg-blue-500/20 text-blue-500' 
          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
      }`}>
        {isAutomovil ? <Car className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
          {vehiculo.marca} {vehiculo.modelo}
        </h4>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>
            Placa:{' '}
            <span className="font-bold uppercase text-slate-800 dark:text-slate-200">
              {vehiculo.placa}
            </span>
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Badge variant={isAutomovil ? 'info' : 'warning'} className="px-1.5 py-0 text-[9px]">
              {isAutomovil ? 'Automóvil' : 'Motocicleta'}
            </Badge>
          </div>
        </div>
      </div>

      {isSelected && (
        <span className="absolute top-4 right-4 text-blue-500 shrink-0">
          <Check className="w-4 h-4" />
        </span>
      )}
    </div>
  );
};

export default VehiculoCard;
