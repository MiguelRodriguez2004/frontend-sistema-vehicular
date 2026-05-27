import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { ordenService } from '../services/ordenService';
import OrdenDetailHeader from '../components/ordenes/OrdenDetailHeader';
import OrdenDiagnosticoCard from '../components/ordenes/OrdenDiagnosticoCard';
import OrdenTimeline from '../components/ordenes/OrdenTimeline';
import OrdenSidebarCard from '../components/ordenes/OrdenSidebarCard';
import OrdenDetailSkeleton from '../components/ordenes/OrdenDetailSkeleton';

/**
 * Vista de Detalle de una Orden de Trabajo real.
 * Se conecta de forma reactiva al backend de Node.js + PG + Prisma.
 * Agrupa la información contextual reduciendo cards pequeñas e implementa
 * un timeline técnico Notion-style para las novedades.
 */
const DetalleOrdenPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEvidenciaModalOpen, setIsEvidenciaModalOpen] = useState(false);
  const timelineRef = useRef(null);

  // Consulta al backend para obtener los detalles de la orden
  const fetchOrden = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordenService.obtenerOrdenPorId(id);
      if (!data) {
        throw new Error('La orden solicitada no existe o no pudo ser recuperada.');
      }
      setOrden(data);
    } catch (err) {
      console.error('Error al recuperar orden de trabajo:', err);
      setError(err?.response?.data?.message || err?.message || 'No se pudo establecer conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrden();
    }
  }, [id]);

  // Callback para cambiar el estado operativo (PATCH)
  const handleStatusChange = async (nuevoEstado) => {
    if (!id || !orden) return;
    try {
      setError(null);
      const updatedOrden = await ordenService.cambiarEstadoOrden(id, nuevoEstado);
      // Actualizar el estado local para dar retroalimentación instantánea
      setOrden(prev => prev ? { ...prev, estado: nuevoEstado } : null);
      // Refrescar datos reales para asegurar coherencia
      await fetchOrden();
    } catch (err) {
      console.error('Error al cambiar el estado de la orden:', err);
      alert('Error: No se pudo cambiar el estado de la orden de trabajo.');
    }
  };

  // Callback para registrar una novedad en la base de datos (POST)
  const handleAddNovedad = async (descripcion) => {
    if (!id) return;
    try {
      await ordenService.crearNovedad(id, descripcion, 'GENERAL');
      // Recargar la orden para actualizar el timeline
      await fetchOrden();
    } catch (err) {
      console.error('Error al registrar novedad:', err);
      throw err; // El componente OrdenTimeline maneja internamente el error visual del formulario
    }
  };

  // Desplazar y enfocar el campo de novedades
  const handleAddNovedadFocus = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollIntoView({ behavior: 'smooth' });
      // Encontrar textarea y enfocarlo
      const textarea = timelineRef.current.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }
  };

  // Abrir modal de evidencias (placeholder interactivo premium)
  const handleAddEvidenciaFocus = () => {
    setIsEvidenciaModalOpen(true);
  };

  // 1. Renderizar Skeleton durante la carga
  if (loading) {
    return <OrdenDetailSkeleton />;
  }

  // 2. Renderizar Pantalla de Error con Reintento
  if (error || !orden) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center select-none animate-fadeIn">
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Error al Cargar la Orden de Trabajo
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          {error || 'No se encontró la orden especificada.'}
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/ordenes')} variant="outline" size="sm">
            Volver al Listado
          </Button>
          <Button onClick={fetchOrden} variant="primary" size="sm" icon={RefreshCw}>
            Reintentar Carga
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabecera de Detalle: Código OT, Acciones y Estado */}
      <OrdenDetailHeader
        orden={orden}
        onBack={() => navigate('/ordenes')}
        onStatusChange={handleStatusChange}
        onAddNovedadFocus={handleAddNovedadFocus}
        onAddEvidenciaFocus={handleAddEvidenciaFocus}
      />

      {/* Grid Responsivo de Trabajo: 2 Columnas Izquierda (Info Técnica), 1 Columna Derecha (Sidebar Contextual) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: Núcleo del taller (Diagnóstico + Timeline) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Diagnóstico Protagonista */}
          <OrdenDiagnosticoCard orden={orden} />

          {/* Timeline de Novedades y Observaciones Operativas */}
          <div ref={timelineRef}>
            <OrdenTimeline
              novedades={orden?.novedades || []}
              onAddNovedad={handleAddNovedad}
            />
          </div>

        </div>

        {/* COLUMNA DERECHA: Sidebar Contextual Unificado (Cliente, Vehículo, Técnico) */}
        <div className="lg:col-span-1">
          <OrdenSidebarCard orden={orden} />
        </div>

      </div>

      {/* MODAL DE EVIDENCIAS (Placeholder Premium Dark) */}
      <Modal
        isOpen={isEvidenciaModalOpen}
        onClose={() => setIsEvidenciaModalOpen(false)}
        title="Cargar Evidencias Multimedia / Fotos"
        size="md"
      >
        <div className="space-y-4 text-xs select-none">
          <div className="p-6 border-2 border-dashed border-slate-350 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/55 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-extrabold text-slate-800 dark:text-slate-200">
                Arrastra y suelta tus archivos aquí
              </p>
              <p className="text-slate-400 dark:text-slate-500">
                Soporta imágenes (PNG, JPG) de hasta 10MB
              </p>
            </div>
            <Button variant="outline" size="xs" className="mt-1 shadow-3xs">
              Seleccionar Archivos
            </Button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Evidencias para Subir (Simulado)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 rounded-lg">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-850 dark:text-slate-200 truncate max-w-[180px]">
                    freno_delantero_desgastado.jpg
                  </p>
                  <p className="text-[10px] text-slate-400">1.4 MB</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/40 shrink-0">
                Listo para cargar
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-750">
            <Button variant="outline" size="sm" onClick={() => setIsEvidenciaModalOpen(false)}>
              Cerrar
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => {
                setIsEvidenciaModalOpen(false);
                alert('La simulación de carga se procesó exitosamente en la cola local.');
              }}
            >
              Completar Registro
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DetalleOrdenPage;
