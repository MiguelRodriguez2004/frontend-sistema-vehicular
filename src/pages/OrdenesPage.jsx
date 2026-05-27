import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';

// Servicios
import ordenService from '../services/ordenService';

// Componentes Modulares de Órdenes
import OrdenCard from '../components/ordenes/OrdenCard';
import OrdenSkeleton from '../components/ordenes/OrdenSkeleton';
import OrdenEmptyState from '../components/ordenes/OrdenEmptyState';

/**
 * Vista Principal: Tablero de Órdenes de Trabajo.
 * Gestiona la carga reactiva de órdenes reales en el backend, filtros de búsqueda,
 * y delega de manera modular la visualización para escritorio y dispositivos móviles.
 */
const OrdenesPage = () => {
  const navigate = useNavigate();

  // Estados de React
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Función para obtener órdenes reales del backend
  const fetchOrdenes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordenService.obtenerOrdenes();
      setOrdenes(data);
    } catch (err) {
      console.error('Error al consultar las órdenes de trabajo:', err);
      
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message || err.response?.data?.error || '';
      
      let friendlyError = 'No se pudieron cargar las órdenes de trabajo. Verifique la conexión con el servidor.';
      if (status === 500) {
        friendlyError = 'Error interno del servidor al procesar las órdenes. Por favor, reintente en unos momentos.';
      } else if (serverMsg) {
        friendlyError = serverMsg;
      }
      
      setError(friendlyError);
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };

  // Carga automática al montar el componente (Refresco automático recomendado al navegar)
  useEffect(() => {
    fetchOrdenes();
  }, []);

  // Filtrar órdenes por cliente, placa, marca/modelo, supervisor asignado o código de orden
  const filteredOrdenes = ordenes.filter((orden) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    // Proteger todos los accesos anidados mediante optional chaining
    const ordenId = String(orden?.id || '').toLowerCase();
    const clienteNombre = String(orden?.vehiculo?.cliente?.nombre || '').toLowerCase();
    const placa = String(orden?.vehiculo?.placa || '').toLowerCase();
    const marca = String(orden?.vehiculo?.marca || '').toLowerCase();
    const modelo = String(orden?.vehiculo?.modelo || '').toLowerCase();
    const tecnicoNombre = String(orden?.tecnico?.nombre || '').toLowerCase();

    return (
      ordenId.includes(term) ||
      clienteNombre.includes(term) ||
      placa.includes(term) ||
      marca.includes(term) ||
      modelo.includes(term) ||
      tecnicoNombre.includes(term)
    );
  });

  // Redireccionar al detalle usando React Router useNavigate (evitando window.location)
  const handleVerDetalle = (id) => {
    navigate(`/ordenes/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white select-none">
            Órdenes de Trabajo
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 select-none">
            Gestión y seguimiento de mantenimientos vehiculares activos.
          </p>
        </div>
        <Button
          onClick={() => navigate('/ordenes/nueva')}
          icon={Plus}
          variant="primary"
          className="w-full sm:w-auto h-10 shadow-sm font-bold"
        >
          Nueva Orden
        </Button>
      </div>

      {/* Barra de Búsqueda */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar por cliente, placa, marca/modelo, técnico o código de orden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </CardBody>
      </Card>

      {/* RENDERIZADO REACTIVO DINÁMICO */}
      {loading ? (
        <OrdenSkeleton />
      ) : error ? (
        /* Panel Elegante de Error */
        <Card className="animate-fadeIn border-rose-200/80 dark:border-rose-900/50">
          <CardBody className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full border border-rose-100 dark:border-rose-900/50 shrink-0">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white select-none">
              Error al obtener órdenes
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              {error}
            </p>
            <Button
              onClick={fetchOrdenes}
              icon={RefreshCw}
              variant="outline"
              className="border-rose-300 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 h-9 font-bold text-xs"
            >
              Reintentar
            </Button>
          </CardBody>
        </Card>
      ) : ordenes.length === 0 ? (
        /* Empty State */
        <OrdenEmptyState />
      ) : filteredOrdenes.length === 0 ? (
        /* Sin resultados en la búsqueda */
        <Card className="animate-fadeIn">
          <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-2 text-slate-350 dark:text-slate-650" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Sin coincidencias</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pruebe a cambiar los criterios de búsqueda (ej. placa, marca o nombre del cliente).
            </p>
          </div>
        </Card>
      ) : (
        /* Listado de Órdenes Reales en Cuadrícula Responsiva Premium (tipo Jira/Notion) */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-fadeIn">
          {filteredOrdenes.map((orden) => (
            <OrdenCard
              key={orden.id || orden.ordenId}
              orden={orden}
              onVerDetalle={handleVerDetalle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdenesPage;
