import React from 'react';
import { Eye, User, Car, Wrench, Calendar, ClipboardList } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import OrdenStatusBadge from './OrdenStatusBadge';
import { formatDate, formatKilometraje, truncateText } from '../../utils/formatters';

/**
 * Helper para formatear de manera administrativa y limpia el código de la orden.
 * Ejemplo: 4 -> OT-0004
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
 * Tarjeta Administrativa de Segunda Iteración para Órdenes de Trabajo.
 * Estilo unificado, plano (sin franjas grises), altamente compacto y de fácil escaneo táctil/visual.
 * Incorpora micro-animaciones y sombras sutiles (glow) tipo Linear, Stripe, Notion.
 * 
 * @param {Object} props
 * @param {Object} props.orden - Datos consolidados de la orden.
 * @param {Function} props.onVerDetalle - Callback de redirección por ID.
 */
export const OrdenCard = ({ orden, onVerDetalle }) => {
  // Proteger accesos anidados mediante optional chaining
  const rawId = orden?.id || orden?.ordenId || '0';
  const ordenId = formatOrderCode(rawId);
  const clienteNombre = orden?.vehiculo?.cliente?.nombre ?? 'Sin cliente';
  const vehiculoInfo = orden?.vehiculo 
    ? `${orden.vehiculo.marca} ${orden.vehiculo.modelo}` 
    : 'Sin vehículo';
  const placa = orden?.vehiculo?.placa ?? '---';
  const tipoServicio = orden?.tipoServicio ?? 'PREVENTIVO';
  const estado = orden?.estado ?? 'RECIBIDO';
  const kilometrajeVal = formatKilometraje(orden?.kilometraje);
  
  // Seguridad visual
  const tecnicoNombre = orden?.tecnico?.nombre ?? 'Sin técnico';
  const fechaIngreso = formatDate(orden?.fechaIngreso || orden?.createdAt);
  const cantidadNovedades = orden?.cantidadNovedades ?? 0;
  
  // Diagnóstico altamente compacto (máximo 2 líneas, sin caja gris pesada)
  const diagnostico = truncateText(orden?.diagnostico, 75);

  return (
    <div 
      onClick={() => onVerDetalle(rawId)}
      className="group bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl shadow-3xs hover:shadow-[0_0_15px_rgba(59,130,246,0.06)] hover:border-blue-500/40 dark:hover:border-blue-500/35 hover:-translate-y-[2px] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden p-4 space-y-3 select-none"
    >
      {/* 1. Header: Código y Estado (Sin fondos diferenciados, plano) */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-sm font-black tracking-wider text-slate-800 dark:text-slate-200 uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
          {ordenId}
        </span>
        <OrdenStatusBadge value={estado} type="status" className="px-2 py-1 text-xs" />
      </div>

      {/* 2. Identificación Principal: Vehículo + Placa + Cliente */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-700/40 pb-2.5">
        <div className="space-y-0.5 min-w-0 flex-1">
          {/* Vehículo - Foco Principal Tipográfico */}
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 truncate" title={vehiculoInfo}>
            <Car className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{vehiculoInfo}</span>
          </h4>
          {/* Cliente - Secundario */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pl-5 truncate" title={clienteNombre}>
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{clienteNombre}</span>
          </div>
        </div>

        {/* Placa Destacada de Alto Contraste */}
        <span className="shrink-0 px-2.5 py-1 rounded-md bg-blue-50/40 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-extrabold tracking-widest text-xs border border-blue-100/50 dark:border-blue-900/20 uppercase shadow-3xs">
          {placa}
        </span>
      </div>

      {/* 3. Metadata Matriz: Servicio, Kilometraje, Técnico, Fecha, Novedades */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-slate-100 dark:border-slate-700/40 pb-3">
        {/* Fila 1 */}
        <div className="space-y-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wide">Servicio</span>
          <OrdenStatusBadge value={tipoServicio} type="service" className="px-2 py-0.5 text-xs" />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wide">Kilometraje</span>
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block">
            {kilometrajeVal}
          </span>
        </div>
        
        {/* Fila 2 */}
        <div className="space-y-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wide">Técnico</span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-350 truncate block" title={tecnicoNombre}>
            {tecnicoNombre}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wide">Fecha</span>
          <div className="flex items-center gap-1.5 text-sm text-slate-650 dark:text-slate-350 font-semibold block">
            <Calendar className="w-4 h-4 text-slate-450 shrink-0" />
            <span>{fechaIngreso}</span>
          </div>
        </div>
      </div>

      {/* 4. Diagnóstico Compacto (Inline sin caja de fondo gris pesado, máx 2 líneas) */}
      {diagnostico && (
        <div className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed line-clamp-2 break-words">
          "{diagnostico}"
        </div>
      )}

      {/* 5. Acción Final (Limpio y alineado al final) */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/40">
        {/* Contador de Novedades */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ClipboardList className="w-4 h-4 shrink-0" />
          <span>Novedades:</span>
          <span className={`inline-flex items-center justify-center px-2 py-0.5 font-bold rounded text-xs ${
            cantidadNovedades > 0
              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
          }`}>
            {cantidadNovedades}
          </span>
        </div>

        {/* Botón Ver Detalle */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onVerDetalle(rawId);
          }}
          variant="secondary"
          size="sm"
          className="h-8 px-3 py-1 text-xs font-bold shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-3xs"
        >
          Ver Detalle
        </Button>
      </div>
    </div>
  );
};

export default OrdenCard;
