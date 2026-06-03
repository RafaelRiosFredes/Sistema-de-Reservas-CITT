import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Shield, KeyRound,
  ChevronRight, Lock, CheckCircle, AlertCircle
} from 'lucide-react';
import InputForm from '../componentes/InputForm';
import api from '../api/axiosConfig';

interface UserData {
  email: string;
  roles: string[];
}

const PerfilPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Obtenemos los datos del perfil directamente desde el Backend
    const fetchPerfil = async () => {
      try {
        const response = await api.get('/auth/perfil');
        setUserData(response.data);
      } catch (error) {
        navigate('/');
      }
    };
    fetchPerfil();
  }, [navigate]);

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordActual || !passwordNueva) {
      setErrorMsg('Por favor completa ambos campos.');
      setTimeout(() => setErrorMsg(''), 4000);
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

      // Desaparece el formulario y limpia el mensaje de éxito a los 2 segundos
          setTimeout(() => {
            setShowChangePassword(false);
            setSuccessMsg('');
          }, 2000);

        } catch (error: any) {
          setErrorMsg(error.response?.data?.mensaje || 'Error al actualizar contraseña.');

          // El mensaje de error desaparecera en 4 segundos
          setTimeout(() => {
            setErrorMsg('');
          }, 4000);

        } finally {
          setIsLoading(false);
        }
      };

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
      <div className="max-w-4xl mx-auto px-6 pb-12">

        {/* ANIMATED HERO CARD */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8 transform hover:-translate-y-1 transition-all duration-300">
          <div className="h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-20 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-2xl -mb-10"></div>
          </div>
          <div className="px-10 pb-10 -mt-16 relative">
            <div className="w-32 h-32 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-5xl font-black border-4 border-white shadow-lg shadow-slate-300 mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              {userData.email.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{userData.email}</h1>
            <div className="mt-5 flex flex-wrap gap-2">
              {userData.roles && userData.roles.length > 0 ? (
                userData.roles.map(rol => (
                  <span key={rol} className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Shield size={12} /> {rol}
                  </span>
                ))
              ) : (
                <span className="px-4 py-1.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  Sin Roles Asignados
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN DE DATOS Y ACCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* INFORMACIÓN DE CUENTA */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-shadow duration-300">
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
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Roles</p>
                    <p className="font-medium text-slate-700 mt-0.5">
                      {userData.roles && userData.roles.length > 0 ? userData.roles.join(', ') : 'Ninguno'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACCIONES Y FORMULARIOS */}
          <div className="md:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-shadow duration-300">
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
                      <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <p>{errorMsg}</p>
                      </div>
                    )}

                    {successMsg && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm flex items-start gap-2">
                        <CheckCircle size={16} className="mt-0.5 shrink-0" />
                        <p>{successMsg}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <InputForm
                        type="password"
                        label="Contraseña Actual"
                        placeholder="Ingresa tu contraseña actual"
                        value={passwordActual}
                        onChange={(e) => setPasswordActual(e.target.value)}
                      />
                      <InputForm
                        type="password"
                        label="Nueva Contraseña"
                        placeholder="Crea una contraseña segura"
                        value={passwordNueva}
                        onChange={(e) => setPasswordNueva(e.target.value)}
                      />
                    </div>

                    <div className="mt-6 flex gap-3">
                      <div className="flex-1">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-blue-700 hover:from-slate-900 hover:to-blue-800 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                              <span>Actualizando...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle size={18} className="text-blue-200" />
                              <span>Guardar Cambios</span>
                            </>
                          )}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowChangePassword(false);
                          setErrorMsg('');
                          setSuccessMsg('');
                          setPasswordActual('');
                          setPasswordNueva('');
                        }}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all duration-200 shadow-sm"
                      >
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
  );
};

export default PerfilPage;