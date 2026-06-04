import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Cpu,
  LayoutDashboard,
  Calendar,
  Package,
  History,
  Users,
  FileText,
  Settings,
  LogOut,
  Search,
  Bell,
} from "lucide-react";
import api from "../api/axiosConfig";

interface AppLayoutProps {
  children: React.ReactNode;
  titulo: string;
  breadcrumb: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  titulo,
  breadcrumb,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para controlar la verificación de la sesión
  const [isVerificando, setIsVerificando] = useState(true);

  // Verificamos la sesión al montar el componente y cada 6 minutos para mantenerla activa
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        await api.get("/auth/perfil");
        setIsVerificando(false); // Si la sesión es válida, dejamos de mostrar la pantalla de carga
      } catch (error) {
        localStorage.clear();
        navigate("/"); // Redirigimos a la página de inicio si no hay sesión válida
      }
    };
    verificarSesion();

    const intervaloLatido = setInterval(() => {
      api.get("/auth/perfil").catch(() => {});
    }, 6000); // Latido cada 6 minutos para mantener la sesión activa

    return () => clearInterval(intervaloLatido); // Limpiar el intervalo al desmontar el componente
  }, [navigate]);

  const email = localStorage.getItem("userEmail") || "Usuario";
  const rolesRaw = localStorage.getItem("userRoles");
  const userRoles = rolesRaw ? JSON.parse(rolesRaw) : [];
  const rolPrincipal = userRoles.includes("DIRECTOR")
    ? "Director"
    : "Coordinador CITT";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Si el logout falla, igual limpiamos la sesión local y redirigimos
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  const menuItems = [
    { name: "Inicio", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Reservas", icon: Calendar, path: "/admin/reservas" },
    { name: "Préstamos", icon: Package, path: "/admin/prestamos" },
    { name: "Inventario", icon: Package, path: "/admin/articulos" },
    { name: "Historial", icon: History, path: "/admin/historial" },
    { name: "Usuarios", icon: Users, path: "/admin/usuarios" },
    { name: "Reportes", icon: FileText, path: "/admin/reportes" },
    { name: "Configuración", icon: Settings, path: "/admin/configuracion" },
  ];

  // Pantalla de carga mientras se verifica la sesión
  if (isVerificando) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* SIDEBAR LADO IZQUIERDO */}
      <aside className="w-64 bg-[#1e1e2d] text-gray-300 flex flex-col shadow-xl z-20">
        {/* Logo */}
        <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-800">
          <Cpu className="text-blue-500 w-8 h-8" strokeWidth={2.5} />
          <span className="text-xl font-bold text-white tracking-wide">
            CITT <span className="font-normal text-gray-400">DuocUC</span>
          </span>
        </div>

        {/* Información del Usuario */}
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

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
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

        {/* Botón Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL (DERECHA) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800 leading-none">
              {titulo}
            </h1>
            <span className="text-xs text-gray-400 mt-1">{breadcrumb}</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Buscador */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
              />
            </div>
            {/* Notificaciones */}
            <button className="relative text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
