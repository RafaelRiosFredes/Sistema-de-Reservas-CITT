<<<<<<< HEAD
import React from "react";
import BadgeEstado from "./BadgeEstado";
import Boton from "./Boton";

interface TarjetaRecursoProps {
  titulo: string;
  subtitulo?: string;
  descripcion: React.ReactNode; // Permite inyectar iconos o listas
  estadoFisico: "DISPONIBLE" | "OCUPADO" | "MANTENCION";
  textoBoton: string;
  onAction: () => void;
=======
import React from 'react';
import BadgeEstado from './BadgeEstado'; // Estados que ya hicimos
import BotonCITT from './BotonCITT';     // Estados que ya hicimos

/**

 * USO: Representa un equipo o espacio físico en el catálogo del CITT.
 * INTEGRA: BadgeEstado para la disponibilidad y BotonCITT para la acción.
 */

type EstadoEquipo = 'disponible' | 'ocupado' | 'mantenimiento';

interface TarjetaRecursoProps {
  titulo: string;
  descripcion: string;
  estado: EstadoEquipo;
  onSolicitar?: () => void;
>>>>>>> 828e6c260f77f2e9440140c4e8e15ef8adf22871
}

const TarjetaRecurso: React.FC<TarjetaRecursoProps> = ({
  titulo,
<<<<<<< HEAD
  subtitulo,
  descripcion,
  estadoFisico,
  textoBoton,
  onAction,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-border shadow-sm flex flex-col h-full transition-transform hover:-translate-y-1">
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
=======
  descripcion,
  estado,
  onSolicitar
}) => {
  return (
    <div className="tarjeta-recurso">
      
      {/* CABECERA: Contiene la etiqueta de disponibilidad */}
      <div className="tarjeta-cabecera">
        <BadgeEstado estado={estado} />
      </div>

      {/* CUERPO: Información principal del artículo */}
      <div className="tarjeta-cuerpo">
        <h3 className="tarjeta-titulo">{titulo}</h3>
        <p className="tarjeta-descripcion">
          {descripcion}
        </p>
      </div>

      {/* PIE: Acciones disponibles */}
      <div className="tarjeta-pie">
        <BotonCITT 
          tipo="primario" 
          esBloque={true} 
          onClick={onSolicitar}
        >
          Solicitar Equipo
        </BotonCITT>
>>>>>>> 828e6c260f77f2e9440140c4e8e15ef8adf22871
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default TarjetaRecurso;
=======
export default TarjetaRecurso;
>>>>>>> 828e6c260f77f2e9440140c4e8e15ef8adf22871
