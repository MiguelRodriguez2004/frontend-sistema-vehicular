import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, CheckCircle, AlertCircle, Save } from 'lucide-react';
import authService from '../services/authService';

/**
 * Página para Restablecer la Contraseña.
 * Se accede mediante el enlace enviado al correo electrónico (contiene el token).
 */
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Obtenemos el valor de la nueva contraseña para validar que coincidan
  const newPassword = watch('newPassword', '');

  const onSubmit = async (data) => {
    if (!token) {
      setErrorMsg('Enlace inválido o incompleto. Faltan credenciales de seguridad.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      
      await authService.resetPassword(token, data.newPassword);
      
      setSuccessMsg('Contraseña actualizada correctamente. Redirigiendo al inicio de sesión...');
      
      // Redirigir al login después de un momento
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
      
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      const backendError = error.response?.data?.message || error.response?.data?.error || 'No se pudo actualizar la contraseña. Es posible que el enlace haya expirado.';
      setErrorMsg(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 dark:bg-blue-600/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 dark:bg-indigo-600/10 blur-3xl pointer-events-none"></div>

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl rounded-3xl p-8 sm:p-10">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 transform transition hover:scale-105">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent text-center">
              Nueva Contraseña
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 text-center">
              Ingresa y confirma tu nueva contraseña
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/50 rounded-xl animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                {errorMsg}
              </p>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/50 rounded-xl animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {successMsg}
              </p>
            </div>
          )}

          {!token ? (
            <div className="text-center pb-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                No se ha proporcionado un token de seguridad válido. Revisa el enlace enviado a tu correo.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-bold rounded-xl transition-all"
              >
                Volver al Inicio
              </button>
            </div>
          ) : (
            /* Formulario */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Nueva Contraseña */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors ${errors.newPassword ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  </div>
                  <input
                    type="password"
                    {...register('newPassword', {
                      required: 'La nueva contraseña es obligatoria',
                      minLength: {
                        value: 6,
                        message: 'Debe tener al menos 6 caracteres'
                      }
                    })}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border rounded-xl text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.newPassword
                        ? 'border-rose-300/80 dark:border-rose-700/80 focus:ring-rose-500/30'
                        : 'border-slate-200/80 dark:border-slate-700/80 focus:ring-blue-500/30 focus:border-blue-500/50'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.newPassword && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <CheckCircle className={`w-5 h-5 transition-colors ${errors.confirmPassword ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  </div>
                  <input
                    type="password"
                    {...register('confirmPassword', {
                      required: 'Debes confirmar tu contraseña',
                      validate: value => value === newPassword || 'Las contraseñas no coinciden'
                    })}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border rounded-xl text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? 'border-rose-300/80 dark:border-rose-700/80 focus:ring-rose-500/30'
                        : 'border-slate-200/80 dark:border-slate-700/80 focus:ring-blue-500/30 focus:border-blue-500/50'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Botón */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || successMsg}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Actualizando...</span>
                    </>
                  ) : (
                    <>
                      <span>Guardar Contraseña</span>
                      <Save className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
