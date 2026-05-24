import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Wrench, Calendar, Car, User, ClipboardList } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

// Datos estáticos realistas para simulación
const MOCK_ORDENES = [
  {
    id: 'ORD-2026-001',
    cliente: 'Marcos López',
    vehiculo: 'Toyota Hilux (AAA-123)',
    tipo: 'Mantenimiento Preventivo',
    fecha: '2026-05-24',
    estado: 'En Progreso',
    estadoVar: 'info'
  },
  {
    id: 'ORD-2026-002',
    cliente: 'Ana María Gómez',
    vehiculo: 'Chevrolet Sail (XYZ-987)',
    tipo: 'Reparación de Embrague',
    fecha: '2026-05-23',
    estado: 'Completado',
    estadoVar: 'success'
  },
  {
    id: 'ORD-2026-003',
    cliente: 'Juan Carlos Pérez',
    vehiculo: 'Ford Ranger (KBC-456)',
    tipo: 'Cambio de Frenos y Suspensión',
    fecha: '2026-05-22',
    estado: 'Pendiente',
    estadoVar: 'warning'
  },
  {
    id: 'ORD-2026-004',
    cliente: 'Sofía Castro',
    vehiculo: 'Kia Sportage (PDQ-321)',
    tipo: 'Alineación y Balanceo',
    fecha: '2026-05-20',
    estado: 'Completado',
    estadoVar: 'success'
  }
];

/**
 * Vista de Listado de Órdenes de Trabajo.
 * Proporciona búsqueda rápida, estados con colores semánticos y una interfaz adaptativa (responsive):
 * - Escritorio: Tabla tradicional administrativa de alta densidad.
 * - Mobile: Tarjetas (cards) individuales optimizadas para interacción táctil.
 */
const OrdenesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar órdenes por nombre de cliente, placa o código de orden
  const filteredOrdenes = MOCK_ORDENES.filter(
    (orden) =>
      orden.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Órdenes de Trabajo
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión y seguimiento de mantenimientos vehiculares activos.
          </p>
        </div>
        <Button
          onClick={() => navigate('/ordenes/nueva')}
          icon={Plus}
          variant="primary"
          className="w-full sm:w-auto h-10 shadow-sm"
        >
          Nueva Orden
        </Button>
      </div>

      {/* Tarjeta de Búsqueda y Filtros */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar por cliente, placa de vehículo o código de orden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </CardBody>
      </Card>

      {/* LISTADO DE ÓRDENES */}
      {filteredOrdenes.length > 0 ? (
        <>
          {/* VISTA 1: TABLA (Visible en Escritorios - md:block) */}
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border-b border-slate-200/60 dark:border-slate-700/50">
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Código</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Vehículo</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Tipo de Servicio</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {filteredOrdenes.map((orden) => (
                      <tr 
                        key={orden.id} 
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                          {orden.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{orden.cliente}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="font-medium">{orden.vehiculo}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{orden.tipo}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{orden.fecha}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Badge variant={orden.estadoVar}>{orden.estado}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <Button
                            onClick={() => navigate(`/ordenes/${orden.id}`)}
                            variant="secondary"
                            size="sm"
                            icon={Eye}
                            className="h-8.5"
                          >
                            Ver Detalle
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* VISTA 2: TARJETAS MÓVILES (Visible en Dispositivos Móviles - md:hidden) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredOrdenes.map((orden) => (
              <Card key={orden.id} className="relative">
                <CardBody className="p-5 space-y-4">
                  {/* Fila 1: Código y Estado */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-3">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {orden.id}
                    </span>
                    <Badge variant={orden.estadoVar}>{orden.estado}</Badge>
                  </div>

                  {/* Fila 2: Detalles */}
                  <div className="space-y-2.5 text-xs text-slate-650 dark:text-slate-350">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <p><span className="font-semibold text-slate-400">Cliente:</span> {orden.cliente}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-slate-400 shrink-0" />
                      <p><span className="font-semibold text-slate-400">Vehículo:</span> {orden.vehiculo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-slate-400 shrink-0" />
                      <p><span className="font-semibold text-slate-400">Servicio:</span> {orden.tipo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <p><span className="font-semibold text-slate-400">Fecha:</span> {orden.fecha}</p>
                    </div>
                  </div>

                  {/* Fila 3: Acción */}
                  <div className="pt-2">
                    <Button
                      onClick={() => navigate(`/ordenes/${orden.id}`)}
                      variant="secondary"
                      size="md"
                      icon={Eye}
                      className="w-full"
                    >
                      Ver Detalle
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card>
          <div className="px-6 py-12 text-center">
            <ClipboardList className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No se encontraron órdenes</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Intenta ajustar los criterios de búsqueda.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrdenesPage;
