import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Car, Bike, Save, ArrowLeft, Search, Check, ClipboardList, Wrench, CreditCard, Mail, Phone, Calendar } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Swal from 'sweetalert2';
import clienteService from '../services/clienteService';
import vehiculoService from '../services/vehiculoService';
import VehiculoList from '../components/vehiculos/VehiculoList';
import VehiculoSkeleton from '../components/vehiculos/VehiculoSkeleton';
import VehiculoEmptyState from '../components/vehiculos/VehiculoEmptyState';
import CreateVehiculoModal from '../components/vehiculos/CreateVehiculoModal';
import ordenService from '../services/ordenService';
import adminService from '../services/adminService';
import { usePerfil } from '../context/PerfilContext';
import OrdenFormSection from '../components/ordenes/OrdenFormSection';

// Clientes iniciales para simulación de búsqueda
const INITIAL_CLIENTES = [
  { id: 1, nombre: 'Marcos López', email: 'marcos@gmail.com', telefono: '555-0199', cedula: '1234567890' },
  { id: 2, nombre: 'Ana María Gómez', email: 'ana.gomez@hotmail.com', telefono: '555-0211', cedula: '0987654321' },
];

/**
 * Vista de registro de nueva orden de trabajo.
 * Vista core altamente operativa con modals y búsqueda de cliente / vehículo.
 */
const NuevaOrdenPage = () => {
  const navigate = useNavigate();

  // Estados de los Modales
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  // Estados de Integración del Backend (Clientes)
  const [loading, setLoading] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteNoEncontrado, setClienteNoEncontrado] = useState(false);
  const [error, setError] = useState(null);

  // Estados para Registro de Clientes (POST /clientes)
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [clientErrors, setClientErrors] = useState({});
  const [modalError, setModalError] = useState(null);

  // Estados de Integración de Vehículos (GET /vehiculos?clienteId=...)
  const [loadingVehiculos, setLoadingVehiculos] = useState(false);
  const [vehiculosCliente, setVehiculosCliente] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [errorVehiculos, setErrorVehiculos] = useState(null);

  // Datos y Selección
  const [clientes, setClientes] = useState(INITIAL_CLIENTES);
  const [searchCedula, setSearchCedula] = useState('');

  // Datos de la Orden (Homologados con backend real)
  const [kilometraje, setKilometraje] = useState('');
  const [tipoServicio, setTipoServicio] = useState('PREVENTIVO');
  const [diagnostico, setDiagnostico] = useState('');
  const [isSavingOrden, setIsSavingOrden] = useState(false);
  const [errors, setErrors] = useState({});

  // Contexto y Técnicos
  const { perfil, isAdmin } = usePerfil();
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoId, setTecnicoId] = useState('');

  // Cargar técnicos si es administrador, o asignar el técnico actual
  useEffect(() => {
    if (isAdmin) {
      const fetchTecnicos = async () => {
        try {
          const users = await adminService.listarUsuarios();
          const soloTecnicos = users.filter(u => u.rol === 'TECNICO' && u.activo !== false);
          setTecnicos(soloTecnicos);
          if (soloTecnicos.length > 0) {
            setTecnicoId(soloTecnicos[0].id);
          }
        } catch (err) {
          console.error('Error al cargar técnicos:', err);
        }
      };
      fetchTecnicos();
    } else if (perfil) {
      setTecnicoId(perfil.id);
    }
  }, [isAdmin, perfil]);

  // Referencia para focus visual automático de vehículos
  const vehiculoSeccionRef = useRef(null);

  // Formularios de Creación Rápida en Modales
  const [newClient, setNewClient] = useState({ nombre: '', email: '', telefono: '', cedula: '' });

  // Buscar Cliente por Cédula / Identificación de forma real en backend
  const handleBuscarCliente = async () => {
    if (!searchCedula.trim()) return;

    setLoading(true);
    setError(null);
    setClienteNoEncontrado(false);
    setClienteSeleccionado(null);

    try {
      const data = await clienteService.buscarClientePorDocumento(searchCedula.trim());
      
      // Validación robusta si el backend retorna: objeto, arreglo, null, o arreglo vacío
      let client = null;
      if (Array.isArray(data)) {
        if (data.length > 0) {
          client = data[0];
        }
      } else if (data && typeof data === 'object') {
        client = data;
      }

      if (client && (client.id || client.nombre || client.documento || client.cedula)) {
        // Normalización para soportar tanto 'cedula' como 'documento'
        const normalizedClient = {
          id: client.id,
          nombre: client.nombre || '',
          email: client.email || '',
          telefono: client.telefono || '',
          cedula: client.cedula || client.documento || '',
          documento: client.documento || client.cedula || ''
        };

        setClienteSeleccionado(normalizedClient);
        setClienteNoEncontrado(false);
      } else {
        setClienteNoEncontrado(true);
        setClienteSeleccionado(null);
      }
    } catch (err) {
      console.error('Error al consultar cliente en backend:', err);
      setError('Ocurrió un error al consultar el servidor. Por favor, intente nuevamente.');
      setClienteSeleccionado(null);
      setClienteNoEncontrado(false);
    } finally {
      setLoading(false);
    }
  };

  // Guardar Nuevo Cliente en el backend real (POST /clientes)
  const handleSaveClient = async (e) => {
    e.preventDefault();
    setClientErrors({});
    setModalError(null);

    const errors = {};
    const trimmedNombre = newClient.nombre.trim();
    const trimmedCedula = newClient.cedula.trim();
    const trimmedEmail = newClient.email.trim();
    const trimmedTelefono = newClient.telefono.trim();

    // Validaciones frontend obligatorias
    if (!trimmedNombre) {
      errors.nombre = 'El nombre completo es requerido.';
    }
    if (!trimmedCedula) {
      errors.cedula = 'El documento o cédula es requerido.';
    }
    
    // Validación opcional de formato de email si se ingresó algo
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'El formato de correo electrónico no es válido.';
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    setIsSavingClient(true);
    try {
      const payload = {
        nombre: trimmedNombre,
        documento: trimmedCedula,
        telefono: trimmedTelefono || null,
        email: trimmedEmail || null
      };

      const response = await clienteService.crearCliente(payload);

      // Normalizar la respuesta del backend para mantener consistencia
      const createdClient = {
        id: response.id || response.clienteId || Date.now(),
        nombre: response.nombre || trimmedNombre,
        email: response.email || trimmedEmail || '',
        telefono: response.telefono || trimmedTelefono || '',
        cedula: response.documento || response.cedula || trimmedCedula,
        documento: response.documento || response.cedula || trimmedCedula
      };

      // Notificación Success con SweetAlert2 minimalista y Premium adaptada a Dark Theme
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Cliente registrado con éxito',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1e293b', // slate-800
        color: '#f8fafc',      // slate-50
        iconColor: '#3b82f6',  // blue-500
        customClass: {
          popup: 'rounded-xl border border-slate-700/60 shadow-lg animate-fadeIn'
        }
      });

      // Actualizar automáticamente los estados principales para seleccionarlo directamente
      setClienteSeleccionado(createdClient);
      setClienteNoEncontrado(false);
      setError(null);

      // Sincronizar el input de búsqueda de documento en pantalla
      setSearchCedula(createdClient.cedula);

      // Limpiar formulario y cerrar modal
      setNewClient({ nombre: '', email: '', telefono: '', cedula: '' });
      setIsClientModalOpen(false);
    } catch (err) {
      console.error('Error al registrar cliente:', err);
      // Mensaje de error amigable desde la respuesta del backend si existe, o uno por defecto
      const apiErrorMessage = err.response?.data?.message || err.response?.data?.error || 'Ocurrió un error al registrar el cliente en el servidor.';
      setModalError(apiErrorMessage);
    } finally {
      setIsSavingClient(false);
    }
  };

  // Consultar vehículos del cliente desde el backend
  const handleConsultarVehiculos = async (clienteId) => {
    if (!clienteId) return;
    setLoadingVehiculos(true);
    setErrorVehiculos(null);
    setVehiculoSeleccionado(null);
    try {
      const data = await vehiculoService.obtenerVehiculosPorCliente(clienteId);
      setVehiculosCliente(data);

      // UX Inteligente: Si el cliente tiene exactamente 1 vehículo, seleccionarlo automáticamente
      if (data.length === 1) {
        setVehiculoSeleccionado(data[0]);
      }
    } catch (err) {
      console.error('Error al consultar vehículos del cliente:', err);
      setErrorVehiculos('No se pudieron obtener los vehículos del cliente. Intente nuevamente.');
      setVehiculosCliente([]);
    } finally {
      setLoadingVehiculos(false);
    }
  };

  // Consultar automáticamente los vehículos asociados al cambiar el cliente seleccionado
  useEffect(() => {
    // Proteger el useEffect de consulta
    if (!clienteSeleccionado?.id) {
      setVehiculosCliente([]);
      setVehiculoSeleccionado(null);
      setErrorVehiculos(null);
      setLoadingVehiculos(false); // Resetear loading para evitar estados inconsistentes al limpiar
      return;
    }
    
    handleConsultarVehiculos(clienteSeleccionado.id);
  }, [clienteSeleccionado?.id]);

  // Callback ejecutado tras crear exitosamente un vehículo real
  const handleVehicleCreated = async (createdVehicle) => {
    // 3. Auto-selección inmediata antes de refrescar
    setVehiculoSeleccionado(createdVehicle);

    // Añadir localmente de inmediato para evitar flicker o retardo visual
    setVehiculosCliente(prev => {
      const filtered = prev.filter(v => v.id !== createdVehicle.id && v.placa !== createdVehicle.placa);
      return [...filtered, createdVehicle];
    });

    // Cerrar el modal
    setIsVehicleModalOpen(false);

    // 7. UX: Asegurar focus visual automático hacia la sección de vehículos con scroll suave
    setTimeout(() => {
      vehiculoSeccionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    // 4. Evitar flicker visual: Refrescar la lista en background sin limpiar estados
    if (clienteSeleccionado?.id) {
      try {
        const data = await vehiculoService.obtenerVehiculosPorCliente(clienteSeleccionado.id);
        setVehiculosCliente(data);
        
        // Sincronizar selección con el objeto real persistido por el backend
        const found = data.find(v => v.id === createdVehicle.id || v.placa === createdVehicle.placa);
        if (found) {
          setVehiculoSeleccionado(found);
        }
      } catch (err) {
        console.error('Error al refrescar vehículos en background:', err);
      }
    }
  };

  // Enviar / Guardar Orden de Trabajo completa consumiendo el backend real
  const handleSaveOrden = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrors({});

    // Validar cliente y vehículo seleccionados
    if (!clienteSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Cliente Requerido',
        text: 'Por favor, busque y seleccione un cliente en el paso 1 para registrar la orden.',
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-xl border border-slate-700 shadow-lg'
        }
      });
      return;
    }

    if (!vehiculoSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Vehículo Requerido',
        text: 'Por favor, seleccione o registre un vehículo asociado al cliente en el paso 2.',
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-xl border border-slate-700 shadow-lg'
        }
      });
      return;
    }

    const localErrors = {};
    const trimmedDiagnostico = diagnostico.trim();

    // Validar Diagnóstico
    if (!trimmedDiagnostico) {
      localErrors.diagnostico = 'El diagnóstico o trabajo requerido es obligatorio.';
    }

    // Normalizar y validar Kilometraje
    const numKilometraje = Number(kilometraje);
    if (!kilometraje || isNaN(numKilometraje) || numKilometraje <= 0) {
      localErrors.kilometraje = 'Debe ingresar un kilometraje válido mayor a 0.';
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setIsSavingOrden(true);
    try {
      const payload = {
        vehiculoId: Number(vehiculoSeleccionado.id),
        tecnicoId: Number(tecnicoId), // Usar el técnico seleccionado o auto-asignado
        kilometraje: numKilometraje,
        tipoServicio: tipoServicio.toUpperCase(),
        diagnostico: trimmedDiagnostico
      };

      const response = await ordenService.crearOrden(payload);

      // Mostrar SweetAlert2 Toast de Éxito primero
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Orden registrada con éxito',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1e293b', // slate-800
        color: '#f8fafc',      // slate-50
        iconColor: '#3b82f6',  // blue-500
        customClass: {
          popup: 'rounded-xl border border-slate-700/60 shadow-lg animate-fadeIn'
        }
      });

      // Redirección recomendada a /ordenes/:id después del Toast exitoso, evitando borrar estados
      const createdId = response?.id || response?.ordenId;
      setTimeout(() => {
        if (createdId) {
          navigate(`/ordenes/${createdId}`);
        } else {
          navigate('/ordenes');
        }
      }, 500); // 500ms delay para mantener fluidez y evitar saltos bruscos

    } catch (err) {
      console.error('Error al guardar la orden de trabajo en el servidor:', err);

      // Mapear los errores técnicos a mensajes sumamente amigables
      const errorMsg = err.response?.data?.message || err.response?.data?.error || '';
      const status = err.response?.status;

      let friendlyMessage = 'Ocurrió un error inesperado al registrar la orden. Por favor, reintente.';

      if (status === 404 || errorMsg.toLowerCase().includes('vehiculo') || errorMsg.toLowerCase().includes('inexistente')) {
        friendlyMessage = 'El vehículo seleccionado no se encuentra registrado en el servidor.';
      } else if (status === 400 || errorMsg.toLowerCase().includes('prisma') || errorMsg.toLowerCase().includes('validation')) {
        friendlyMessage = 'Los datos enviados no son válidos para el sistema. Verifique los campos ingresados.';
      } else if (errorMsg.toLowerCase().includes('foreign key') || errorMsg.toLowerCase().includes('tecnico')) {
        friendlyMessage = 'El técnico asignado no es válido o no existe en el sistema.';
      } else if (status === 500) {
        friendlyMessage = 'Error interno del servidor. Por favor, intente más tarde o consulte con soporte técnico.';
      } else if (errorMsg) {
        friendlyMessage = errorMsg;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error al Registrar Orden',
        text: friendlyMessage,
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-xl border border-slate-700 shadow-lg'
        }
      });
    } finally {
      setIsSavingOrden(false);
    }
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

      <form onSubmit={handleSaveOrden} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Lado Izquierdo: Cliente y Vehículo */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">1</span>
                Información del Cliente
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow">
                  <Input
                    placeholder="Ingrese Cédula del Cliente (Ej: 1234567890 o 0987654321)"
                    value={searchCedula}
                    onChange={(e) => {
                      setSearchCedula(e.target.value);
                      if (clienteNoEncontrado) setClienteNoEncontrado(false);
                      if (error) setError(null);
                    }}
                    disabled={loading || !!clienteSeleccionado}
                    className={clienteSeleccionado ? 'opacity-70 cursor-not-allowed bg-slate-100/50 dark:bg-slate-900/30' : ''}
                  />
                </div>
                {!clienteSeleccionado && (
                  <Button 
                    onClick={handleBuscarCliente}
                    icon={Search} 
                    variant="secondary"
                    className="h-9 self-end w-full sm:w-auto"
                    disabled={loading || !searchCedula.trim()}
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Button>
                )}
              </div>

              {/* Estado de Carga (Spinner) */}
              {loading && (
                <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-slate-200/50 dark:border-slate-700/50 animate-pulse">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Buscando cliente en el sistema...</span>
                  </div>
                </div>
              )}

              {/* Estado de Error de Backend */}
              {error && !loading && (
                <div className="p-4 bg-rose-50 dark:bg-rose-955/10 border border-rose-200/80 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                  <span>{error}</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-rose-200 hover:bg-rose-100 dark:border-rose-900 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 h-7"
                    onClick={handleBuscarCliente}
                  >
                    Reintentar
                  </Button>
                </div>
              )}

              {/* Caso Cliente No Encontrado */}
              {clienteNoEncontrado && !loading && !error && (
                <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                  <div className="text-center sm:text-left">
                    <h5 className="font-bold text-slate-955 dark:text-white text-sm">Cliente no encontrado</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">El documento ingresado no coincide con ningún cliente registrado.</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setNewClient({ ...newClient, cedula: searchCedula });
                      setIsClientModalOpen(true);
                    }}
                    icon={UserPlus} 
                    variant="primary"
                    size="sm"
                    className="shrink-0"
                  >
                    Crear Cliente
                  </Button>
                </div>
              )}

              {/* Caso Cliente Encontrado */}
              {clienteSeleccionado && !loading && (
                <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 relative animate-fadeIn">
                  <button 
                    type="button" 
                    onClick={() => {
                      setClienteSeleccionado(null);
                      setSearchCedula('');
                      setClienteNoEncontrado(false);
                      setError(null);
                      setVehiculosCliente([]);
                      setVehiculoSeleccionado(null);
                      setErrorVehiculos(null);
                      setLoadingVehiculos(false);
                    }}
                    className="absolute top-4 right-4 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Cambiar Cliente
                  </button>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {clienteSeleccionado.nombre}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-350">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <span>C.I: {clienteSeleccionado.cedula || clienteSeleccionado.documento}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-350">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{clienteSeleccionado.email || 'Sin email registrado'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-350">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span>Telf: {clienteSeleccionado.telefono || 'Sin teléfono registrado'}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* SECCIÓN 2: VEHÍCULO */}
          {clienteSeleccionado && (
            <div ref={vehiculoSeccionRef} className="mt-6 flex flex-col">
              <Card className="flex flex-col">
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
                <CardBody className="justify-center flex flex-col">
                  {loadingVehiculos ? (
                    <VehiculoSkeleton />
                  ) : errorVehiculos ? (
                    <div className="p-4 bg-rose-50 dark:bg-rose-955/10 border border-rose-200/80 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                      <span>{errorVehiculos}</span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-rose-200 hover:bg-rose-100 dark:border-rose-900 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 h-7 shrink-0"
                        onClick={() => handleConsultarVehiculos(clienteSeleccionado.id)}
                      >
                        Reintentar
                      </Button>
                    </div>
                  ) : vehiculosCliente.length > 0 ? (
                    <VehiculoList 
                      vehiculos={vehiculosCliente}
                      vehiculoSeleccionado={vehiculoSeleccionado}
                      onSelectVehiculo={setVehiculoSeleccionado}
                    />
                  ) : (
                    <VehiculoEmptyState onRegister={() => setIsVehicleModalOpen(true)} />
                  )}
                </CardBody>
              </Card>
            </div>
          )}

        </div>

        {/* Lado Derecho: Detalles de la Orden */}
        <div className="space-y-6 flex flex-col">
          <OrdenFormSection
            cliente={clienteSeleccionado}
            vehiculo={vehiculoSeleccionado}
            kilometraje={kilometraje}
            setKilometraje={setKilometraje}
            tipoServicio={tipoServicio}
            setTipoServicio={setTipoServicio}
            diagnostico={diagnostico}
            setDiagnostico={setDiagnostico}
            tecnicoId={tecnicoId}
            setTecnicoId={setTecnicoId}
            tecnicos={tecnicos}
            perfil={perfil}
            isAdmin={isAdmin}
            errors={errors}
            isSaving={isSavingOrden}
            onSubmit={handleSaveOrden}
          />
        </div>

      </form>

      {/* ========================================================================= */}
      {/* MODAL: CREAR CLIENTE NUEVO */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isClientModalOpen}
        onClose={() => !isSavingClient && setIsClientModalOpen(false)}
        title="Registrar Nuevo Cliente"
      >
        <form onSubmit={handleSaveClient} className="space-y-4">
          {/* Alerta de Error de Servidor en el Modal */}
          {modalError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-955/10 border border-rose-250 dark:border-rose-900/50 rounded-lg text-rose-600 dark:text-rose-400 text-xs animate-fadeIn">
              {modalError}
            </div>
          )}

          <Input
            label="Nombre Completo *"
            placeholder="Ej: Marcos López"
            required
            value={newClient.nombre}
            onChange={(e) => {
              setNewClient({ ...newClient, nombre: e.target.value });
              if (clientErrors.nombre) setClientErrors({ ...clientErrors, nombre: null });
            }}
            error={clientErrors.nombre}
            disabled={isSavingClient}
          />
          <Input
            label="Cédula / Identificación *"
            placeholder="Ej: 1234567890"
            required
            value={newClient.cedula}
            onChange={(e) => {
              setNewClient({ ...newClient, cedula: e.target.value });
              if (clientErrors.cedula) setClientErrors({ ...clientErrors, cedula: null });
            }}
            error={clientErrors.cedula}
            disabled={isSavingClient}
          />
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="Ej: marcos@gmail.com"
            value={newClient.email}
            onChange={(e) => {
              setNewClient({ ...newClient, email: e.target.value });
              if (clientErrors.email) setClientErrors({ ...clientErrors, email: null });
            }}
            error={clientErrors.email}
            disabled={isSavingClient}
          />
          <Input
            label="Teléfono de Contacto"
            placeholder="Ej: 555-0199"
            value={newClient.telefono}
            onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })}
            disabled={isSavingClient}
          />
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-5">
            <Button 
              variant="secondary" 
              onClick={() => setIsClientModalOpen(false)}
              disabled={isSavingClient}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSavingClient}
            >
              {isSavingClient ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </div>
              ) : (
                'Guardar Cliente'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: REGISTRAR VEHÍCULO NUEVO */}
      {/* ========================================================================= */}
      <CreateVehiculoModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        clienteId={clienteSeleccionado?.id}
        onSuccess={handleVehicleCreated}
      />

    </div>
  );
};

export default NuevaOrdenPage;
