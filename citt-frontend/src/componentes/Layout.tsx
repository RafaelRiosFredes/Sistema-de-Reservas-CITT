import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Box,
  MonitorSmartphone,
  Printer,
  History,
  Users,
  User,
  LogOut,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  rolActual: string;
  nombreUsuario: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  rolActual,
  nombreUsuario,
}) => {
  return (
    <div className="layout-dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar-main">
        <div className="text-2xl font-black text-primary mb-12">
          CITT<span>RESERVAS</span>
        </div>

        <nav className="flex flex-col gap-2">
          <a href="#" className="nav-link-custom nav-link-active">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="nav-link-custom">
            <Calendar size={20} /> Calendario
          </a>
          <a href="#" className="nav-link-custom">
            <Box size={20} /> Artículos
          </a>
          <a href="#" className="nav-link-custom">
            <MonitorSmartphone size={20} /> Espacios
          </a>
          <a href="#" className="nav-link-custom">
            <History size={20} /> Historial
          </a>
          {/* Si es Admin, mostrar más opciones */}
          {rolActual === "Admin" && (
            <a href="#" className="nav-link-custom">
              <Users size={20} /> Usuarios
            </a>
          )}
          <a href="#" className="nav-link-custom mt-4">
            <User size={20} /> Mi Perfil
          </a>
        </nav>

        <div className="mt-auto border-t border-gray-700 pt-4">
          <div className="text-sm text-gray-400 mb-4 px-3 flex justify-between items-center">
            <span>{rolActual}</span>
            <button className="text-xs bg-gray-800 p-1 rounded hover:text-white cursor-pointer">
              Cambiar
            </button>
          </div>
          <a
            href="#"
            className="nav-link-custom text-error hover:bg-error/10 hover:text-error"
          >
            <LogOut size={20} /> Cerrar Sesión
          </a>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-12 overflow-y-auto w-full bg-gray-light">
        <header className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-full border border-gray-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              {nombreUsuario.charAt(0)}
            </div>
            <span className="font-bold text-sm">{nombreUsuario}</span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;
