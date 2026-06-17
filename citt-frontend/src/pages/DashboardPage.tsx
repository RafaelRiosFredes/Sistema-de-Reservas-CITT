import React from "react";
import { AdminDashboard } from "../componentes/dashboard/AdminDashboard";
import { StaffDashboard } from "../componentes/dashboard/StaffDashboard";
import { AlumnoDashboard } from "../componentes/dashboard/AlumnoDashboard";

export const DashboardPage: React.FC = () => {
  const rolActivo = localStorage.getItem("activeRole") || "";
  const rolesRaw = localStorage.getItem("userRoles");
  const userRoles = rolesRaw ? JSON.parse(rolesRaw) : [];

  // Si no hay rol activo por alguna razón, usamos el primer rol de la lista
  const rol = rolActivo || (userRoles.length > 0 ? userRoles[0] : "");

  // Evaluar qué dashboard mostrar
  if (rol === "ADMIN" || rol === "DIRECTOR" || rol === "COORDINADOR") {
    return <AdminDashboard />;
  }

  if (rol === "DOCENTE" || rol === "AYUDANTE") {
    return <StaffDashboard />;
  }

  if (rol === "ALUMNO") {
    return <AlumnoDashboard />;
  }

  // Fallback si no tiene rol o el rol no coincide
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
      <h2 className="text-2xl font-bold">Bienvenido al Sistema</h2>
      <p>No se pudo determinar tu rol o no tienes permisos asignados.</p>
    </div>
  );
};
