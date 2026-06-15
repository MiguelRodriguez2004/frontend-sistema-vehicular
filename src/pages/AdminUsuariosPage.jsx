import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Users, Plus, Search, Edit3, Power, ArrowLeft,
  Shield, Save, Loader2, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import adminService from '../services/adminService';
import { usePerfil } from '../context/PerfilContext';
import Input from '../components/ui/Input';

/**
 * Página de Administración de Usuarios.
 * Solo accesible por usuarios con rol ADMIN.
 * Permite listar, buscar, crear, editar y activar/desactivar usuarios.
 */
const AdminUsuariosPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = usePerfil();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('TODOS');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('crear'); // 'crear' | 'editar'
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Redirigir si no es admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/ordenes', { replace: true });
    }
  }, [isAdmin, navigate]);

  // Cargar usuarios al montar
  const cargarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.listarUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'No se pudieron cargar los usuarios.',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        background: '#1e293b',
        color: '#f8fafc',
        iconColor: '#ef4444',
        customClass: { popup: 'rounded-xl border border-slate-700/60 shadow-lg' }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      cargarUsuarios();
    }
  }, [isAdmin, cargarUsuarios]);

  // Filtrar usuarios por búsqueda y rol
  const usuariosFiltrados = usuarios.filter((u) => {
    const matchSearch =
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRol = filterRol === 'TODOS' || u.rol === filterRol;
    return matchSearch && matchRol;
  });

  // Abrir modal de crear
  const abrirModalCrear = () => {
    setModalMode('crear');
    setEditingUser(null);
    reset({ nombre: '', email: '', rol: 'TECNICO' });
    setModalOpen(true);
  };

  // Abrir modal de editar
  const abrirModalEditar = (usuario) => {
    setModalMode('editar');
    setEditingUser(usuario);
    reset({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
    setModalOpen(true);
  };

  // Guardar (crear o editar)
  const onSubmit = async (data) => {
    try {
      setSaving(true);

      if (modalMode === 'crear') {
        const result = await adminService.crearUsuario(data);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: '¡Usuario creado con éxito!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#1e293b',
          color: '#f8fafc',
          iconColor: '#3b82f6',
          customClass: { popup: 'rounded-xl border border-slate-700/60 shadow-lg' }
        });
      } else {
        await adminService.actualizarUsuario(editingUser.id, data);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: '¡Usuario actualizado correctamente!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#1e293b',
          color: '#f8fafc',
          iconColor: '#3b82f6',
          customClass: { popup: 'rounded-xl border border-slate-700/60 shadow-lg' }
        });
      }

      setModalOpen(false);
      cargarUsuarios();
    } catch (err) {
      console.error('Error guardando usuario:', err);
      const msg = err.response?.data?.message || 'Error procesando la solicitud.';
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: msg,
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

  // Activar/Desactivar usuario
  const toggleEstado = async (usuario) => {
    const accion = usuario.activo ? 'desactivar' : 'activar';

    const result = await Swal.fire({
      title: `¿${usuario.activo ? 'Desactivar' : 'Activar'} usuario?`,
      html: `<p class="text-sm">Se ${accion}á la cuenta de <strong>${usuario.nombre}</strong> (${usuario.email}).</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: usuario.activo ? '#e11d48' : '#059669',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: '#f8fafc',
      customClass: { popup: 'rounded-xl border border-slate-700/60 shadow-lg' }
    });

    if (result.isConfirmed) {
      try {
        await adminService.cambiarEstado(usuario.id, !usuario.activo);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Usuario ${!usuario.activo ? 'activado' : 'desactivado'} con éxito`,
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          background: '#1e293b',
          color: '#f8fafc',
          iconColor: '#3b82f6',
          customClass: { popup: 'rounded-xl border border-slate-700/60 shadow-lg' }
        });
        cargarUsuarios();
      } catch (err) {
        console.error('Error cambiando estado:', err);
        const msg = err.response?.data?.message || 'No se pudo cambiar el estado.';
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: msg,
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          background: '#1e293b',
          color: '#f8fafc',
          iconColor: '#ef4444',
          customClass: { popup: 'rounded-xl border border-slate-700/60 shadow-lg' }
        });
      }
    }
  };

  const rolBadge = (rol) => {
    const styles = {
      ADMIN: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/30',
      TECNICO: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/30',
    };
    const labels = { ADMIN: 'Admin', TECNICO: 'Técnico' };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${styles[rol] || ''}`}>
        <Shield className="w-3 h-3" />
        {labels[rol] || rol}
      </span>
    );
  };

  const estadoBadge = (activo) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
      activo
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30'
        : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/30'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${activo ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  );

  if (!isAdmin) return null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Administración de Usuarios</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gestiona las cuentas del sistema ({usuarios.length} usuarios)
            </p>
          </div>
        </div>
        <button
          onClick={abrirModalCrear}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
          />
        </div>
        <select
          value={filterRol}
          onChange={(e) => setFilterRol(e.target.value)}
          className="px-4 py-2.5 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
        >
          <option value="TODOS">Todos los Roles</option>
          <option value="ADMIN">Administradores</option>
          <option value="TECNICO">Técnicos</option>
        </select>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 dark:border-t-blue-500 mb-3"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Cargando usuarios...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No se encontraron usuarios</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Intenta con otros filtros de búsqueda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Usuario</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rol</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registro</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{usuario.nombre}</p>
                          <p className="text-xs text-slate-400">{usuario.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">{rolBadge(usuario.rol)}</td>
                    <td className="px-5 py-3.5">{estadoBadge(usuario.activo)}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(usuario.createdAt).toLocaleDateString('es-CO', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => abrirModalEditar(usuario)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                          title="Editar usuario"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleEstado(usuario)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            usuario.activo
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                          }`}
                          title={usuario.activo ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => !saving && setModalOpen(false)}
          ></div>

          {/* Contenido del modal */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl shadow-xl p-6 z-10">
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${modalMode === 'crear' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                  {modalMode === 'crear'
                    ? <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    : <Edit3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  }
                </div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">
                  {modalMode === 'crear' ? 'Nuevo Usuario' : 'Editar Usuario'}
                </h2>
              </div>
              <button
                onClick={() => !saving && setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Nombre */}
              <Input
                label="Nombre Completo"
                placeholder="Nombre completo del usuario"
                required
                error={errors.nombre}
                {...register('nombre', {
                  required: 'El nombre es obligatorio.',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres.' },
                })}
              />

              {/* Email */}
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="correo@ejemplo.com"
                required={modalMode === 'crear'}
                error={modalMode === 'crear' ? errors.email : undefined}
                readOnly={modalMode === 'editar'}
                className={modalMode === 'editar' ? 'cursor-not-allowed' : ''}
                {...register('email', {
                  required: modalMode === 'crear' ? 'El correo es obligatorio.' : false,
                  pattern: modalMode === 'crear'
                    ? { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido.' }
                    : undefined,
                })}
              />
              {modalMode === 'editar' && (
                <p className="-mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                  El correo no puede modificarse desde aquí.
                </p>
              )}

              {/* Contraseña (solo crear) */}
              {modalMode === 'crear' && (
                <Input
                  label="Contraseña Provisional"
                  type="password"
                  placeholder="Contraseña del usuario"
                  required
                  error={errors.password}
                  {...register('password', {
                    required: 'La contraseña es obligatoria.',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
                  })}
                />
              )}

              {/* Rol */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Rol en el Sistema <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('rol', { required: 'El rol es obligatorio.' })}
                  className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer ${
                    errors.rol 
                      ? 'border-rose-500 focus:ring-rose-500/30 focus:border-rose-500' 
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500/30 focus:border-blue-500'
                  }`}
                >
                  <option value="TECNICO">Técnico</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                {errors.rol && (
                  <span className="text-xs font-medium text-rose-500">
                    {errors.rol.message}
                  </span>
                )}
              </div>

              {/* Botones del modal */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !saving && setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      {modalMode === 'crear' ? 'Crear Usuario' : 'Guardar Cambios'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuariosPage;
