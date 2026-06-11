import React from "react";
import { Monitor, Box, CheckSquare } from "lucide-react"; // Opcional, para inyectar iconos

interface FiltroBotonProps {
  label: string;
  activo: boolean;
  onClick: () => void;
  icono?: React.ReactNode;
}

const FiltroBoton: React.FC<FiltroBotonProps> = ({
  label,
  activo,
  onClick,
  icono,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all cursor-pointer border ${
        activo
          ? "bg-primary text-white border-primary shadow-sm"
          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-dark"
      }`}
    >
      {icono && <span>{icono}</span>}
      {label}
    </button>
  );
};

export default FiltroBoton;
