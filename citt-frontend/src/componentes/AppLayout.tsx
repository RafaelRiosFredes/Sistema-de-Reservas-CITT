import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  PieChart, CalendarCheck, Calendar, Package, Handshake,
  Box, History, Users, UserCog, LogOut, Cpu, MonitorSmartphone
} from "lucide-react";
import api from "../api/axiosConfig";
import { useSeguridad } from "../hooks/useSeguridad";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isVerificando } = useSeguridad();

  const email = localStorage.getItem("userEmail") || "Usuario";
  
  // Extracción segura del rol
  const rolesRaw = localStorage.getItem("userRoles");
  let rolTextoSeguro = "";
  if (rolesRaw) {
    try {
      const rolesArray = JSON.parse(rolesRaw);
      if (rolesArray.length > 0) {
        const primerRol = rolesArray[0];
        rolTextoSeguro = typeof primerRol === "string" ? primerRol : primerRol.nombre || primerRol.authority || "";
      }
    } catch (e) {}
  }
  const rolStorage = localStorage.getItem("rolActivo");
  const rolActivo = String(rolStorage && rolStorage !== "[object Object]" ? rolStorage : rolTextoSeguro).toUpperCase();

  // Determinar perfil administrativo
  const isAdmin = rolActivo.includes("ADMIN") || rolActivo.includes("DIRECTOR") || rolActivo.includes("COORDINADOR");
  
  const getRolDisplay = (rol: string) => {
    if (rol.includes("ADMIN")) return "Administrador";
    if (rol.includes("DIRECTOR")) return "Director";
    if (rol.includes("COORDINADOR")) return "Coordinador CITT";
    if (rol.includes("DOCENTE") || rol.includes("PROFESOR")) return "Docente";
    if (rol.includes("AYUDANTE")) return "Ayudante";
    if (rol.includes("ALUMNO")) return "Alumno";
    return "Usuario";
  };

  // Título dinámico para el menú lateral
  let tituloPortal = "PORTAL ACADÉMICO";
  if (isAdmin) tituloPortal = "GESTIÓN DE RECURSOS";
  else if (rolActivo.includes("DOCENTE") || rolActivo.includes("PROFESOR")) tituloPortal = "PORTAL DOCENTE";
  else if (rolActivo.includes("AYUDANTE")) tituloPortal = "PORTAL AYUDANTE";
  else tituloPortal = "PORTAL ESTUDIANTIL";

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } 
    catch {}
    finally { localStorage.clear(); navigate("/"); }
  };

  if (isVerificando) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f4f7fe]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003b73]"></div>
      </div>
    );
  }

  // MENÚ DINÁMICO
  let menuItems = [];
  if (isAdmin) {
    menuItems = [
      { name: "Dashboard", icon: PieChart, path: "/dashboard" },
      { name: "Calendario", icon: Calendar, path: "/calendario" },
      { name: "Espacios CITT", icon: MonitorSmartphone, path: "/espacios" },
      { name: "Gestión Reservas", icon: CalendarCheck, path: "/reservas" },
      { name: "Inventario", icon: Box, path: "/articulos" },
      { name: "Gestión Préstamos", icon: Handshake, path: "/prestamos" },
      { name: "Historial Préstamos", icon: History, path: "/historial" },
      { name: "Historial Reservas", icon: History, path: "/historial-espacios" },
      ...(rolActivo.includes("ADMIN") || rolActivo.includes("DIRECTOR") ? [{ name: "Usuarios", icon: Users, path: "/usuarios" }] : []),
    ];
  } else {
    // Menú COMPARTIDO para Alumnos, Docentes y Ayudantes
    menuItems = [
      { name: "Inicio", icon: PieChart, path: "/dashboard" },
      { name: "Catálogo Inventario", icon: Package, path: "/solicitar-prestamo" },
      { name: "Mis Préstamos", icon: Handshake, path: "/prestamos" },
      { name: "Espacios CITT", icon: MonitorSmartphone, path: "/espacios" }, 
      { name: "Mis Reservas", icon: CalendarCheck, path: "/reservas" },
    ];
  }

  return (
    <div className="flex h-screen bg-[#f4f7fe] font-sans overflow-hidden">
      <aside className="w-[260px] bg-[#021626] text-gray-300 flex flex-col shadow-2xl z-20">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="flex items-center gap-2 text-white text-3xl font-bold tracking-wide">
            <Cpu className="text-blue-500 w-9 h-9" /> <span>CITT <span className="font-normal text-blue-300">DuocUC</span></span>
          </div>
          <span className="text-[#ffc107] text-xs font-bold tracking-[0.2em] mt-3">
            {tituloPortal}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button key={item.name} onClick={() => navigate(item.path)} 
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all cursor-pointer border-none ${
                  isActive ? "bg-[#003b73] text-white font-semibold shadow-md" : "hover:bg-white/5 text-gray-400 bg-transparent"
                }`}>
                <item.icon className="w-5 h-5" /> {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button onClick={() => navigate("/perfil")} className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white rounded-xl border-none cursor-pointer bg-transparent">
            <UserCog className="w-5 h-5" /> Mi Perfil
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 rounded-xl cursor-pointer border-none bg-transparent">
            <LogOut className="w-5 h-5" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex justify-end items-center px-10 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{email}</p>
              <p className="text-[11px] text-gray-500 uppercase font-semibold">{getRolDisplay(rolActivo)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase border border-blue-200">
              {email.charAt(0)}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
            {children ? children : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
