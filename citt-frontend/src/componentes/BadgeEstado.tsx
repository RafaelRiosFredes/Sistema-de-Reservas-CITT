import React from 'react';

/**
*
* USO: Se utiliza en las tarjetas de inventario y listas del CITT
*      para indicar visualmente la disponibilidad de los equipos.
*/

type EstadoEquipo = 'disponible' | 'ocupado' | 'mantenimiento';

interface BadgeEstadoProps {
estado: EstadoEquipo;
}

const BadgeEstado: React.FC<BadgeEstadoProps> = ({ estado }) => {


  const configuracion = {
  disponible: {
  clase: 'estado-disponible',
  texto: 'Disponible'
  },
  ocupado: {
  clase: 'estado-ocupado',
  texto: 'En Uso'
  },
  mantenimiento: {
  clase: 'estado-mantenimiento',
  texto: 'Mantenimiento'
  }
  };

  const { clase, texto } = configuracion[estado];

  return (
  <span className={`etiqueta-estado ${clase}`}>
      {texto}
    </span>
  );
  };

  export default BadgeEstado;