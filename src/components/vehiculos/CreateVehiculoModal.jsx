import React, { useState, useEffect } from 'react';
import { Car, Bike, Plus, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import vehiculoService from '../../services/vehiculoService';

/**
 * Modal modular para la creación rápida de vehículos.
 * Totalmente desacoplado de la página contenedora para permitir su reutilización.
 * Preparado para soportar edición en fases futuras mediante props opcionales.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Indica si el modal está visible.
 * @param {Function} props.onClose - Callback disparado al cerrar el modal.
 * @param {string|number} props.clienteId - ID del cliente al cual se asociará el vehículo.
 * @param {Function} props.onSuccess - Callback invocado tras crear el vehículo exitosamente.
 * @param {Object} [props.vehiculoToEdit] - Prop opcional para soportar modo EDICIÓN en el futuro.
 */
export const CreateVehiculoModal = ({
  isOpen,
  onClose,
  clienteId,
  onSuccess,
  vehiculoToEdit = null, // Preparado para estructura futura de edición
}) => {
  const isEditMode = !!vehiculoToEdit;

  // Estados del Formulario
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [tipo, setTipo] = useState('AUTO');

  // Estados de UX y Validación
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  // Inicializar o limpiar formulario al abrir/cerrar o cambiar a modo edición
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && vehiculoToEdit) {
        setPlaca(vehiculoToEdit.placa || '');
        setMarca(vehiculoToEdit.marca || '');
        setModelo(vehiculoToEdit.modelo || '');
        setTipo(vehiculoToEdit.tipo || 'AUTO');
      } else {
        setPlaca('');
        setMarca('');
        setModelo('');
        setTipo('AUTO');
      }
      setFormErrors({});
      setServerError(null);
    }
  }, [isOpen, isEditMode, vehiculoToEdit]);

  if (!isOpen) return null;

  // Manejar validación y envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setServerError(null);

    const errors = {};
    const trimmedPlaca = placa.trim();
    const trimmedMarca = marca.trim();
    const trimmedModelo = modelo.trim();

    // Validaciones de frontend requeridas
    if (!trimmedPlaca) {
      errors.placa = 'La placa del vehículo es obligatoria.';
    }
    if (!trimmedMarca) {
      errors.marca = 'La marca del vehículo es obligatoria.';
    }
    if (!trimmedModelo) {
      errors.modelo = 'El modelo del vehículo es obligatorio.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Normalizar la placa antes de guardar
    const normalizedPlaca = trimmedPlaca.toUpperCase();

    setIsSaving(true);
    try {
      const payload = {
        clienteId: Number(clienteId),
        placa: normalizedPlaca,
        marca: trimmedMarca,
        modelo: trimmedModelo,
        tipo, // Ya es "AUTO" o "MOTO"
      };

      let responseVehicle;

      if (isEditMode) {
        // Estructura futura para edición
        console.log('Modo edición en desarrollo para ID:', vehiculoToEdit.id, payload);
        // Aquí se llamaría a vehiculoService.actualizarVehiculo(vehiculoToEdit.id, payload)
        responseVehicle = { id: vehiculoToEdit.id, ...payload };
      } else {
        // Integración real con el backend
        responseVehicle = await vehiculoService.crearVehiculo(payload);
      }

      // Notificación Toast Premium adaptada a Dark Theme
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: isEditMode ? 'Vehículo actualizado con éxito' : 'Vehículo registrado con éxito',
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

      // Invocar callback de éxito y limpiar formulario
      if (onSuccess) {
        onSuccess(responseVehicle);
      }
      onClose();
    } catch (err) {
      console.error('Error al guardar vehículo en el backend:', err);
      
      // Manejo de errores de backend con mapeo amigable para casos comunes (e.g., placa duplicada)
      const errorMsg = err.response?.data?.message || err.response?.data?.error || '';
      const status = err.response?.status;

      if (
        status === 409 || 
        errorMsg.toLowerCase().includes('duplicate') || 
        errorMsg.toLowerCase().includes('placa') ||
        errorMsg.toLowerCase().includes('unique')
      ) {
        setServerError('Ya existe un vehículo registrado con esta placa.');
      } else {
        setServerError(errorMsg || 'Ocurrió un error inesperado al registrar el vehículo. Por favor, reintente.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSaving && onClose()}
      title={isEditMode ? 'Editar Vehículo' : 'Registrar Vehículo'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Alerta de Error del Backend */}
        {serverError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-250 dark:border-rose-900/50 rounded-lg text-rose-600 dark:text-rose-400 text-xs animate-fadeIn font-medium">
            {serverError}
          </div>
        )}

        {/* Campo Placa */}
        <Input
          label="Placa *"
          placeholder="Ej: ABC123"
          required
          value={placa}
          onChange={(e) => {
            setPlaca(e.target.value);
            if (formErrors.placa) setFormErrors({ ...formErrors, placa: null });
          }}
          error={formErrors.placa}
          disabled={isSaving}
          className="uppercase"
        />

        {/* Campo Marca */}
        <Input
          label="Marca *"
          placeholder="Ej: Nissan / Yamaha"
          required
          value={marca}
          onChange={(e) => {
            setMarca(e.target.value);
            if (formErrors.marca) setFormErrors({ ...formErrors, marca: null });
          }}
          error={formErrors.marca}
          disabled={isSaving}
        />

        {/* Campo Modelo */}
        <Input
          label="Modelo *"
          placeholder="Ej: Sentra / MT-03"
          required
          value={modelo}
          onChange={(e) => {
            setModelo(e.target.value);
            if (formErrors.modelo) setFormErrors({ ...formErrors, modelo: null });
          }}
          error={formErrors.modelo}
          disabled={isSaving}
        />

        {/* Campo Tipo de Vehículo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Tipo de Vehículo *
          </label>
          <div className="relative">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              disabled={isSaving}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
            >
              <option value="AUTO">Automóvil</option>
              <option value="MOTO">Motocicleta</option>
            </select>
            {/* Indicador visual del tipo seleccionado */}
            <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
              {tipo === 'AUTO' ? <Car className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-5">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Guardando...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Save className="w-4 h-4 mr-1.5" />
                <span>{isEditMode ? 'Guardar Cambios' : 'Guardar Vehículo'}</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateVehiculoModal;
