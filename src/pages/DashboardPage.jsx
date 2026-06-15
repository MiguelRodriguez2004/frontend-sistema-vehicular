import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Plus, Users, CheckCircle2, Clock, Loader2,
  Wrench, TrendingUp, AlertCircle, User, Mail, ShieldCheck,
  Car, ArrowRight, LayoutDashboard, RefreshCw, Package
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { usePerfil } from '../context/PerfilContext';
import ordenService from '../services/ordenService';
import adminService from '../services/adminService';

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const formatOrderCode = (id) => {
  if (!id) return 'OT-0000';
  const strId = String(id);
  return /^\d+$/.test(strId) ? `OT-${strId.padStart(4, '0')}` : strId.toUpperCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

/* ─────────────────────────────────────────────
   Mapa de estados → estilo del badge
───────────────────────────────────────────── */
const ESTADO_BADGE = {
  RECIBIDO:    { variant: 'info',    label: 'Recibido' },
  EN_REVISION: { variant: 'warning', label: 'En Revisión' },
  EN_PROCESO:  { variant: 'purple',  label: 'En Proceso' },
  FINALIZADO:  { variant: 'success', label: 'Finalizado' },
  ENTREGADO:   { variant: 'slate',   label: 'Entregado' },
};

/* ─────────────────────────────────────────────
   Tarjeta de Métrica (solo ADMIN)
───────────────────────────────────────────── */
const MetricCard = ({ icon: Icon, label, value, color, loading }) => {
  const colorMap = {
    blue:    'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
    amber:   'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
    purple:  'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30',
    rose:    'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
    slate:   'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  };

  return (
    <Card className="hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
      <CardBody className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          {loading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
        </div>
        <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">
          {loading ? '—' : value}
        </p>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {label}
        </p>
      </CardBody>
    </Card>
  );
};

/* ─────────────────────────────────────────────
   Tarjeta de info del perfil (TECNICO)
───────────────────────────────────────────── */
const ProfileInfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-700/40 last:border-0">
    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 shrink-0">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{value || '—'}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Fila de orden reciente (tabla del ADMIN)
───────────────────────────────────────────── */
const OrdenRow = ({ orden, onClick }) => {
  const estadoInfo = ESTADO_BADGE[orden?.estado] ?? { variant: 'slate', label: orden?.estado };
  return (
    <tr
      onClick={onClick}
      className="border-b border-slate-100 dark:border-slate-700/40 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150 cursor-pointer group"
    >
      <td className="px-4 py-3 text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
        {formatOrderCode(orden?.id)}
      </td>
      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[140px]">
        {orden?.vehiculo?.placa ?? '—'}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[160px]">
        {orden?.vehiculo?.cliente?.nombre ?? '—'}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[140px] hidden sm:table-cell">
        {orden?.tecnico?.nombre ?? '—'}
      </td>
      <td className="px-4 py-3">
        <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>
      </td>
      <td className="px-4 py-3 text-xs text-slate-400 hidden md:table-cell">
        {formatDate(orden?.fechaIngreso || orden?.createdAt)}
      </td>
      <td className="px-4 py-3 text-right">
        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors duration-200 inline-block" />
      </td>
    </tr>
  );
};

/* ─────────────────────────────────────────────
   VISTA ADMIN
───────────────────────────────────────────── */
const DashboardAdmin = ({ perfil }) => {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ords, users] = await Promise.all([
        ordenService.obtenerOrdenes(),
        adminService.listarUsuarios().catch(() => []),
      ]);
      setOrdenes(Array.isArray(ords) ? ords : []);
      setUsuarios(Array.isArray(users) ? users : []);
    } catch (err) {
      console.error('Error cargando datos del dashboard:', err);
      setError('No se pudieron cargar los datos del dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  // Métricas calculadas
  const totalOrdenes = ordenes.length;
  const recibidas    = ordenes.filter(o => o.estado === 'RECIBIDO').length;
  const enProceso    = ordenes.filter(o => ['EN_REVISION', 'EN_PROCESO'].includes(o.estado)).length;
  const finalizadas  = ordenes.filter(o => o.estado === 'FINALIZADO').length;
  const entregadas   = ordenes.filter(o => o.estado === 'ENTREGADO').length;
  const tecnicos     = usuarios.filter(u => u.rol === 'TECNICO' && u.activo !== false).length;
  const ordenesRecientes = [...ordenes].sort((a, b) => new Date(b.createdAt || b.fechaIngreso) - new Date(a.createdAt || a.fechaIngreso)).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white select-none">
              Dashboard
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Bienvenido, <span className="font-bold text-slate-700 dark:text-slate-300">{perfil?.nombre}</span>. Aquí está el resumen del sistema.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={cargarDatos}
            icon={RefreshCw}
            variant="outline"
            className="h-9 text-xs font-bold"
          >
            Actualizar
          </Button>
          <Button
            onClick={() => navigate('/ordenes/nueva')}
            icon={Plus}
            variant="primary"
            className="h-9 text-xs font-bold shadow-sm"
          >
            Nueva Orden
          </Button>
        </div>
      </div>

      {/* Error Global */}
      {error && (
        <Card className="border-rose-200/80 dark:border-rose-900/50">
          <CardBody className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <p className="text-sm text-rose-700 dark:text-rose-400">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard icon={ClipboardList} label="Total Órdenes"  value={totalOrdenes} color="blue"    loading={loading} />
        <MetricCard icon={Package}       label="Recibidas"       value={recibidas}    color="slate"   loading={loading} />
        <MetricCard icon={Wrench}        label="En Proceso"      value={enProceso}    color="purple"  loading={loading} />
        <MetricCard icon={CheckCircle2}  label="Finalizadas"     value={finalizadas}  color="emerald" loading={loading} />
        <MetricCard icon={TrendingUp}    label="Entregadas"      value={entregadas}   color="amber"   loading={loading} />
        <MetricCard icon={Users}         label="Técnicos"        value={tecnicos}     color="blue"    loading={loading} />
      </div>

      {/* Últimas Órdenes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-white">Últimas Órdenes de Trabajo</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Las 6 más recientes del sistema</p>
          </div>
          <Button
            onClick={() => navigate('/ordenes')}
            variant="ghost"
            className="h-8 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          >
            Ver todas
          </Button>
        </CardHeader>

        {loading ? (
          <CardBody className="p-8 flex justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
          </CardBody>
        ) : ordenesRecientes.length === 0 ? (
          <CardBody className="p-10 text-center text-slate-400 dark:text-slate-500">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-semibold">No hay órdenes registradas aún</p>
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/40">
                  {['Código', 'Placa', 'Cliente', 'Técnico', 'Estado', 'Fecha', ''].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${
                        h === 'Técnico' ? 'hidden sm:table-cell' : h === 'Fecha' ? 'hidden md:table-cell' : ''
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordenesRecientes.map((orden) => (
                  <OrdenRow
                    key={orden.id}
                    orden={orden}
                    onClick={() => navigate(`/ordenes/${orden.id}`)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md hover:-translate-y-[2px] hover:border-blue-500/40 dark:hover:border-blue-500/30 transition-all duration-300 group"
          onClick={() => navigate('/ordenes/nueva')}
        >
          <CardBody className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-white">Crear Nueva Orden</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Registrar un nuevo ingreso de vehículo</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors ml-auto shrink-0" />
          </CardBody>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md hover:-translate-y-[2px] hover:border-blue-500/40 dark:hover:border-blue-500/30 transition-all duration-300 group"
          onClick={() => navigate('/admin/usuarios')}
        >
          <CardBody className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 text-purple-600 dark:text-purple-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-white">Administrar Usuarios</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Gestionar técnicos y administradores</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors ml-auto shrink-0" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   VISTA TECNICO
───────────────────────────────────────────── */
const DashboardTecnico = ({ perfil }) => {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarOrdenes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordenService.obtenerOrdenes();
      setOrdenes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando órdenes del técnico:', err);
      setError('No se pudieron cargar tus órdenes asignadas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarOrdenes(); }, []);

  // Filtrar solo las órdenes asignadas al técnico por ID o nombre
  const misOrdenes = ordenes.filter(
    (o) => o?.tecnico?.id === perfil?.id || o?.tecnico?.nombre === perfil?.nombre
  );
  const activas   = misOrdenes.filter(o => !['FINALIZADO', 'ENTREGADO'].includes(o.estado));
  const historial = misOrdenes.filter(o => ['FINALIZADO', 'ENTREGADO'].includes(o.estado));
  const recientes = [...misOrdenes].sort((a, b) => new Date(b.createdAt || b.fechaIngreso) - new Date(a.createdAt || a.fechaIngreso)).slice(0, 5);

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="space-y-6">
      {/* Encabezado de bienvenida */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white select-none">
              Mi Dashboard
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {saludo},{' '}
            <span className="font-bold text-slate-700 dark:text-slate-300">{perfil?.nombre ?? 'Técnico'}</span>.
            {' '}Tienes <span className="font-bold text-blue-600 dark:text-blue-400">{loading ? '...' : activas.length}</span> orden(es) activa(s).
          </p>
        </div>
        <Button
          onClick={cargarOrdenes}
          icon={RefreshCw}
          variant="outline"
          className="h-9 text-xs font-bold w-full sm:w-auto"
        >
          Actualizar
        </Button>
      </div>

      {/* Error */}
      {error && (
        <Card className="border-rose-200/80 dark:border-rose-900/50">
          <CardBody className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <p className="text-sm text-rose-700 dark:text-rose-400">{error}</p>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Info del perfil */}
        <div className="lg:col-span-1 space-y-4">
          {/* Tarjeta de Perfil */}
          <Card>
            <CardBody className="p-5">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-slate-100 dark:border-slate-700/40">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-black uppercase mb-3 select-none">
                  {perfil?.nombre?.charAt(0) ?? '?'}
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white">{perfil?.nombre ?? '—'}</p>
                <Badge variant="info" className="mt-1.5">{perfil?.rol ?? 'TECNICO'}</Badge>
              </div>

              {/* Datos del perfil */}
              <div className="space-y-0">
                <ProfileInfoRow icon={Mail}       label="Correo"   value={perfil?.email} />
                <ProfileInfoRow icon={ShieldCheck} label="Rol"      value={perfil?.rol} />
                <ProfileInfoRow icon={User}        label="Estado"   value={perfil?.activo !== false ? 'Activo' : 'Inactivo'} />
              </div>
            </CardBody>
          </Card>

          {/* Resumen numérico */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {loading ? '—' : activas.length}
                </p>
                <p className="text-[11px] uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400 mt-1">Activas</p>
              </CardBody>
            </Card>
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {loading ? '—' : historial.length}
                </p>
                <p className="text-[11px] uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400 mt-1">Completadas</p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Columna derecha: Mis órdenes recientes */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-800 dark:text-white">Mis Órdenes Asignadas</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Las 5 más recientes asignadas a ti</p>
              </div>
              <Button
                onClick={() => navigate('/ordenes')}
                variant="ghost"
                className="h-8 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                Ver todas
              </Button>
            </CardHeader>

            {loading ? (
              <CardBody className="p-10 flex justify-center">
                <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
              </CardBody>
            ) : recientes.length === 0 ? (
              <CardBody className="p-10 text-center">
                <ClipboardList className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No tienes órdenes asignadas</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Cuando te asignen una orden, aparecerá aquí.</p>
              </CardBody>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {recientes.map((orden) => {
                  const estadoInfo = ESTADO_BADGE[orden?.estado] ?? { variant: 'slate', label: orden?.estado };
                  return (
                    <div
                      key={orden.id}
                      onClick={() => navigate(`/ordenes/${orden.id}`)}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors duration-150 group"
                    >
                      {/* Icono */}
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 shrink-0">
                        <Car className="w-4 h-4" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                            {formatOrderCode(orden.id)}
                          </span>
                          <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {orden?.vehiculo?.marca} {orden?.vehiculo?.modelo}
                          {' · '}
                          <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase">{orden?.vehiculo?.placa}</span>
                        </p>
                      </div>

                      {/* Fecha */}
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(orden?.fechaIngreso || orden?.createdAt)}</p>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL - DashboardPage
───────────────────────────────────────────── */
const DashboardPage = () => {
  const { perfil, isAdmin } = usePerfil();

  if (!perfil) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return isAdmin
    ? <DashboardAdmin perfil={perfil} />
    : <DashboardTecnico perfil={perfil} />;
};

export default DashboardPage;
