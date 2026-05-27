import React from 'react';
import Badge from '../ui/Badge';

/**
 * Componente modular para renderizar etiquetas (badges) consistentes y premium
 * correspondientes a los Estados y Tipos de Servicio de las órdenes de trabajo.
 * Homologa valores en mayúscula cruda del backend a texto elegante en español.
 * 
 * @param {Object} props
 * @param {string} props.value - El valor original del enum proveniente del backend (ej: "RECIBIDO", "PREVENTIVO").
 * @param {'status'|'service'} [props.type='status'] - Determina si se renderiza un estado o un tipo de servicio.
 * @param {string} [props.className=''] - Clases de CSS adicionales opcionales.
 */
export const OrdenStatusBadge = ({ value, type = 'status', className = '' }) => {
  if (!value) return null;

  const val = String(value).toUpperCase().trim();

  if (type === 'service') {
    switch (val) {
      case 'PREVENTIVO':
        return <Badge variant="info" className={className}>Preventivo</Badge>;
      case 'CORRECTIVO':
        return <Badge variant="warning" className={className}>Correctivo</Badge>;
      case 'DIAGNOSTICO':
      case 'DIAGNÓSTICO':
        return <Badge variant="purple" className={className}>Diagnóstico</Badge>;
      default:
        return <Badge variant="slate" className={className}>{value}</Badge>;
    }
  } else {
    // type === 'status'
    switch (val) {
      case 'RECIBIDO':
        return (
          <Badge 
            variant="slate" 
            className={`border-slate-300 dark:border-slate-500 text-slate-800 dark:text-slate-100 font-black dark:bg-slate-700/80 shadow-3xs ${className}`}
          >
            Recibido
          </Badge>
        );
      case 'EN_REVISION':
      case 'EN_REVISIÓN':
        return (
          <Badge 
            variant="warning" 
            className={`border-amber-350 dark:border-amber-500 text-amber-850 dark:text-amber-300 font-black dark:bg-amber-950/50 shadow-3xs ${className}`}
          >
            En Revisión
          </Badge>
        );
      case 'EN_PROCESO':
        return (
          <Badge 
            variant="info" 
            className={`border-blue-350 dark:border-blue-500 text-blue-850 dark:text-blue-300 font-black dark:bg-blue-950/50 shadow-3xs ${className}`}
          >
            En Proceso
          </Badge>
        );
      case 'FINALIZADO':
        return (
          <Badge 
            variant="success" 
            className={`border-emerald-350 dark:border-emerald-500 text-emerald-850 dark:text-emerald-300 font-black dark:bg-emerald-950/50 shadow-3xs ${className}`}
          >
            Finalizado
          </Badge>
        );
      case 'ENTREGADO':
        return (
          <Badge 
            variant="success" 
            className={`border-teal-350 dark:border-teal-600 text-teal-800 dark:text-teal-300 font-black bg-teal-50/50 dark:bg-teal-950/60 shadow-3xs ${className}`}
          >
            Entregado
          </Badge>
        );
      default:
        return <Badge variant="slate" className={className}>{value}</Badge>;
    }
  }
};

export default OrdenStatusBadge;
