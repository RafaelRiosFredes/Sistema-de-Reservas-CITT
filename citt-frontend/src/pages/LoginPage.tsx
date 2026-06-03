import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../componentes/Boton';
import InputForm from '../componentes/InputForm';
import Modal from '../componentes/Modal';
import OpcionRol from '../componentes/OpcionRol';
import { Cpu, ArrowLeft, GraduationCap, BookOpen, ClipboardList, Crown, Wrench, Users } from 'lucide-react';
import api from '../api/axiosConfig';

type ViewMode = 'login' | 'forgot_request' | 'forgot_reset' | 'register' | 'force_change_password';

// Función que asigna un ícono visual a cada rol
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

const LoginPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>('login');

  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados para recuperación de contraseña
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  // Estados para el modal de selección de rol
  const [showRolModal, setShowRolModal] = useState(false);
  const [rolesDisponibles, setRolesDisponibles] = useState<string[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState('');

  const changeView = (newView: ViewMode) => {
    setView(newView);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // El backend guarda el token en una cookie HttpOnly automáticamente
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      // Obtenemos el perfil para conocer los roles del usuario
      const perfilResponse = await api.get('/auth/perfil');
      const roles: string[] = perfilResponse.data.roles;

      if (roles.length > 1) {
        // Si tiene más de un rol, mostramos el modal para que elija con cuál entrar
        setRolesDisponibles(roles);
        setRolSeleccionado(roles[0]);
        setShowRolModal(true);
      } else {
        // Si tiene un solo rol, lo guardamos y entramos directo al perfil
        localStorage.setItem('activeRole', roles[0] || '');
        setSuccessMsg('¡Inicio de sesión exitoso! Redirigiendo...');
        setTimeout(() => navigate('/perfil'), 1500);
      }

    } catch (error: any) {
      console.error('Error de inicio de sesión:', error);

      // INTERCEPTAR LA CLAVE PROVISORIA
      if (error.response?.data?.error === 'ACCESO_DENEGADO') {
        setSuccessMsg('Para tu seguridad, debes crear una nueva contraseña personal.');
        changeView('force_change_password');
        return;
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        setErrorMsg('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else {
        setErrorMsg('Ocurrió un error al intentar conectarse al servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForzarCambioPassword = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Usamos el password que el usuario digitó originalmente en el form de login
      await api.put('/auth/cambiar-password', {
        passwordActual: password,
        nuevaPassword: forgotNewPassword
      });

      // Al cambiarla, el backend ya nos permite pasar, así que pedimos el perfil
      const perfilResponse = await api.get('/auth/perfil');
      const roles: string[] = perfilResponse.data.roles;

      if (roles.length > 1) {
        setRolesDisponibles(roles);
        setRolSeleccionado(roles[0]);
        setShowRolModal(true);
      } else {
        localStorage.setItem('activeRole', roles[0] || '');
        setSuccessMsg('¡Contraseña actualizada! Redirigiendo...');
        setTimeout(() => navigate('/perfil'), 1500);
      }
    } catch (error: any) {
      const msg = error.response?.data?.mensaje || 'Error al actualizar contraseña. Recuerda que debe ser segura.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmar el rol elegido en el modal y entrar al perfil
  const handleConfirmarRol = () => {
    localStorage.setItem('activeRole', rolSeleccionado);
    setShowRolModal(false);
    navigate('/perfil');
  };

  const handleOlvidoPassword = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await api.post('/auth/olvido-password', { email });
      setSuccessMsg('Si el correo está registrado, recibirás un código en breve.');
      setTimeout(() => changeView('forgot_reset'), 2000);
    } catch (error: any) {
      setErrorMsg('Hubo un error al procesar tu solicitud. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestablecerPassword = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await api.post('/auth/restablecer-password', {
        codigoRecuperacion: forgotCode,
        nuevaPassword: forgotNewPassword
      });
      setSuccessMsg('¡Contraseña restablecida exitosamente! Redirigiéndote al inicio de sesión...');
      setForgotCode('');
      setForgotNewPassword('');
      setPassword('');
      setTimeout(() => changeView('login'), 3000);
    } catch (error: any) {
      const msg = error.response?.data?.mensaje || 'Código incorrecto o la contraseña no cumple los requisitos.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoRegistro = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/auto-registro', { email: email.trim().toLowerCase() });
      setSuccessMsg(response.data.mensaje || '¡Cuenta creada! Revisa tu correo institucional para ver tu contraseña provisoria.');
      setEmail('');
      setTimeout(() => changeView('login'), 4000);
    } catch (error: any) {
      const msg = error.response?.data?.mensaje || 'Error al registrar la cuenta. Solo se permiten correos @duocuc.cl o @profesor.duoc.cl';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* MODAL DE SELECCIÓN DE ROL - aparece cuando el usuario tiene más de un rol */}
      <Modal
        isOpen={showRolModal}
        onClose={() => {}} // No se puede cerrar sin elegir un rol
        titulo="¿Con qué rol deseas ingresar?"
        icono={<Users size={22} />}
      >
        <p className="text-gray-500 text-sm mb-6 text-center">
          Tu cuenta tiene múltiples roles. Selecciona con cuál deseas trabajar en esta sesión.
        </p>

        {/* Tarjetas de roles disponibles */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {rolesDisponibles.map((rol) => (
            <OpcionRol
              key={rol}
              nombreRol={rol}
              icono={getIconoPorRol(rol)}
              seleccionado={rolSeleccionado === rol}
              onClick={() => setRolSeleccionado(rol)}
            />
          ))}
        </div>

        <Boton
          variante="primario"
          bloque
          onClick={handleConfirmarRol}
          disabled={!rolSeleccionado}
        >
          Ingresar como {rolSeleccionado}
        </Boton>
      </Modal>

      {/* PANTALLA DE LOGIN */}
      <div className="min-h-screen flex items-center justify-center bg-gray-light p-4">
        <div className="card-booking w-full max-w-[480px] p-10 md:p-12 flex flex-col items-center shadow-auth border-none bg-white">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8 mt-2">
            <Cpu size={40} className="text-primary" strokeWidth={2.5} />
            <span className="text-[2.2rem] font-black tracking-tight text-dark">
              <span className="text-primary">CITT</span> DuocUC
            </span>
          </div>

          {/* Mensajes de error y éxito */}
          {errorMsg && (
            <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-sm text-center font-medium" role="alert">
              <span className="block sm:inline">{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 text-sm text-center font-medium" role="alert">
              <span className="block sm:inline">{successMsg}</span>
            </div>
          )}

          {/* VISTA 1: LOGIN */}
          {view === 'login' && (
            <>
              <h2 className="text-[1.8rem] font-bold text-dark mb-2 text-center">Bienvenido</h2>
              <p className="text-[15px] text-gray-700 mb-10 text-center font-medium">Gestor de Inventario y Reservas</p>

              <form onSubmit={handleLogin} className="w-full">
                <div className="mb-6">
                  <InputForm label="Correo Institucional" type="email" placeholder="ejemplo@duocuc.cl"
                    value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="mb-8">
                  <InputForm label="Contraseña" type="password" placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="mb-6">
                  <Boton type="submit" variante="primario" bloque={true} disabled={isLoading}>
                    {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
                  </Boton>
                </div>
              </form>

              <div className="flex flex-col gap-3 text-center mt-2 mb-2 w-full">
                <button type="button" onClick={() => changeView('forgot_request')}
                  className="text-primary hover:underline text-[15px] font-medium bg-transparent border-none cursor-pointer">
                  ¿Olvidaste tu contraseña?
                </button>
                <div className="text-[14px] text-gray-500 font-medium">
                  ¿No tienes cuenta?{' '}
                  <button type="button" onClick={() => changeView('register')}
                    className="text-primary hover:underline font-bold bg-transparent border-none cursor-pointer">
                    Regístrate aquí
                  </button>
                </div>
              </div>
            </>
          )}

          {/* VISTA DE CAMBIO DE CONTRASEÑA FORZOSO */}
          {view === 'force_change_password' && (
            <>
              <h2 className="text-[1.8rem] font-bold text-dark mb-4 text-center">Cambiar Contraseña</h2>
              <p className="text-[15px] text-gray-700 mb-10 text-center leading-relaxed">
                Por seguridad, debes cambiar tu clave provisoria antes de entrar al sistema por primera vez.
              </p>
              <form onSubmit={handleForzarCambioPassword} className="w-full">
                <div className="mb-8">
                  <InputForm label="Tu Nueva Contraseña Personal" type="password" placeholder="Mínimo 8 caracteres"
                    value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="mb-8">
                  <Boton type="submit" variante="primario" bloque={true} disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar y Entrar'}
                  </Boton>
                </div>
              </form>
            </>
          )}

          {/* VISTA 2: RECUPERAR CONTRASEÑA */}
          {view === 'forgot_request' && (
            <>
              <h2 className="text-[1.8rem] font-bold text-dark mb-4 text-center">Recuperar Contraseña</h2>
              <p className="text-[15px] text-gray-700 mb-10 text-center leading-relaxed">
                Ingresa tu correo institucional para recibir las instrucciones de recuperación.
              </p>
              <form onSubmit={handleOlvidoPassword} className="w-full">
                <div className="mb-8">
                  <InputForm label="Correo Institucional" type="email" placeholder="ejemplo@duocuc.cl"
                    value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="mb-8">
                  <Boton type="submit" variante="primario" bloque={true} disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                  </Boton>
                </div>
              </form>
              <div className="text-center mt-2 mb-2">
                <button type="button" onClick={() => changeView('login')}
                  className="text-primary hover:underline text-[15px] font-medium bg-transparent border-none cursor-pointer flex items-center justify-center gap-2 mx-auto">
                  <ArrowLeft size={18} /> Volver al inicio
                </button>
              </div>
            </>
          )}

          {/* VISTA 3: RESTABLECER CONTRASEÑA */}
          {view === 'forgot_reset' && (
            <>
              <h2 className="text-[1.8rem] font-bold text-dark mb-4 text-center">Restablecer Contraseña</h2>
              <p className="text-[15px] text-gray-700 mb-10 text-center leading-relaxed">
                Hemos enviado un código a tu correo. Ingrésalo abajo junto con tu nueva contraseña.
              </p>
              <form onSubmit={handleRestablecerPassword} className="w-full">
                <div className="mb-6">
                  <InputForm label="Código de Recuperación" type="text" placeholder="Ej: A1B2C3"
                    value={forgotCode} onChange={(e) => setForgotCode(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="mb-8">
                  <InputForm label="Nueva Contraseña" type="password" placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                    value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="mb-8">
                  <Boton type="submit" variante="primario" bloque={true} disabled={isLoading}>
                    {isLoading ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
                  </Boton>
                </div>
              </form>
              <div className="text-center mt-2 mb-2">
                <button type="button" onClick={() => changeView('login')}
                  className="text-primary hover:underline text-[15px] font-medium bg-transparent border-none cursor-pointer flex items-center justify-center gap-2 mx-auto">
                  <ArrowLeft size={18} /> Volver al inicio
                </button>
              </div>
            </>
          )}

          {/* VISTA 4: REGISTRO */}
          {view === 'register' && (
            <>
              <h2 className="text-[1.8rem] font-bold text-dark mb-4 text-center">Crear Cuenta</h2>
              <p className="text-[15px] text-gray-700 mb-10 text-center leading-relaxed">
                Ingresa tu correo institucional. Se detectará tu rol automáticamente (Alumno o Docente) y te enviaremos una clave provisoria.
              </p>
              <form onSubmit={handleAutoRegistro} className="w-full">
                <div className="mb-8">
                  <InputForm label="Correo Institucional" type="email" placeholder="ejemplo@duocuc.cl"
                    value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="mb-8">
                  <Boton type="submit" variante="primario" bloque={true} disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                  </Boton>
                </div>
              </form>
              <div className="text-center mt-2 mb-2">
                <button type="button" onClick={() => changeView('login')}
                  className="text-primary hover:underline text-[15px] font-medium bg-transparent border-none cursor-pointer flex items-center justify-center gap-2 mx-auto">
                  <ArrowLeft size={18} /> Volver al inicio
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default LoginPage;