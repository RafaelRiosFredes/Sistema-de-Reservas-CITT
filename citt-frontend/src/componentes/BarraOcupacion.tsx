import { CalendarPlus } from "lucide-react";

interface Props {
  porcentaje: number;
  esDisponible: boolean;
  onReservarClick?: () => void;
}

const BarraOcupacion = ({ porcentaje, esDisponible, onReservarClick }: Props) => {
  return (
    <div className="flex flex-col gap-5 mt-auto pt-4 border-t border-gray-50">
      
      {/* Textos y Barra */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="font-bold text-gray-500 text-sm">Ocupación hoy</span>
          <span className="font-bold text-[#003b73] text-sm">{porcentaje}%</span>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${
              esDisponible ? 'bg-green-500' : 'bg-gray-300'
            }`} 
            style={{ width: `${porcentaje}%` }}
          ></div>
        </div>
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
        <CalendarPlus size={20} /> {esDisponible ? "Reservar Espacio" : "No Disponible"}
      </button>

    </div>
  );
};

export default BarraOcupacion;