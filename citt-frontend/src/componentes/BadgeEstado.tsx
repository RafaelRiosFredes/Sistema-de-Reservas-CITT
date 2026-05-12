import React from "react";

interface BadgeEstadoProps {
  estado:
    | "DISPONIBLE"
    | "OCUPADO"
    | "MANTENCION"
    | "PENDIENTE"
    | "RECHAZADO"
    | "DEVUELTO";
  texto?: string;
}

const BadgeEstado: React.FC<BadgeEstadoProps> = ({ estado, texto }) => {
  const configuracion = {
    DISPONIBLE: { clase: "bg-[#E6FFFA] text-[#319795]", label: "Disponible" },
    OCUPADO: { clase: "bg-[#FFF5F5] text-[#C53030]", label: "En Uso" },
    MANTENCION: { clase: "bg-gray-200 text-gray-700", label: "Mantención" },
    PENDIENTE: { clase: "bg-[#FEFCBF] text-[#B7791F]", label: "Pendiente" },
    RECHAZADO: { clase: "bg-[#FFF5F5] text-[#C53030]", label: "Rechazado" },
    DEVUELTO: { clase: "bg-[#E6FFFA] text-[#319795]", label: "Devuelto" },
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
