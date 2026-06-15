import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, ArrowLeft, Settings } from 'lucide-react';
import usuarioService from '../services/usuarioService';

/**
 * Página "Mi Perfil".
 * Muestra los datos del usuario autenticado
 * (nombre, email, rol, estado, fecha de registro).
 */
const PerfilPage = () => {
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        const data = await usuarioService.obtenerPerfil();
        setPerfil(data);
      } catch (err) {
        console.error('Error cargando perfil:', err);
        setError('No se pudo cargar tu perfil. Verifica que tu cuenta esté registrada en el sistema.');
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 dark:border-t-blue-500 mb-4"></div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Cargando tu perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 rounded-xl text-center">
        <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-4">{error}</p>
        <button
          onClick={() => navigate('/ordenes')}
          className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer"
        >
          Volver a Órdenes
        </button>
      </div>
    );
  }

  const rolLabels = {
    ADMIN: 'Administrador',
    TECNICO: 'Técnico',
  };

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
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Mi Perfil</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Información de tu cuenta en el sistema</p>
        </div>
      </div>

      {/* Card principal */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl shadow-sm overflow-hidden">
        {/* Banner + Avatar */}
        <div className="relative h-28 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-md">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Info del usuario */}
        <div className="pt-14 px-6 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{perfil?.nombre}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{perfil?.email}</p>
            </div>
            <button
              onClick={() => navigate('/configuracion')}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800/30 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Editar Perfil
            </button>
          </div>

          {/* Campos detallados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-100 dark:border-slate-700/40">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Nombre</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{perfil?.nombre}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-100 dark:border-slate-700/40">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Correo Electrónico</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{perfil?.email}</p>
              </div>
            </div>

            {/* Rol */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-100 dark:border-slate-700/40">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Rol</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {rolLabels[perfil?.rol] || perfil?.rol}
                </p>
              </div>
            </div>

            {/* Fecha de Registro */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-100 dark:border-slate-700/40">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Miembro Desde</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {perfil?.createdAt
                    ? new Date(perfil.createdAt).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Estado de la cuenta */}
          <div className="mt-5 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full ${
              perfil?.activo
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30'
                : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${perfil?.activo ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              {perfil?.activo ? 'Cuenta Activa' : 'Cuenta Inactiva'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
