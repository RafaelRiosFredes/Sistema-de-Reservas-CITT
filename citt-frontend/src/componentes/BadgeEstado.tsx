<<<<<<< HEAD
import React from "react";

interface BadgeEstadoProps {
  estado:
    | "DISPONIBLE"
    | "OCUPADO"
    | "MANTENCION"
    | "PENDIENTE"
    | "RECHAZADO"
    | "DEVUELTO";
  texto?: string;
}

const BadgeEstado: React.FC<BadgeEstadoProps> = ({ estado, texto }) => {
  const configuracion = {
    DISPONIBLE: { clase: "bg-[#E6FFFA] text-[#319795]", label: "Disponible" },
    OCUPADO: { clase: "bg-[#FFF5F5] text-[#C53030]", label: "En Uso" },
    MANTENCION: { clase: "bg-gray-200 text-gray-700", label: "Mantención" },
    PENDIENTE: { clase: "bg-[#FEFCBF] text-[#B7791F]", label: "Pendiente" },
    RECHAZADO: { clase: "bg-[#FFF5F5] text-[#C53030]", label: "Rechazado" },
    DEVUELTO: { clase: "bg-[#E6FFFA] text-[#319795]", label: "Devuelto" },
  };

  const { clase, label } = configuracion[estado];

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${clase}`}
    >
      {texto || label}
    </span>
  );
};

export default BadgeEstado;
=======
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
>>>>>>> 828e6c260f77f2e9440140c4e8e15ef8adf22871
