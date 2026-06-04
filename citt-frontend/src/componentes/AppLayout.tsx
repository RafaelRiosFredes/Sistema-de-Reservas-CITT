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
import { useSeguridad } from "../hooks/useSeguridad";

interface AdminLayoutProps {
  children: React.ReactNode;
  titulo: string;
  breadcrumb: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  titulo,
  breadcrumb,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para bloquear la vista mientras se valida la cookie
  const { isVerificando } = useSeguridad(["DIRECTOR", "COORDINADOR"]);

  const email = localStorage.getItem("userEmail") || "Usuario";
  const rolesRaw = localStorage.getItem("userRoles");
  const userRoles = rolesRaw ? JSON.parse(rolesRaw) : [];
  const rolPrincipal = userRoles.includes("DIRECTOR")
    ? "Director"
    : userRoles.includes("COORDINADOR")
      ? "Coordinador CITT"
      : "Usuario";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignoramos errores de red en el logout para forzar la salida local
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  // Mientras se verifica la cookie, mostramos una pantalla de carga para evitar parpadeos o acceso no autorizado.
  if (isVerificando) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
        {/* HEADER TOP BAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800 leading-none">
              {titulo}
            </h1>
            <span className="text-xs text-gray-400 mt-1">{breadcrumb}</span>
          </div>

          <div className="flex items-center gap-6">
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
