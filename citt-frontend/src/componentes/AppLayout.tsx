import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Cpu, Calendar, Package, History, Users, FileText, Settings, LogOut, Bell, PieChart, CalendarCheck, Handshake, Box, UserCog, MonitorSmartphone, ClipboardList, PackageOpen,
} from "lucide-react";
import api from "../api/axiosConfig";
import { useSeguridad } from "../hooks/useSeguridad";

interface AppLayoutProps {
  children?: React.ReactNode;
  titulo?: string;
  breadcrumb?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  titulo = "Gestión de Recursos",
  breadcrumb = "CITT DuocUC",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isVerificando } = useSeguridad();

  const email = localStorage.getItem("userEmail") || "Usuario";
  const rolActivo = localStorage.getItem("activeRole") || "";
  const rolesRaw = localStorage.getItem("userRoles");
  const userRoles = rolesRaw ? JSON.parse(rolesRaw) : [];

  const getRolPrincipal = (roles: string[]) => {
    if (roles.includes("ADMIN")) return "Administrador";
    if (roles.includes("DIRECTOR")) return "Director";
    if (roles.includes("COORDINADOR")) return "Coordinador CITT";
    if (roles.includes("DOCENTE")) return "Docente";
    if (roles.includes("AYUDANTE")) return "Ayudante";
    if (roles.includes("ALUMNO")) return "Alumno";
    return "Usuario";
  };

  const rolPrincipal = rolActivo
    ? getRolPrincipal([rolActivo])
    : getRolPrincipal(userRoles);

  // Evaluadores de acceso basados en rolActivo
  const isAdminArea = ["ADMIN", "DIRECTOR", "COORDINADOR"].includes(rolActivo);
  const isStaff = ["AYUDANTE", "DOCENTE", "COORDINADOR", "DIRECTOR"].includes(
    rolActivo,
  );
  const isAyudante = rolActivo === "AYUDANTE";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignoramos errores de red
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  if (isVerificando) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const menuItems = [
    // COMUNES A TODOS LOS ROLES
    { name: "Dashboard", icon: PieChart, path: "/dashboard" },
    { name: "Calendario", icon: Calendar, path: "/calendario" },
    {
      name: "Solicitar Préstamo",
      icon: PackageOpen,
      path: "/solicitar-prestamo",
    },
    { name: "Solicitudes", icon: ClipboardList, path: "/solicitudes" },
    {
      name: "Reserva Espacios",
      icon: MonitorSmartphone,
      path: "/solicitar-reserva",
    },

    // STAFF (Ayudante + Docente + Coordinador + Director): Historial
    ...(isStaff
      ? [{ name: "Historial", icon: History, path: "/historial-espacios" }]
      : []),

    // ADMIN AREA (Coordinador + Director)
    ...(isAdminArea
      ? [
          { name: "Gestión Reservas", icon: CalendarCheck, path: "/reservas" },
          { name: "Inventario", icon: Box, path: "/articulos" },
          {
            name: "Espacios (Admin)",
            icon: MonitorSmartphone,
            path: "/espacios",
          },
          { name: "Reportes", icon: FileText, path: "/reportes" },
          { name: "Configuración", icon: Settings, path: "/configuracion" },
        ]
      : []),

    // SOLO ADMIN / DIRECTOR
    ...(userRoles.includes("ADMIN") || userRoles.includes("DIRECTOR")
      ? [{ name: "Usuarios", icon: Users, path: "/usuarios" }]
      : []),
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <aside className="w-64 bg-[#1e1e2d] text-gray-300 flex flex-col shadow-xl z-20">
        <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-800">
          <Cpu className="text-blue-500 w-8 h-8" strokeWidth={2.5} />
          <span className="text-xl font-bold text-white tracking-wide">
            CITT <span className="font-normal text-gray-400">DuocUC</span>
          </span>
        </div>

        <div className="p-4 mx-4 mt-6 mb-2 bg-[#27293d] rounded-xl flex items-center gap-3 border border-gray-700">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            {email.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-white truncate">
              {rolPrincipal}
            </span>
            <span className="text-xs text-gray-400 truncate">{email}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3 scroll-styled scroll-dark">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400"
                    : "hover:bg-gray-800 hover:text-white text-gray-400"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-blue-500" : "text-gray-500"}`}
                />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <button
            onClick={() => navigate("/perfil")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              location.pathname.includes("/perfil")
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <UserCog className="w-5 h-5" />
            Mi Perfil
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800 leading-none">
              {titulo}
            </h1>
            <span className="text-xs text-gray-400 mt-1">{breadcrumb}</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <main
          className="flex-1 overflow-x-hidden overflow-y-scroll bg-gray-50 p-8 scroll-styled scroll-light"
          style={{ scrollbarGutter: "stable" }}
        >
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
