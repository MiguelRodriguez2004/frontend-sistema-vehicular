import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Car, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

/**
 * Página de Inicio de Sesión (Login)
 * Implementa JWT local, integrándose con AuthContext y backend.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Si ya está autenticado, no debería ver el login
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      await login(data.email, data.password);
      // Redireccionar al inicio tras login exitoso
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error en login:', error);
      const backendError = error.response?.data?.message || error.response?.data?.error || 'Credenciales inválidas o error de conexión.';
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
            <img src={logoImg} alt="TrackGarage Logo" className="h-12 object-contain mb-3" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center">
              Sistema de Gestión Vehicular
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Campo: Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 transition-colors ${errors.email ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: 'El correo es obligatorio',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'El formato de correo no es válido'
                    }
                  })}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border rounded-xl text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-rose-300/80 dark:border-rose-700/80 focus:ring-rose-500/30'
                      : 'border-slate-200/80 dark:border-slate-700/80 focus:ring-blue-500/30 focus:border-blue-500/50'
                  }`}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-semibold text-rose-500 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Campo: Contraseña */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors ${errors.password ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
                </div>
                <input
                  type="password"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                  })}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border rounded-xl text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-rose-300/80 dark:border-rose-700/80 focus:ring-rose-500/30'
                      : 'border-slate-200/80 dark:border-slate-700/80 focus:ring-blue-500/30 focus:border-blue-500/50'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-semibold text-rose-500 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Botón de Login */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Iniciando Sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Acceder al Sistema</span>
                    <LogIn className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
