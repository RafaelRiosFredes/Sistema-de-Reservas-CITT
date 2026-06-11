import React from "react";

interface StatCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icono: React.ReactNode;
  colorBorde?: "primary" | "error" | "success" | "warning";
}

const StatCard: React.FC<StatCardProps> = ({
  titulo,
  valor,
  subtitulo,
  icono,
  colorBorde,
}) => {
  const borderClass = colorBorde
    ? `border-l-4 border-l-${colorBorde}`
    : "border border-gray-200";

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm flex items-center gap-6 ${borderClass}`}
    >
      <div className="p-4 bg-gray-50 rounded-lg text-primary">{icono}</div>
      <div>
        <h3 className="text-3xl font-bold m-0 leading-none">{valor}</h3>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-1">
          {titulo}
        </p>
        {subtitulo && (
          <small className="text-gray-400 block mt-1">{subtitulo}</small>
        )}
      </div>
    </div>
  );
};

export default StatCard;
