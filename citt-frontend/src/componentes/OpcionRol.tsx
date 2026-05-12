<<<<<<< HEAD
import React from "react";

interface OpcionRolProps {
  nombreRol: string;
  icono: React.ReactNode;
  seleccionado: boolean;
  onClick: () => void;
}

const OpcionRol: React.FC<OpcionRolProps> = ({
  nombreRol,
  icono,
  seleccionado,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 border-2 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
        seleccionado
          ? "border-primary bg-primary/5 text-primary"
          : "border-gray-border bg-white text-gray-500 hover:border-gray-400"
      }`}
    >
      <div className={`${seleccionado ? "text-primary" : "text-gray-400"}`}>
        {icono}
      </div>
      <span className="font-bold text-lg">{nombreRol}</span>
=======
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
>>>>>>> 828e6c260f77f2e9440140c4e8e15ef8adf22871
    </div>
  );
};

<<<<<<< HEAD
export default OpcionRol;
=======
export default OpcionRol;
>>>>>>> 828e6c260f77f2e9440140c4e8e15ef8adf22871
