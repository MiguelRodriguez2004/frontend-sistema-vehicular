import React, { useState } from 'react';
import { ClipboardList, Plus, User, Calendar, MessageSquare, Wrench } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import { formatDate } from '../../utils/formatters';

/**
 * Componente de Timeline Operativo e Historial Técnico.
 * Renderiza una línea de tiempo cronológica premium para las novedades registradas
 * y proporciona un formulario controlado de registro rápido.
 * 
 * @param {Object} props
 * @param {Array} props.novedades - Arreglo de novedades existentes en la orden.
 * @param {Function} props.onAddNovedad - Callback para agregar una nueva novedad (simulado/POST).
 */
export const OrdenTimeline = ({ novedades = [], onAddNovedad }) => {
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    setError(null);
    setIsSubmitting(true);
    try {
      // Invocar callback de guardado real
      if (onAddNovedad) {
        await onAddNovedad(comentario.trim());
      }
      setComentario('');
    } catch (err) {
      console.error('Error al registrar novedad:', err);
      setError('No se pudo registrar la novedad. Por favor, reintente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200/85 dark:border-slate-700/60 rounded-xl shadow-xs animate-fadeIn select-none">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-700/40 p-4.5">
        <div className="flex items-center gap-2.5">
          <ClipboardList className="w-5.5 h-5.5 text-blue-500 shrink-0" />
          <h3 className="font-black text-slate-900 dark:text-white text-[13px] uppercase tracking-widest">
            Historial de Novedades & Seguimiento
          </h3>
        </div>
        <span className="text-[10px] font-black rounded-lg px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-650 dark:text-slate-300 border border-slate-200/40 dark:border-slate-650/40 shadow-3xs">
          TOTAL: {novedades.length}
        </span>
      </CardHeader>

      <CardBody className="p-5.5 space-y-6">
        
        {/* ========================================================================= */}
        {/* LÍNEA DE TIEMPO CHRONOLÓGICA */}
        {/* ========================================================================= */}
        {novedades.length > 0 ? (
          <div className="relative pl-6.5 border-l-2 border-slate-200 dark:border-slate-700/80 space-y-6 ml-2.5 text-[13px]">
            {novedades.map((nov, index) => {
              const autor = nov?.autor || nov?.tecnico?.nombre || 'Técnico Supervisor';
              const fecha = formatDate(nov?.fecha || nov?.createdAt);
              const texto = nov?.descripcion || nov?.contenido || nov?.texto || '';

              return (
                <div key={nov.id || index} className="relative group animate-fadeIn">
                  {/* Nodo visual en la línea de tiempo */}
                  <div className="absolute -left-[32px] top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-800 shrink-0 group-hover:bg-blue-600 transition-colors shadow-xs"></div>

                  <div className="space-y-2">
                    {/* Encabezado del nodo */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                        <Wrench className="w-3.5 h-3.5 text-blue-500/70 shrink-0" />
                        <span>{autor}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-450 dark:text-slate-500">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{fecha}</span>
                      </div>
                    </div>

                    {/* Texto del comentario */}
                    <div className="p-4 bg-slate-50/60 dark:bg-slate-900/35 border border-slate-150 dark:border-slate-800/40 rounded-xl leading-relaxed text-slate-800 dark:text-slate-200 shadow-3xs">
                      {texto}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State Compacto y Elegante */
          <div className="text-center py-4.5 px-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800/50 rounded-xl text-slate-500 dark:text-slate-400 italic text-[11px] font-medium tracking-wide shadow-3xs select-none">
            Sin incidentes ni novedades registradas en el historial operativo de la orden.
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMULARIO DE REGISTRO RÁPIDO */}
        {/* ========================================================================= */}
        <form onSubmit={handleSubmit} className="pt-6 border-t border-slate-200/80 dark:border-slate-700/60 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Registrar Novedad Operativa / Bitácora</span>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold shadow-2xs">
              {error}
            </div>
          )}

          <div className="space-y-3.5">
            <textarea
              placeholder="Describa a continuación cualquier novedad, diagnóstico complementario, repuesto requerido o actualización del estado del vehículo..."
              rows={3.5}
              required
              disabled={isSubmitting}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-slate-50/50 dark:bg-slate-900/40 border border-slate-250 dark:border-slate-700/60 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400/85 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 resize-none leading-relaxed shadow-3xs"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                icon={Plus}
                variant="primary"
                size="sm"
                disabled={isSubmitting || !comentario.trim()}
                className="h-9.5 px-4.5 font-black text-xs shadow-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl border border-blue-500/20 transition-all duration-200 cursor-pointer"
              >
                {isSubmitting ? 'Guardando novedad...' : 'Agregar Novedad'}
              </Button>
            </div>
          </div>
        </form>

      </CardBody>
    </Card>
  );
};

export default OrdenTimeline;
