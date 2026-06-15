import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import OrdenStatusBadge from './OrdenStatusBadge';

/**
 * Tarjeta de Diagnóstico Protagonista.
 * Coloca el diagnóstico y el síntoma de ingreso como el núcleo operacional
 * de la orden de trabajo, dotando a la sección de aire extra, tipografía pesada
 * y máxima legibilidad.
 * 
 * @param {Object} props
 * @param {Object} props.orden - Datos consolidados de la orden.
 */
export const OrdenDiagnosticoCard = ({ orden }) => {
  const diagnostico = orden?.diagnostico ?? 'Sin diagnóstico registrado en el sistema.';
  const tipoServicio = orden?.tipoServicio ?? 'PREVENTIVO';

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200/85 dark:border-slate-700/60 rounded-xl shadow-xs animate-fadeIn select-none">
      <CardHeader className="flex flex-row items-center gap-2.5 border-b border-slate-100 dark:border-slate-700/40 p-4.5">
        <FileText className="w-5.5 h-5.5 text-blue-500 shrink-0" />
        <h3 className="font-black text-slate-900 dark:text-white text-[13px] uppercase tracking-widest">
          Síntoma de Ingreso & Diagnóstico Principal
        </h3>
      </CardHeader>
      
      <CardBody className="p-6.5 sm:p-8 space-y-6">
        {/* Bloque del diagnóstico principal con tratamiento premium */}
        <div className="relative pl-5 border-l-4 border-blue-500">
          <p className="text-[15px] sm:text-[17px] font-medium text-slate-800 dark:text-slate-100 leading-relaxed sm:leading-loose tracking-wide">
            {diagnostico}
          </p>
        </div>

        {/* Fila de metadatos complementarios del servicio */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4.5 border-t border-slate-100 dark:border-slate-700/40 text-xs select-none">
          <div className="flex items-center gap-2.5">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Tipo de Servicio:
            </span>
            <OrdenStatusBadge value={tipoServicio} type="service" className="px-3 py-1 text-[10px] shadow-3xs" />
          </div>
          
          <div className="flex items-center gap-2.5">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Estado Operativo:
            </span>
            <OrdenStatusBadge value={orden?.estado || 'RECIBIDO'} type="status" className="px-3 py-1 text-[10px] shadow-3xs" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default OrdenDiagnosticoCard;
