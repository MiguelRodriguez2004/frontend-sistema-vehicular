import React from 'react';
import { User, CreditCard, Mail, Phone, Car, Wrench, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatKilometraje } from '../../utils/formatters';

/**
 * Panel Lateral Unificado conteniendo la información contextual clave (Cliente, Vehículo y Personal).
 * Evita la fragmentación en múltiples widgets pequeños, reduciendo el ruido visual en la interfaz.
 * 
 * @param {Object} props
 * @param {Object} props.orden - Datos completos de la orden relacionados desde el backend.
 */
export const OrdenSidebarCard = ({ orden }) => {
  // Proteger accesos anidados mediante optional chaining
  const cliente = orden?.vehiculo?.cliente;
  const vehiculo = orden?.vehiculo;
  const tecnico = orden?.tecnico;

  const clienteNombre = cliente?.nombre ?? 'Sin cliente registrado';
  const clienteCedula = cliente?.cedula || cliente?.documento || '---';
  const clienteEmail = cliente?.email || 'Sin correo registrado';
  const clienteTelefono = cliente?.telefono || 'Sin teléfono';

  const vehiculoInfo = vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'Sin vehículo registrado';
  const placa = vehiculo?.placa ?? '---';
  const tipoVehiculo = vehiculo?.tipo ?? '---';
  const kilometrajeVal = formatKilometraje(orden?.kilometraje);

  // Seguridad visual: Solo utilizar propiedades públicas, ignorando contraseñas
  const tecnicoNombre = tecnico?.nombre ?? 'Técnico Supervisor (Por asignar)';
  const tecnicoRegistro = tecnico?.registro || 'TEC-001';

  return (
    <Card className="divide-y divide-slate-200/80 dark:divide-slate-700/50 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/50 rounded-xl shadow-xs select-none">
      
      {/* 1. SECCIÓN: CLIENTE */}
      <div className="p-5.5 space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <User className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Información del Cliente</span>
        </h4>
        <div className="space-y-3.5">
          <h5 className="font-black text-slate-900 dark:text-white text-base">
            {clienteNombre}
          </h5>
          <div className="space-y-2.5 text-slate-600 dark:text-slate-355 text-[13px]">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>C.I. {clienteCedula}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate" title={clienteEmail}>{clienteEmail}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>Teléfono: {clienteTelefono}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECCIÓN: VEHÍCULO */}
      <div className="p-5.5 space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Car className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Detalles del Vehículo</span>
        </h4>
        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h5 className="font-black text-slate-900 dark:text-white text-base truncate" title={vehiculoInfo}>
                {vehiculoInfo}
              </h5>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1 block">
                TIPO: {tipoVehiculo}
              </span>
            </div>
            {/* Placa badge - Más grande y destacado con alineación perfecta */}
            <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-black tracking-widest text-[11px] border border-blue-150 dark:border-blue-800/60 shadow-2xs uppercase shrink-0">
              {placa}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800/60">
            <div>
              <span className="text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
                Kilometraje
              </span>
              <span className="font-extrabold text-slate-900 dark:text-slate-200 block mt-1 text-sm">
                {kilometrajeVal}
              </span>
            </div>
            <div>
              <span className="text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
                Servicio
              </span>
              <span className="font-extrabold text-slate-900 dark:text-slate-200 block mt-1 text-sm capitalize">
                {(orden?.tipoServicio || 'PREVENTIVO').toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN: PERSONAL ASIGNADO */}
      <div className="p-5.5 space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Técnico Responsable</span>
        </h4>
        <div className="flex items-center gap-3.5 bg-slate-50/30 dark:bg-slate-900/10 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-950/40 text-blue-500 shrink-0 border border-blue-500/20 shadow-3xs">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="font-black text-slate-900 dark:text-white text-sm truncate leading-snug">
              {tecnicoNombre}
            </h5>
            <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 mt-0.5 tracking-wide">
              Credencial: <span className="text-slate-700 dark:text-slate-350">{tecnicoRegistro}</span>
            </p>
          </div>
        </div>
      </div>

    </Card>
  );
};

export default OrdenSidebarCard;
