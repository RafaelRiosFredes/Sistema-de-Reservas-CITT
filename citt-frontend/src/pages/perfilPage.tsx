import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../componentes/AppLayout';
import {
  Cpu, User, Mail, Shield, LogOut, KeyRound,
  ChevronRight, Lock, CheckCircle, AlertCircle,
  GraduationCap, BookOpen, ClipboardList, Crown, Wrench, Users, RefreshCw
} from 'lucide-react';
import Boton from '../componentes/Boton';
import InputForm from '../componentes/InputForm';
import SessionTimeout from '../componentes/sessionTimeout';
import Modal from '../componentes/Modal';
import OpcionRol from '../componentes/OpcionRol';
import api from '../api/axiosConfig';

interface UserData {
  email: string;
  roles: string[];
}

const getIconoPorRol = (rol: string) => {
  switch (rol) {
    case 'ALUMNO':       return <GraduationCap size={32} />;
    case 'DOCENTE':      return <BookOpen size={32} />;
    case 'COORDINADOR':  return <ClipboardList size={32} />;
    case 'DIRECTOR':     return <Crown size={32} />;
    case 'AYUDANTE':     return <Wrench size={32} />;
    default:             return <Users size={32} />;
  }
};

const PerfilPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Estados Contraseña
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados Rol
  const [showRolModal, setShowRolModal] = useState(false);
  const [rolActivo, setRolActivo] = useState('');
  const [rolSeleccionado, setRolSeleccionado] = useState('');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await api.get('/auth/perfil');
        setUserData(response.data);

        const savedRole = localStorage.getItem('activeRole');
        if (savedRole && response.data.roles.includes(savedRole)) {
          setRolActivo(savedRole);
          setRolSeleccionado(savedRole);
        } else {
          setRolActivo(response.data.roles[0] || '');
          setRolSeleccionado(response.data.roles[0] || '');
        }
      } catch (error) {
        navigate('/');
      }
    };
    fetchPerfil();
  }, [navigate]);

  // Validaciones de fuerza de contraseña en el cliente
  const validaciones = {
    largo: passwordNueva.length >= 8,
    mayuscula: /[A-Z]/.test(passwordNueva),
    numero: /[0-9]/.test(passwordNueva),
  };
  const passwordValida = Object.values(validaciones).every(Boolean);

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordActual || !passwordNueva) {
      setErrorMsg('Por favor completa ambos campos.');
      return;
    }
    if (!passwordValida) {
      setErrorMsg('La nueva contraseña no cumple con los requisitos de seguridad.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await api.put('/auth/cambiar-password', {
        passwordActual,
        nuevaPassword: passwordNueva,
      });
      setSuccessMsg('¡Contraseña actualizada exitosamente!');
      setPasswordActual('');
      setPasswordNueva('');
      setTimeout(() => setShowChangePassword(false), 2000);
    } catch (error: any) {
      let msg = error.response?.data?.mensaje || 'Error al actualizar contraseña.';
      if (msg.includes('Error de validación')) {
        msg = msg.replace(/Error de validación: /g, '').replace(/nuevaPassword: /g, '').replace(/passwordActual: /g, '');
      }
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmarCambioRol = () => {
    localStorage.setItem('activeRole', rolSeleccionado);
    setRolActivo(rolSeleccionado);
    setShowRolModal(false);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('activeRole');
      navigate('/');
    }
  };

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <AppLayout titulo="Mi Perfil" breadcrumb="CITT DuocUC / Perfil">
      <SessionTimeout />

      <Modal
        isOpen={showRolModal}
        onClose={() => setShowRolModal(false)}
        titulo="Cambiar Rol Activo"
        icono={<RefreshCw size={20} />}
      >
        <p className="text-gray-500 text-sm mb-6 text-center">
          Selecciona el rol con el que deseas trabajar en esta sesión.
          Actualmente estás usando: <span className="font-bold text-primary">{rolActivo}</span>
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {userData.roles.map((rol) => (
            <OpcionRol
              key={rol}
              nombreRol={rol}
              icono={getIconoPorRol(rol)}
              seleccionado={rolSeleccionado === rol}
              onClick={() => setRolSeleccionado(rol)}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <Boton variante="primario" bloque onClick={handleConfirmarCambioRol} disabled={rolSeleccionado === rolActivo}>
            Confirmar cambio
          </Boton>
          <button
            onClick={() => { setShowRolModal(false); setRolSeleccionado(rolActivo); }}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </Modal>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* TARJETA DE PERFIL */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden mb-8">
          <div className="relative h-32 bg-gradient-to-br from-slate-800 via-blue-900 to-blue-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-20 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-2xl -mb-10"></div>
          </div>
          <div className="px-10 pb-10 -mt-16 relative flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-slate-800 text-white flex items-center justify-center text-5xl font-black border-4 border-white shadow-md mb-4 relative z-10">
              {userData.email.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{userData.email}</h1>

            {/* Roles del usuario y botón de cambio de rol (Centrados) */}
            <div className="mt-5 flex flex-col items-center gap-4 w-full">
              {/* Contenedor de las etiquetas de los roles */}
              <div className="flex flex-wrap gap-2 items-center justify-center">
                {userData.roles.map(rol => (
                  <span
                    key={rol}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm border ${
                      rol === rolActivo
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}
                  >
                    <Shield size={12} />
                    {rol}
                    {rol === rolActivo && <span className="ml-1 opacity-80">(activo)</span>}
                  </span>
                ))}
              </div>

              {/* Botón para cambiar rol */}
              {userData.roles.length > 1 && (
                <button
                  onClick={() => setShowRolModal(true)}
                  className="px-6 py-2 rounded-full text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw size={16} /> Cambiar Rol Activo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN DE DATOS Y ACCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* INFORMACIÓN DE CUENTA */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><User size={20}/></div>
                Información de Cuenta
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-slate-400"><Mail size={18} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico</p>
                    <p className="font-medium text-slate-700 mt-0.5">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-slate-400"><Shield size={18} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rol Activo</p>
                    <p className="font-medium text-slate-700 mt-0.5">{rolActivo || 'Sin rol asignado'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-slate-400"><Users size={18} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Todos los Roles</p>
                    <p className="font-medium text-slate-700 mt-0.5">
                      {userData.roles.length > 0 ? userData.roles.join(', ') : 'Ninguno'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEGURIDAD */}
          <div className="md:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><KeyRound size={20}/></div>
                Seguridad de la Cuenta
              </h3>

              {!showChangePassword ? (
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full text-left p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-2xl flex items-center justify-between group transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg text-slate-500 group-hover:text-blue-600 shadow-sm transition-colors">
                      <Lock size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">Cambiar Contraseña</p>
                      <p className="text-xs text-slate-500 mt-0.5">Actualiza tu clave de acceso regularmente</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"/>
                </button>
              ) : (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <form onSubmit={handleCambiarPassword} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <Lock size={16} className="text-blue-600"/> Actualizar Contraseña
                    </h4>

                    {errorMsg && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm flex items-start gap-3 shadow-sm">
                        <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-500" />
                        <p className="font-medium text-left leading-relaxed">{errorMsg}</p>
                      </div>
                    )}
                    {successMsg && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-sm flex items-start gap-3 shadow-sm">
                        <CheckCircle size={20} className="shrink-0 mt-0.5 text-green-500" />
                        <p className="font-medium text-left leading-relaxed">{successMsg}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <InputForm type="password" label="Contraseña Actual"
                        placeholder="Ingresa tu contraseña actual"
                        value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} />
                      <InputForm type="password" label="Nueva Contraseña"
                        placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                        value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)} />

                      {/* Indicador visual de requisitos */}
                      {passwordNueva.length > 0 && (
                        <div className="mt-2 space-y-1.5 p-3 bg-slate-100 rounded-xl">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Requisitos:</p>
                          <div className={`flex items-center gap-2 text-xs font-medium ${validaciones.largo ? 'text-green-600' : 'text-slate-400'}`}>
                            {validaciones.largo ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                            Mínimo 8 caracteres
                          </div>
                          <div className={`flex items-center gap-2 text-xs font-medium ${validaciones.mayuscula ? 'text-green-600' : 'text-slate-400'}`}>
                            {validaciones.mayuscula ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                            Al menos 1 letra mayúscula
                          </div>
                          <div className={`flex items-center gap-2 text-xs font-medium ${validaciones.numero ? 'text-green-600' : 'text-slate-400'}`}>
                            {validaciones.numero ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                            Al menos 1 número
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex gap-3">
                      <div className="flex-1">
                        <Boton type="submit" variante="primario" bloque={true} disabled={isLoading}>
                          {isLoading ? 'Actualizando...' : 'Guardar Cambios'}
                        </Boton>
                      </div>
                      <button type="button"
                        onClick={() => { setShowChangePassword(false); setErrorMsg(''); setSuccessMsg(''); setPasswordActual(''); setPasswordNueva(''); }}
                        className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default PerfilPage;