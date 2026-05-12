import React from "react";

export interface BloqueHorario {
  id: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

interface SelectorHorarioProps {
  bloques: BloqueHorario[];
  bloqueSeleccionado: string | null;
  onSeleccionar: (id: string) => void;
}

const SelectorHorario: React.FC<SelectorHorarioProps> = ({
  bloques,
  bloqueSeleccionado,
  onSeleccionar,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {bloques.map((b) => {
        const esSeleccionado = bloqueSeleccionado === b.id;
        return (
          <button
            key={b.id}
            type="button"
            disabled={!b.disponible}
            onClick={() => onSeleccionar(b.id)}
            className={`py-3 px-2 rounded-md font-bold text-sm text-center border transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              esSeleccionado
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-gray-600 border-gray-border hover:border-primary hover:text-primary cursor-pointer"
            }`}
          >
            {b.horaInicio} - {b.horaFin}
          </button>
        );
      })}
    </div>
  );
};

export default SelectorHorario;
