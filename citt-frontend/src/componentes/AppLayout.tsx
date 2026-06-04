import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  PieChart, FileEdit, CalendarCheck, Calendar, Package, Handshake,
  Box, History, Users, UserCog, LogOut, Cpu, MonitorSmartphone, ClipboardList
} from "lucide-react";
import api from "../api/axiosConfig";
import { useSeguridad } from "../hooks/useSeguridad";

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isVerificando } = useSeguridad();

  const email = localStorage.getItem("userEmail") || "Usuario";
  const rolesRaw = localStorage.getItem("userRoles");
  const userRoles = rolesRaw ? JSON.parse(rolesRaw) : [];

  // Se extrae específicamente el rol que el usuario clickeó en el Modal del Login
  const rolActivo = localStorage.getItem("rolActivo") || userRoles[0] || "";


  // función para que traduzca el rol específico a un texto
  const getRolDisplay = (rol: string) => {
    if (rol === "ADMIN") return "Administrador";
    if (rol === "DIRECTOR") return "Director";
    if (rol === "COORDINADOR") return "Coordinador CITT";
    if (rol === "DOCENTE") return "Docente";
    if (rol === "AYUDANTE") return "Ayudante";
    if (rol === "ALUMNO") return "Alumno";
    return rol || "Usuario";
  };


  // Se pasa el rolActivo en vez del array de todos los roles
  const rolPrincipal = getRolDisplay(rolActivo);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch { }
    finally { localStorage.clear(); navigate("/"); }
  };

  if (isVerificando) return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div></div>;


  // Ahora las pestañas de Staff solo se abren si el ROL ACTIVO es uno de estos tres.
  // (Si un Director entra pero elige "Alumno" en el modal, esto dará false y no verá los menús)
  const isAdminArea = ["ADMIN", "DIRECTOR", "COORDINADOR"].includes(rolActivo);

  const menuItems = [
    { name: "Dashboard", icon: PieChart, path: "/dashboard" },
    { name: "Calendario", icon: Calendar, path: "/calendario" },
    { name: "Préstamo Artículos", icon: Package, path: "/solicitar-prestamo" },
    { name: "Reserva Espacios", icon: MonitorSmartphone, path: "/solicitar-reserva" },
    { name: "Solicitudes", icon: ClipboardList, path: "/solicitudes" },

    // --- Opciones Administrativas ---
    ...(isAdminArea ? [
      { name: "Inventario", icon: Box, path: "/articulos" },
      { name: "Espacios", icon: MonitorSmartphone, path: "/espacios" },
    ] : []),

    ...(rolActivo !== "ALUMNO" ? [
      { name: "Historial", icon: History, path: "/historial" },
    ] : []),



    // La pestaña de usuarios valida el ROL ACTIVO en vez del array completo
    ...((["ADMIN", "DIRECTOR"].includes(rolActivo)) ? [{ name: "Usuarios", icon: Users, path: "/usuarios" }] : []),
  ];

  return (
    <div className="flex h-screen bg-[#f4f7fe] font-sans overflow-hidden">
      <aside className="w-[260px] bg-[#021626] text-gray-300 flex flex-col shadow-2xl z-20">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="flex items-center gap-2 text-white text-3xl font-bold tracking-wide">
            <Cpu className="text-blue-500 w-9 h-9" /> <span>CITT <span className="font-normal text-blue-300">DuocUC</span></span>
          </div>
          <span className="text-[#ffc107] text-xs font-bold tracking-[0.2em] mt-3">GESTIÓN DE RECURSOS</span>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 px-4 scroll-styled scroll-dark">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button key={item.name} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive ? "bg-[#003b73] text-white font-semibold" : "hover:bg-white/5 text-gray-400 cursor-pointer"}`}>
                <item.icon className="w-5 h-5" /> {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button onClick={() => navigate("/perfil")} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${location.pathname.includes("/perfil") ? "bg-[#003b73] text-white font-semibold" : "text-gray-400 hover:text-white cursor-pointer"}`}><UserCog className="w-5 h-5" /> Mi Perfil</button>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 rounded-xl cursor-pointer"><LogOut className="w-5 h-5" /> Cerrar Sesión</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex justify-end items-center px-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{email}</p>
              <p className="text-[11px] text-gray-500 uppercase tracking-wide">{rolPrincipal}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">{email.charAt(0)}</div>
          </div>
        </header>
        <div
          className="flex-1 overflow-x-hidden overflow-y-scroll p-8 scroll-styled scroll-light"
          style={{ scrollbarGutter: 'stable' }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};