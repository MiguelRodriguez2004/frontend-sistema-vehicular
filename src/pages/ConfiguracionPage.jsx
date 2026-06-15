import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, LogOut, User, Shield } from 'lucide-react';
import Swal from 'sweetalert2';
import Input from '../components/ui/Input';
import usuarioService from '../services/usuarioService';
import { useAuth } from '../context/AuthContext';
import { usePerfil } from '../context/PerfilContext';

/**
 * Página "Configuración".
 * Permite al usuario editar su nombre (usando react-hook-form),
 * cerrar su sesión y ver información de su cuenta.
 */
const ConfiguracionPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { refrescarPerfil } = usePerfil();

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  // Cargar el perfil del backend al montar
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        const data = await usuarioService.obtenerPerfil();
        setPerfil(data);
        reset({ nombre: data.nombre });
      } catch (err) {
        console.error('Error cargando perfil para configuración:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [reset]);

  /**
   * Guarda los cambios del formulario en el backend via PATCH /api/usuarios/me.
   */
  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const actualizado = await usuarioService.actualizarPerfil({ nombre: data.nombre });
      setPerfil(actualizado);
      reset({ nombre: actualizado.nombre });
      // Actualizar el contexto global para que el Navbar refleje el nuevo nombre
      await refrescarPerfil();

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: '¡Perfil actualizado con éxito!',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: '#1e293b',
        color: '#f8fafc',
        iconColor: '#3b82f6',
        customClass: { popup: 'rounded-xl border border-slate-700/60 shadow-lg' }
      });
    } catch (err) {
      console.error('Error guardando perfil:', err);

      const backendMsg = err.response?.data?.message || err.response?.data?.error;

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: backendMsg || 'No se pudo actualizar tu perfil. Intenta de nuevo.',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#1e293b',
        color: '#f8fafc',
        iconColor: '#ef4444',
        customClass: { popup: 'rounded-xl border border-slate-700/60 shadow-lg' }
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cierre de sesión con confirmación visual.
   */
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar Sesión?',
      text: 'Se cerrará tu sesión en el sistema y serás redirigido al inicio de sesión.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, Cerrar Sesión',
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: '#f8fafc',
      customClass: { popup: 'rounded-xl border border-slate-700/60 shadow-lg' }
    });

    if (result.isConfirmed) {
      logout();
    }
  };

  const rolLabels = {
    ADMIN: 'Administrador',
    TECNICO: 'Técnico',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 dark:border-t-blue-500 mb-4"></div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Configuración</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Administra tu cuenta y preferencias</p>
        </div>
      </div>

      {/* Sección 1: Editar Datos Personales */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">Datos Personales</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo: Nombre */}
          <Input
            id="nombre"
            label="Nombre Completo"
            type="text"
            placeholder="Tu nombre completo"
            required
            error={errors.nombre}
            {...register('nombre', {
              required: 'El nombre es obligatorio.',
              minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres.' },
              maxLength: { value: 100, message: 'El nombre no puede exceder 100 caracteres.' },
            })}
          />

          {/* Campo: Email (solo lectura) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={perfil?.email || ''}
              disabled
              className="w-full px-4 py-2.5 text-sm font-medium bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
            />
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
              El correo electrónico no puede modificarse desde aquí.
            </p>
          </div>

          {/* Campo: Rol (solo lectura) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Rol en el Sistema
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <Shield className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {rolLabels[perfil?.rol] || perfil?.rol}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
              El rol solo puede ser modificado por un administrador del sistema.
            </p>
          </div>

          {/* Botón Guardar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isDirty || saving}
              className={`flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                isDirty && !saving
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Sección 2: Cerrar Sesión */}
      <div className="bg-white dark:bg-slate-800 border border-rose-200/50 dark:border-rose-800/30 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
            <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">Sesión</h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          Al cerrar sesión, serás desconectado del sistema y redirigido a la pantalla de inicio de sesión.
          Tus datos y configuraciones se mantendrán intactos para cuando vuelvas a iniciar sesión.
        </p>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 border border-rose-200/50 dark:border-rose-800/30 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default ConfiguracionPage;
