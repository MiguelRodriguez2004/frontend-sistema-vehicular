import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Car, Bike, Save, ArrowLeft, Search, Check, ClipboardList, Wrench, CreditCard, Mail, Phone, Calendar } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

// Clientes iniciales para simulación de búsqueda
const INITIAL_CLIENTES = [
  { id: 1, nombre: 'Marcos López', email: 'marcos@gmail.com', telefono: '555-0199', cedula: '1234567890' },
  { id: 2, nombre: 'Ana María Gómez', email: 'ana.gomez@hotmail.com', telefono: '555-0211', cedula: '0987654321' },
];

// Vehículos vinculados por id de cliente (soporta motos y automóviles)
const MOCK_VEHICULOS_CLIENTE = {
  1: [
    { id: 101, marca: 'Toyota', modelo: 'Hilux', placa: 'AAA-123', anio: '2022', tipo: 'automovil' },
    { id: 102, marca: 'Yamaha', modelo: 'FZ25', placa: 'MOTO-789', anio: '2023', tipo: 'motocicleta' }
  ],
  2: [
    { id: 201, marca: 'Chevrolet', modelo: 'Sail', placa: 'XYZ-987', anio: '2019', tipo: 'automovil' }
  ]
};

/**
 * Vista de registro de nueva orden de trabajo.
 * Vista core altamente operativa con modals y búsqueda de cliente / vehículo.
 */
const NuevaOrdenPage = () => {
  const navigate = useNavigate();

  // Estados de los Modales
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  // Datos y Selección
  const [clientes, setClientes] = useState(INITIAL_CLIENTES);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchCedula, setSearchCedula] = useState('');
  
  // Vehículos del cliente seleccionado
  const [vehiculos, setVehiculos] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  // Datos de la Orden
  const [kilometraje, setKilometraje] = useState('');
  const [tipoServicio, setTipoServicio] = useState('preventivo');
  const [descripcion, setDescripcion] = useState('');
  const [novedades, setNovedades] = useState('');

  // Formularios de Creación Rápida en Modales
  const [newClient, setNewClient] = useState({ nombre: '', email: '', telefono: '', cedula: '' });
  const [newVehicle, setNewVehicle] = useState({ marca: '', modelo: '', placa: '', anio: '', tipo: 'automovil' });

  // Buscar Cliente por Cédula / Identificación
  const handleBuscarCliente = () => {
    const clienteEncontrado = clientes.find(c => c.cedula === searchCedula);
    if (clienteEncontrado) {
      setSelectedCliente(clienteEncontrado);
      setVehiculos(MOCK_VEHICULOS_CLIENTE[clienteEncontrado.id] || []);
      setSelectedVehiculo(null);
    } else {
      alert('Cliente no encontrado. Por favor cree uno nuevo.');
    }
  };

  // Guardar Nuevo Cliente (Modal)
  const handleSaveClient = (e) => {
    e.preventDefault();
    if (!newClient.nombre || !newClient.cedula) return;

    const createdClient = {
      id: clientes.length + 1,
      ...newClient
    };

    setClientes([...clientes, createdClient]);
    setSelectedCliente(createdClient);
    setVehiculos([]); // Nuevo cliente inicia sin vehículos
    setSelectedVehiculo(null);
    setNewClient({ nombre: '', email: '', telefono: '', cedula: '' });
    setIsClientModalOpen(false);
  };

  // Guardar Nuevo Vehículo (Modal)
  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (!newVehicle.placa || !newVehicle.marca || !newVehicle.modelo) return;

    const createdVehicle = {
      id: Date.now(),
      ...newVehicle
    };

    const updatedVehiculos = [...vehiculos, createdVehicle];
    setVehiculos(updatedVehiculos);
    setSelectedVehiculo(createdVehicle);
    setNewVehicle({ marca: '', modelo: '', placa: '', anio: '', tipo: 'automovil' });
    setIsVehicleModalOpen(false);
  };

  // Enviar / Guardar Orden de Trabajo completa
  const handleSaveOrden = (e) => {
    e.preventDefault();
    if (!selectedCliente || !selectedVehiculo || !kilometraje || !descripcion) {
      alert('Por favor complete todos los datos mandatorios (Cliente, Vehículo, Kilometraje y Diagnóstico).');
      return;
    }

    const ordenData = {
      clienteId: selectedCliente.id,
      vehiculoId: selectedVehiculo.id,
      kilometraje,
      tipoServicio,
      descripcion,
      novedades,
      estado: 'Pendiente'
    };

    console.log('Guardando Orden:', ordenData);
    alert('Orden registrada con éxito (Simulado)');
    navigate('/ordenes');
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => navigate('/ordenes')}
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          className="border-none hover:bg-slate-200 dark:hover:bg-slate-700/60"
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Registrar Nueva Orden
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Siga los pasos para ingresar al sistema un vehículo, cliente y orden de trabajo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveOrden} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Izquierdo: Cliente y Vehículo */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          {/* SECCIÓN 1: CLIENTE */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">1</span>
                Información del Cliente
              </h3>
              {!selectedCliente && (
                <Button 
                  onClick={() => setIsClientModalOpen(true)}
                  icon={UserPlus} 
                  variant="outline" 
                  size="sm"
                >
                  Nuevo Cliente
                </Button>
              )}
            </CardHeader>
            <CardBody className="space-y-4 flex-grow">
              {!selectedCliente ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-grow">
                    <Input
                      placeholder="Ingrese Cédula del Cliente (Ej: 1234567890 o 0987654321)"
                      value={searchCedula}
                      onChange={(e) => setSearchCedula(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleBuscarCliente}
                    icon={Search} 
                    variant="secondary"
                    className="h-9 self-end w-full sm:w-auto"
                  >
                    Buscar
                  </Button>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 relative">
                  <button 
                    type="button" 
                    onClick={() => {
                      setSelectedCliente(null);
                      setVehiculos([]);
                      setSelectedVehiculo(null);
                    }}
                    className="absolute top-4 right-4 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Cambiar Cliente
                  </button>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {selectedCliente.nombre}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-350">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <span>C.I: {selectedCliente.cedula}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-350">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{selectedCliente.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-350">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span>Telf: {selectedCliente.telefono}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* SECCIÓN 2: VEHÍCULO */}
          {selectedCliente && (
            <Card className="flex flex-col mt-6 flex-grow">
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">2</span>
                  Vehículo Asociado
                </h3>
                <Button 
                  onClick={() => setIsVehicleModalOpen(true)}
                  icon={Car} 
                  variant="outline" 
                  size="sm"
                >
                  Registrar Vehículo
                </Button>
              </CardHeader>
              <CardBody className="flex-grow">
                {vehiculos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vehiculos.map((v) => {
                      const IsAutomovil = v.tipo === 'automovil';
                      return (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVehiculo(v)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer relative flex items-start gap-3 select-none ${
                            selectedVehiculo?.id === v.id
                              ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-900/10'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-650 bg-white dark:bg-slate-800'
                          }`}
                        >
                          {/* Icono del tipo de Vehículo */}
                          <div className={`p-2 rounded-lg shrink-0 ${
                            selectedVehiculo?.id === v.id 
                              ? 'bg-blue-500/20 text-blue-500' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                          }`}>
                            {IsAutomovil ? <Car className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                          </div>

                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {v.marca} {v.modelo}
                            </h4>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                              <p>Placa: <span className="font-bold uppercase text-slate-800 dark:text-slate-200">{v.placa}</span></p>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="text-[10px] font-semibold text-slate-400">Año: {v.anio}</span>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <Badge variant={IsAutomovil ? 'info' : 'warning'} className="px-1.5 py-0 text-[9px]">
                                  {IsAutomovil ? 'Automóvil' : 'Motocicleta'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {selectedVehiculo?.id === v.id && (
                            <span className="absolute top-4 right-4 text-blue-500 shrink-0">
                              <Check className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-250 dark:border-slate-850">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Este cliente no tiene vehículos registrados aún. Registre uno para proceder.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

        </div>

        {/* Lado Derecho: Detalles de la Orden */}
        <div className="space-y-6 flex flex-col">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">3</span>
                  Detalles del Mantenimiento
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Kilometraje Actual *"
                  type="number"
                  placeholder="Ej: 45000"
                  required
                  value={kilometraje}
                  onChange={(e) => setKilometraje(e.target.value)}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tipo de Servicio *
                  </label>
                  <select
                    value={tipoServicio}
                    onChange={(e) => setTipoServicio(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="preventivo">Preventivo</option>
                    <option value="correctivo">Correctivo</option>
                    <option value="diagnostico">Diagnóstico</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Diagnóstico / Trabajo Requerido *
                  </label>
                  <textarea
                    placeholder="Describa el síntoma o el trabajo a realizar..."
                    rows={4}
                    required
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Observaciones / Novedades Iniciales
                  </label>
                  <textarea
                    placeholder="Ej: Rayón en guardabarros izquierdo..."
                    rows={2}
                    value={novedades}
                    onChange={(e) => setNovedades(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </CardBody>
            </div>
            
            <CardFooter className="pt-2 pb-5 px-5">
              <Button
                type="submit"
                icon={Save}
                variant="primary"
                className="w-full h-10 text-sm font-bold shadow-md"
              >
                Crear Orden de Trabajo
              </Button>
            </CardFooter>
          </Card>
        </div>

      </form>

      {/* ========================================================================= */}
      {/* MODAL: CREAR CLIENTE NUEVO */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        title="Registrar Nuevo Cliente"
      >
        <form onSubmit={handleSaveClient} className="space-y-4">
          <Input
            label="Nombre Completo"
            placeholder="Ej: Marcos López"
            required
            value={newClient.nombre}
            onChange={(e) => setNewClient({ ...newClient, nombre: e.target.value })}
          />
          <Input
            label="Cédula / Identificación"
            placeholder="Ej: 1234567890"
            required
            value={newClient.cedula}
            onChange={(e) => setNewClient({ ...newClient, cedula: e.target.value })}
          />
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="Ej: marcos@gmail.com"
            value={newClient.email}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
          />
          <Input
            label="Teléfono de Contacto"
            placeholder="Ej: 555-0199"
            value={newClient.telefono}
            onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-5">
            <Button variant="secondary" onClick={() => setIsClientModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar Cliente
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: REGISTRAR VEHÍCULO NUEVO */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        title="Registrar Vehículo"
      >
        <form onSubmit={handleSaveVehicle} className="space-y-4">
          <Input
            label="Placa *"
            placeholder="Ej: AAA-123"
            required
            value={newVehicle.placa}
            onChange={(e) => setNewVehicle({ ...newVehicle, placa: e.target.value })}
          />
          <Input
            label="Marca *"
            placeholder="Ej: Toyota"
            required
            value={newVehicle.marca}
            onChange={(e) => setNewVehicle({ ...newVehicle, marca: e.target.value })}
          />
          <Input
            label="Modelo *"
            placeholder="Ej: Hilux"
            required
            value={newVehicle.modelo}
            onChange={(e) => setNewVehicle({ ...newVehicle, modelo: e.target.value })}
          />
          <Input
            label="Año"
            type="number"
            placeholder="Ej: 2022"
            value={newVehicle.anio}
            onChange={(e) => setNewVehicle({ ...newVehicle, anio: e.target.value })}
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tipo de Vehículo *
            </label>
            <select
              value={newVehicle.tipo}
              onChange={(e) => setNewVehicle({ ...newVehicle, tipo: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="automovil">Automóvil</option>
              <option value="motocicleta">Motocicleta</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-5">
            <Button variant="secondary" onClick={() => setIsVehicleModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Registrar Vehículo
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default NuevaOrdenPage;
