import React from "react";

interface BadgeEstadoProps {
  estado:
    | "DISPONIBLE"
    | "PRESTADO"
    | "DAÑADO"
    | "MANTENCION" // Estados de Artículo (Backend)
    | "PENDIENTE"
    | "APROBADA"
    | "EN PROCESO"
    | "RECHAZADA"
    | "FINALIZADA"; // Estados de Solicitud (Backend)
  texto?: string;
}
const BadgeEstado: React.FC<BadgeEstadoProps> = ({ estado, texto }) => {
  const configuracion = {
    // Artículos
    DISPONIBLE: { clase: "bg-[#E6FFFA] text-[#319795]", label: "Disponible" },
    PRESTADO: { clase: "bg-[#FFF5F5] text-[#C53030]", label: "Prestado" },
    DAÑADO: { clase: "bg-[#FFF5F5] text-[#C53030]", label: "Dañado" },
    MANTENCION: { clase: "bg-gray-200 text-gray-700", label: "Mantención" },

    // Solicitudes
    PENDIENTE: { clase: "bg-[#FEFCBF] text-[#B7791F]", label: "Pendiente" },
    APROBADA: { clase: "bg-[#EBF8FF] text-[#2B6CB0]", label: "Aprobada" },
    "EN PROCESO": {
      clase: "bg-purple-100 text-purple-700",
      label: "En Proceso",
    },
    RECHAZADA: { clase: "bg-[#FFF5F5] text-[#C53030]", label: "Rechazada" },
    FINALIZADA: { clase: "bg-[#E6FFFA] text-[#319795]", label: "Finalizada" },
  };

  const { clase, label } = configuracion[estado];

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${clase}`}
    >
      {texto || label}
    </span>
  );
};

export default BadgeEstado;
