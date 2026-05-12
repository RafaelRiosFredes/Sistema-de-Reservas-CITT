import React from 'react';

/**
 *
 * USO: Representa un día individual en el calendario de reservas del CITT.
 * CARACTERÍSTICA: Posiciona el número del día y permite renderizar eventos o etiquetas dentro.
 */

interface CeldaCalendarioProps {
  dia: number | string;           // El número del día a mostrar
  children?: React.ReactNode;      // Eventos, etiquetas o reservas del día
  esHoy?: boolean;                 // Prop opcional por si quieren resaltar el día actual
}

const CeldaCalendario: React.FC<CeldaCalendarioProps> = ({ dia, children, esHoy = false }) => {
  return (
    <div className={`celda-calendario ${esHoy ? 'dia-actual' : ''}`}>
      {/* NÚMERO: Identificador del día */}
      <span className="numero-dia">{dia}</span>

      {/* CONTENIDO: Espacio para mostrar reservas o eventos */}
      <div className="contenido-dia">
        {children}
      </div>
    </div>
  );
};

export default CeldaCalendario;