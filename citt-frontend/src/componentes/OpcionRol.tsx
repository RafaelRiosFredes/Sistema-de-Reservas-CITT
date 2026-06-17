import React from "react";

interface OpcionRolProps {
  nombreRol: string;
  icono: React.ReactNode;
  seleccionado: boolean;
  onClick: () => void;
}

const OpcionRol: React.FC<OpcionRolProps> = ({
  nombreRol,
  icono,
  seleccionado,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 border-2 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
        seleccionado
          ? "border-primary bg-primary/5 text-primary"
          : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"
      }`}
    >
      <div className={`${seleccionado ? "text-primary" : "text-gray-400"}`}>
        {icono}
      </div>
      <span className="font-bold text-lg">{nombreRol}</span>
    </div>
  );
};

export default OpcionRol;
