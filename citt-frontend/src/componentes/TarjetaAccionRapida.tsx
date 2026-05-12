import React from "react";

interface TarjetaAccionRapidaProps {
  titulo: string;
  subtitulo: string;
  icono: React.ReactNode;
  onClick: () => void;
}

const TarjetaAccionRapida: React.FC<TarjetaAccionRapidaProps> = ({
  titulo,
  subtitulo,
  icono,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-white p-8 rounded-xl border border-gray-border shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30 w-full"
    >
      <div className="p-4 bg-gray-50 rounded-full text-primary">{icono}</div>
      <div className="text-center">
        <h4 className="font-bold text-lg text-dark m-0">{titulo}</h4>
        <p className="text-sm text-gray-500 mt-1 m-0">{subtitulo}</p>
      </div>
    </button>
  );
};

export default TarjetaAccionRapida;
