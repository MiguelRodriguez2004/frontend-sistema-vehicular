import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Car, Wrench, FileText, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

/**
 * Vista de Detalle de una Orden de Trabajo específica.
 * Estructura visual limpia y profesional dividida en paneles informativos.
 */
const DetalleOrdenPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulación de carga de datos basados en el ID de la URL
  const orden = {
    id: id || 'ORD-2026-001',
    fecha: '2026-05-24',
    tipoServicio: 'Mantenimiento Preventivo',
    estado: 'En Progreso',
    estadoVar: 'info',
    kilometraje: '45,230 km',
    descripcion: 'Cambio de aceite de motor de 10k, filtros de combustible y aire. Revisión de pastillas de freno delanteras y traseras.',
    novedades: 'Rayón pre-existente en el guardabarros delantero izquierdo. No se detectan fugas de fluidos en el cárter.',
    cliente: {
      nombre: 'Marcos López',
      cedula: '1234567890',
      email: 'marcos@gmail.com',
      telefono: '555-0199'
    },
    vehiculo: {
      marca: 'Toyota',
      modelo: 'Hilux',
      placa: 'AAA-123',
      anio: '2022',
      color: 'Gris Plata'
    },
    tecnico: {
      nombre: 'Carlos Rodríguez',
      registro: 'TEC-902'
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado con estado y navegación hacia atrás */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/ordenes')}
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            className="border-none hover:bg-slate-200 dark:hover:bg-slate-700/60"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Detalle de Orden
              </h1>
              <Badge variant={orden.estadoVar}>{orden.estado}</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Código de registro: <span className="font-bold">{orden.id}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Izquierdo: Información del Diagnóstico y Novedades */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ficha Diagnóstico */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                Trabajo Requerido y Diagnóstico
              </h3>
            </CardHeader>
            <CardBody className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-150 dark:border-slate-800/40">
                <p className="leading-relaxed whitespace-pre-line">{orden.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Tipo de Servicio</span>
                  <span className="font-bold text-slate-900 dark:text-white">{orden.tipoServicio}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Kilometraje de Ingreso</span>
                  <span className="font-bold text-slate-900 dark:text-white">{orden.kilometraje}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Ficha Novedades / Observaciones Iniciales */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                Novedades y Observaciones Iniciales
              </h3>
            </CardHeader>
            <CardBody className="text-sm text-slate-600 dark:text-slate-300">
              {orden.novedades ? (
                <p className="leading-relaxed">{orden.novedades}</p>
              ) : (
                <p className="text-slate-400 italic">No se han registrado novedades iniciales para esta orden.</p>
              )}
            </CardBody>
          </Card>

        </div>

        {/* Lado Derecho: Fichas del Cliente, Vehículo y Técnico */}
        <div className="space-y-6">

          {/* Ficha Cliente */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                Datos del Cliente
              </h3>
            </CardHeader>
            <CardBody className="text-sm space-y-2">
              <h4 className="font-bold text-slate-950 dark:text-white">{orden.cliente.nombre}</h4>
              <div className="text-slate-600 dark:text-slate-300 space-y-1.5">
                <p><span className="text-slate-400 text-xs block">Identificación:</span> {orden.cliente.cedula}</p>
                <p><span className="text-slate-400 text-xs block">Teléfono:</span> {orden.cliente.telefono}</p>
                <p><span className="text-slate-400 text-xs block">Email:</span> {orden.cliente.email}</p>
              </div>
            </CardBody>
          </Card>

          {/* Ficha Vehículo */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Car className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                Datos del Vehículo
              </h3>
            </CardHeader>
            <CardBody className="text-sm space-y-2">
              <h4 className="font-bold text-slate-950 dark:text-white">{orden.vehiculo.marca} {orden.vehiculo.modelo}</h4>
              <div className="text-slate-600 dark:text-slate-300 space-y-1.5">
                <p><span className="text-slate-400 text-xs block">Placa:</span> <span className="font-bold uppercase text-blue-600 dark:text-blue-400">{orden.vehiculo.placa}</span></p>
              </div>
            </CardBody>
          </Card>

          {/* Ficha Personal Asignado */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                Personal Técnico
              </h3>
            </CardHeader>
            <CardBody className="text-sm flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{orden.tecnico.nombre}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Registro: {orden.tecnico.registro}</p>
              </div>
            </CardBody>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default DetalleOrdenPage;
