import React from 'react';
import { Save, ClipboardList, Wrench, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

// Tipos de servicio homologados con label en pantalla y enum real en backend Prisma
const SERVICE_TYPES = [
  { label: 'Preventivo', value: 'PREVENTIVO' },
  { label: 'Correctivo', value: 'CORRECTIVO' },
  { label: 'Diagnóstico', value: 'DIAGNOSTICO' }
];

/**
 * Componente de presentación controlado para capturar los detalles de mantenimiento
 * y consolidar el resumen operativo antes de la persistencia real.
 * 
 * @param {Object} props
 * @param {Object} props.cliente - Cliente actualmente seleccionado para el resumen.
 * @param {Object} props.vehiculo - Vehículo actualmente seleccionado para el resumen.
 * @param {string|number} props.kilometraje - Kilometraje de ingreso.
 * @param {Function} props.setKilometraje - Setter para el kilometraje.
 * @param {string} props.tipoServicio - Tipo de servicio (enum PREVENTIVO, CORRECTIVO, DIAGNOSTICO).
 * @param {Function} props.setTipoServicio - Setter para el tipo de servicio.
 * @param {string} props.diagnostico - Texto de diagnóstico.
 * @param {Function} props.setDiagnostico - Setter para el diagnóstico.
 * @param {string|number} props.tecnicoId - ID del técnico seleccionado.
 * @param {Function} props.setTecnicoId - Setter para el ID del técnico.
 * @param {Array} props.tecnicos - Lista de técnicos disponibles.
 * @param {Object} props.perfil - Perfil del usuario actual.
 * @param {boolean} props.isAdmin - Indicador de si el usuario es administrador.
 * @param {Object} props.errors - Objeto que contiene los errores de validación inline.
 * @param {boolean} props.isSaving - Estado de carga al crear la orden.
 * @param {Function} props.onSubmit - Manejador del submit de la orden.
 */
export const OrdenFormSection = ({
  cliente,
  vehiculo,
  kilometraje,
  setKilometraje,
  tipoServicio,
  setTipoServicio,
  diagnostico,
  setDiagnostico,
  tecnicoId,
  setTecnicoId,
  tecnicos = [],
  perfil,
  isAdmin,
  errors = {},
  isSaving = false,
  onSubmit
}) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">3</span>
            Detalles del Mantenimiento
          </h3>
        </CardHeader>

        <CardBody className="space-y-5">
          {/* ========================================================================= */}
          {/* RESUMEN VISUAL DE INGRESO OPERATIVO */}
          {/* ========================================================================= */}
          {cliente && vehiculo && (
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-blue-500" />
                <span>Resumen de Ingreso Operativo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-medium">Cliente</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {cliente.nombre}
                  </span>
                  <span className="text-slate-500 block">C.I: {cliente.cedula || cliente.documento}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-medium">Vehículo</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {vehiculo.marca} {vehiculo.modelo}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold block uppercase tracking-wider text-[10px]">
                    Placa: {vehiculo.placa}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Campo Kilometraje */}
          <Input
            label="Kilometraje Actual *"
            type="number"
            placeholder="Ej: 45000"
            required
            value={kilometraje}
            onChange={(e) => setKilometraje(e.target.value)}
            error={errors.kilometraje}
            disabled={isSaving}
          />

          {/* Campo Tipo de Servicio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tipo de Servicio *
            </label>
            <select
              value={tipoServicio}
              onChange={(e) => setTipoServicio(e.target.value)}
              disabled={isSaving}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {SERVICE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Diagnóstico */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Diagnóstico / Trabajo Requerido *
            </label>
            <textarea
              placeholder="Describa el síntoma o el trabajo a realizar..."
              rows={4}
              required
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              disabled={isSaving}
              className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border ${
                errors.diagnostico
                  ? 'border-rose-500 focus:ring-rose-500/30 focus:border-rose-500'
                  : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500/30 focus:border-blue-500'
              } rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50`}
            />
            {errors.diagnostico && (
              <span className="text-xs font-medium text-rose-500">
                {errors.diagnostico}
              </span>
            )}
          </div>

          {/* Campo Técnico Asignado */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Técnico Asignado *
            </label>
            {isAdmin ? (
              <select
                value={tecnicoId}
                onChange={(e) => setTecnicoId(e.target.value)}
                disabled={isSaving || tecnicos.length === 0}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tecnicos.length === 0 ? (
                  <option value="">Cargando técnicos...</option>
                ) : (
                  tecnicos.map((tec) => (
                    <option key={tec.id} value={tec.id}>
                      {tec.nombre}
                    </option>
                  ))
                )}
              </select>
            ) : (
              <div className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 cursor-not-allowed flex items-center">
                {perfil?.nombre || 'Cargando tu perfil...'}
              </div>
            )}
            {!isAdmin && (
              <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-500 dark:text-slate-400 select-none">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Asignado automáticamente a tu cuenta.</span>
              </div>
            )}
          </div>

        </CardBody>
      </div>

      <CardFooter className="pt-2 pb-5 px-5">
        <Button
          onClick={onSubmit}
          type="button"
          icon={Save}
          variant="primary"
          disabled={isSaving}
          className="w-full h-10 text-sm font-bold shadow-md"
        >
          {isSaving ? (
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creando Orden...</span>
            </div>
          ) : (
            'Crear Orden de Trabajo'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrdenFormSection;
