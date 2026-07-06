import { CalendarPlus, CheckCircle } from "lucide-react";

interface Props {
  enUsoAhora: boolean;
  esDisponible: boolean;
  onReservarClick?: () => void;
}

const BarraOcupacion = ({ enUsoAhora, esDisponible, onReservarClick }: Props) => {
  return (
    <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-50">
      
      {/* Indicador de Uso Actual */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
        {enUsoAhora ? (
          <>
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </div>
            <span className="text-sm font-bold text-amber-700">En uso en este momento</span>
          </>
        ) : (
          <>
            <CheckCircle size={16} className="text-emerald-500" />
            <span className="text-sm font-bold text-emerald-700">Desocupado en este momento</span>
          </>
        )}
      </div>

      {/* Botón de Reserva Rápida */}
      <button 
        disabled={!esDisponible}
        onClick={onReservarClick}
        className={`w-full py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors border-none shadow-sm ${
          esDisponible 
            ? "bg-[#0084d6] hover:bg-[#006bb5] text-white cursor-pointer" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        <CalendarPlus size={20} /> {esDisponible ? "Reservar Espacio" : "No Operativo"}
      </button>

    </div>
  );
};

export default BarraOcupacion;