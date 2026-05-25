import React from 'react';
import VehiculoCard from './VehiculoCard';

/**
 * Componente que renderiza la rejilla de vehículos del cliente.
 * 
 * @param {Object} props
 * @param {Array} props.vehiculos - Colección de vehículos normalizada.
 * @param {Object|null} props.vehiculoSeleccionado - Vehículo seleccionado actualmente.
 * @param {Function} props.onSelectVehiculo - Callback de selección.
 */
export const VehiculoList = ({ vehiculos, vehiculoSeleccionado, onSelectVehiculo }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
      {vehiculos.map((v) => (
        <VehiculoCard
          key={v.id}
          vehiculo={v}
          isSelected={vehiculoSeleccionado?.id === v.id}
          onClick={() => onSelectVehiculo(v)}
        />
      ))}
    </div>
  );
};

export default VehiculoList;
