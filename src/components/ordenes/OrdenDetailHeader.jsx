import React, { useState } from 'react';
import { ArrowLeft, Printer, RefreshCw, Plus, Image, Play } from 'lucide-react';
import Button from '../ui/Button';
import OrdenStatusBadge from './OrdenStatusBadge';
import { formatDate } from '../../utils/formatters';

/**
 * Helper para formatear el código de orden.
 */
const formatOrderCode = (id) => {
  if (!id) return 'OT-0000';
  const strId = String(id);
  if (/^\d+$/.test(strId)) {
    return `OT-${strId.padStart(4, '0')}`;
  }
  if (strId.toUpperCase().startsWith('OT-') || strId.toUpperCase().startsWith('ORD-')) {
    return strId.toUpperCase();
  }
  return `OT-${strId}`;
};

/**
 * Cabecera principal para la vista de detalle de órdenes.
 * Proporciona alto protagonismo visual al estado operativo, barra de acciones rápidas
 * pre-cableada y navegación nativa de retorno.
 * 
 * @param {Object} props
 * @param {Object} props.orden - Objeto con datos de la orden.
 * @param {Function} props.onBack - Callback para navegar hacia atrás.
 * @param {Function} [props.onStatusChange] - Placeholder para cambiar el estado (PATCH).
 * @param {Function} [props.onAddNovedadFocus] - Desplazar vista hacia novedades.
 * @param {Function} [props.onAddEvidenciaFocus] - Desplazar vista hacia evidencias.
 */
export const OrdenDetailHeader = ({
  orden,
  onBack,
  onStatusChange,
  onAddNovedadFocus,
  onAddEvidenciaFocus
}) => {
  const rawId = orden?.id || orden?.ordenId || '0';
  const ordenId = formatOrderCode(rawId);
  const estado = orden?.estado ?? 'RECIBIDO';
  const fechaIngreso = formatDate(orden?.fechaIngreso || orden?.createdAt);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const estadosDisponibles = ['RECIBIDO', 'EN_REVISION', 'EN_PROCESO', 'FINALIZADO', 'ENTREGADO'];

  const handleEstadoSelect = (nuevoEstado) => {
    setIsDropdownOpen(false);
    if (onStatusChange) {
      onStatusChange(nuevoEstado);
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/85 dark:border-slate-700/60 pb-6 select-none animate-fadeIn">
      {/* 1. Barra superior: Navegación y código de orden */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-extrabold px-3.5 py-2 h-9.5 rounded-xl shrink-0 transition-colors shadow-3xs"
          >
            Volver
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {ordenId}
              </h1>
              {/* Estado Operativo con Altísimo Protagonismo */}
              <OrdenStatusBadge value={estado} type="status" className="px-4 py-1.5 text-xs font-black shadow-xs shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-slate-505 dark:text-slate-400 mt-1.5">
              Fecha de ingreso operacional: <span className="font-bold text-slate-800 dark:text-slate-200">{fechaIngreso}</span>
            </p>
          </div>
        </div>
 
        {/* 2. Barra de Acciones Rápidas (Preparada para expansión futura) */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          {/* Cambiar Estado - Acción Principal Operativa */}
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="primary"
              size="sm"
              icon={RefreshCw}
              className="h-9.5 px-4 text-xs font-extrabold shadow-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl border border-blue-500/30 flex items-center gap-2 transition-all duration-200 cursor-pointer"
            >
              Cambiar Estado
            </Button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-25 py-1">
                {estadosDisponibles.map((est) => (
                  <button
                    key={est}
                    onClick={() => handleEstadoSelect(est)}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-700/60 hover:text-slate-950 dark:hover:text-white transition-colors capitalize cursor-pointer flex items-center justify-between"
                  >
                    <span>{est.toLowerCase().replace('_', ' ')}</span>
                    {est === estado && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>}
                  </button>
                ))}
              </div>
            )}
          </div>
 
          {/* Subir Evidencia */}
          <Button
            onClick={onAddEvidenciaFocus}
            variant="outline"
            size="sm"
            icon={Image}
            className="h-9.5 px-3.5 text-xs font-bold shadow-3xs border-slate-300 dark:border-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl"
          >
            Evidencia
          </Button>
 
          {/* Imprimir Ficha */}
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="sm"
            icon={Printer}
            className="h-9.5 px-3.5 text-xs font-bold shadow-3xs border-slate-300 dark:border-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl"
          >
            Imprimir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrdenDetailHeader;
