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
}

const TarjetaRecurso: React.FC<TarjetaRecursoProps> = ({
  titulo,
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
      </div>
    </div>
  );
};

export default TarjetaRecurso;