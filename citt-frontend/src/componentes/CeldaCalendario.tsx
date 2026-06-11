import React from "react";

interface EventoCalendario {
  id: string;
  titulo: string;
  tipo: "Clase" | "Bloqueado" | "Reserva Alumno" | "Mi Reserva";
}

interface CeldaCalendarioProps {
  hora: string;
  eventos?: EventoCalendario[];
  esFondoGris?: boolean; // Para los horarios en mantención o pasados
}

const CeldaCalendario: React.FC<CeldaCalendarioProps> = ({
  hora,
  eventos = [],
  esFondoGris = false,
}) => {
  return (
    <div
      className={`min-h-[80px] p-2 border-r border-b border-gray-200 relative ${esFondoGris ? "bg-gray-50" : "bg-white"}`}
    >
      {/* Indicador de eventos */}
      <div className="flex flex-col gap-1 w-full h-full">
        {eventos.map((evento) => {
          // Lógica de colores
          const colorClass =
            evento.tipo === "Clase"
              ? "bg-[#FFF5F5] text-error border-l-4 border-error"
              : evento.tipo === "Reserva Alumno"
                ? "bg-[#EBF8FF] text-primary border-l-4 border-primary"
                : evento.tipo === "Bloqueado"
                  ? "bg-gray-200 text-gray-600 border-l-4 border-gray-400"
                  : "bg-primary/20 text-primary border-l-4 border-primary";

          return (
            <div
              key={evento.id}
              className={`text-[10px] p-1.5 rounded-sm font-bold w-full ${colorClass}`}
            >
              {evento.titulo}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CeldaCalendario;
