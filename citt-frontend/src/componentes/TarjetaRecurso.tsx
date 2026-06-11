import React from "react";
import BadgeEstado from "./BadgeEstado";
import Boton from "./Boton";

interface TarjetaRecursoProps {
  titulo: string;
  subtitulo?: string;
  descripcion: React.ReactNode;
  estadoFisico: "DISPONIBLE" | "MANTENCION" | "DAÑADO" | "PRESTADO" | "PENDIENTE" | "APROBADA" | "EN PROCESO" | "RECHAZADA" | "FINALIZADA" | "OCUPADO";
  textoBoton: string;
  onAction: () => void;
}

const TarjetaRecurso: React.FC<TarjetaRecursoProps> = ({
  titulo,
  subtitulo,
  descripcion,
  estadoFisico,
  textoBoton,
  onAction,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full transition-transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          {subtitulo && (
            <small className="text-gray-400 uppercase tracking-wider">
              {subtitulo}
            </small>
          )}
          <h3 className="m-0 text-xl">{titulo}</h3>
        </div>
        <BadgeEstado estado={estadoFisico} />
      </div>
      <div className="text-gray-600 text-sm flex-grow mb-6">{descripcion}</div>
      <div className="mt-auto">
        <Boton
          bloque
          variante={estadoFisico === "DISPONIBLE" ? "primario" : "secundario"}
          onClick={onAction}
          disabled={estadoFisico !== "DISPONIBLE"}
        >
          {textoBoton}
        </Boton>
      </div>
    </div>
  );
};

export default TarjetaRecurso;
