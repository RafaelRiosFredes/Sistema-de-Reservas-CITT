import React from "react";
import { User, Calendar, Clock, Package } from "lucide-react";
import BadgeEstado from "./BadgeEstado";

interface ItemSolicitudProps {
  tituloArticulo: string;
  nombreUsuario: string;
  fecha: string;
  hora: string;
  motivo?: string;
  estado:
    | "PENDIENTE"
    | "APROBADA"
    | "EN PROCESO"
    | "RECHAZADA"
    | "FINALIZADA"
    | "DISPONIBLE"
    | "PRESTADO"
    | "DAÑADO"
    | "MANTENCION";
  onVerDetalle: () => void;
}

const ItemSolicitud: React.FC<ItemSolicitudProps> = ({
  tituloArticulo,
  nombreUsuario,
  fecha,
  hora,
  motivo,
  estado,
  onVerDetalle,
}) => {
  // Color del borde izquierdo según el estado
  const bordeColor =
    estado === "PENDIENTE"
      ? "border-l-[#B7791F]"
      : estado === "RECHAZADA"
        ? "border-l-error"
        : "border-l-primary";

  return (
    <div
      className={`bg-white p-6 rounded-xl border border-gray-border border-l-4 ${bordeColor} shadow-sm flex justify-between items-center transition-all hover:-translate-y-0.5 mb-4`}
    >
      <div className="flex items-start gap-6">
        <div className="p-3 bg-primary/10 text-primary rounded-lg mt-1">
          <Package size={24} />
        </div>
        <div>
          <h4 className="font-bold text-lg m-0">{tituloArticulo}</h4>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <User size={14} /> {nombreUsuario}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {fecha}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {hora}
            </span>
          </div>
          {motivo && (
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
              💬 {motivo}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <BadgeEstado estado={estado} />
        <button
          onClick={onVerDetalle}
          className="text-primary text-sm font-bold border-none bg-transparent cursor-pointer hover:underline"
        >
          Ver detalle →
        </button>
      </div>
    </div>
  );
};

export default ItemSolicitud;
