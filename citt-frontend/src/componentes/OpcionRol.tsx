import React from 'react';

/**
 *
 * USO: Permite al usuario elegir su perfil (Alumno, Docente, etc.) en modales.
 * CARACTERÍSTICA: Cambia visualmente al ser seleccionado mediante la prop 'esSeleccionado'.
 */

interface OpcionRolProps {
  nombre: string;              // Ejemplo: "Alumno", "Docente", "Administrador"
  iconoClass: string;          // Clase de FontAwesome
  esSeleccionado: boolean;     // Controla si se aplica la clase 'seleccionado'
  onClick: () => void;         // Función para manejar la selección
}

const OpcionRol: React.FC<OpcionRolProps> = ({ 
  nombre, 
  iconoClass, 
  esSeleccionado, 
  onClick 
}) => {
  return (
    <div 
      className={`opcion-rol ${esSeleccionado ? 'seleccionado' : ''}`} 
      onClick={onClick}
    >
      {/* ICONO: Representación visual del rol */}
      <i className={iconoClass}></i>

      {/* NOMBRE: Título descriptivo del rol */}
      <span className="nombre-rol">{nombre}</span>
    </div>
  );
};

export default OpcionRol;