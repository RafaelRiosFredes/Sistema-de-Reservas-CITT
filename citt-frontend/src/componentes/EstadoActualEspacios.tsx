import { CheckCircle2, XCircle } from "lucide-react";

interface Espacio {
  id: number;
  nombre: string;
  estado: string;
}

interface Props {
  espacios: Espacio[];
}

const EstadoActualEspacios = ({ espacios }: Props) => {
  return (
    <div className="w-full">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
        Estado Actual de Espacios
      </h3>
      
      {/* Contenedor con scroll horizontal en caso de que sean muchos laboratorios */}
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {espacios.map((e) => {
          // Un espacio es "libre" si está operativo (no dañado ni en mantención)
          const estadoUpper = e.estado?.toUpperCase() || "";
          const isLibre = estadoUpper !== "DAÑADO" && estadoUpper !== "MANTENCION";

          return (
            <div 
              key={e.id} 
              className={`min-w-[160px] flex-1 bg-white rounded-xl p-5 shadow-sm border flex flex-col items-center justify-center gap-3 border-b-[6px] ${
                isLibre ? 'border-b-green-500 border-gray-100' : 'border-b-red-500 border-gray-100'
              }`}
            >
              {isLibre ? (
                <CheckCircle2 className="text-green-600" size={26} />
              ) : (
                <XCircle className="text-red-500" size={26} />
              )}
              
              <div className="text-center">
                <p className={`font-bold text-lg ${isLibre ? 'text-green-700' : 'text-gray-800'}`}>
                  {e.nombre}
                </p>
                <p className={`text-xs font-bold tracking-wide mt-1 ${
                  isLibre ? 'text-green-600' : 'text-red-500'
                }`}>
                  {isLibre ? 'LIBRE' : estadoUpper === "DAÑADO" ? 'DAÑADO' : 'EN MANTENCIÓN'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EstadoActualEspacios;