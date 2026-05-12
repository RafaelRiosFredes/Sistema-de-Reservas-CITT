<<<<<<< HEAD
import React from "react";

interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "secundario";
  bloque?: boolean;
}

const Boton: React.FC<BotonProps> = ({
  children,
  variante = "primario",
  bloque = false,
  ...props
}) => {
  const claseVariante =
    variante === "primario" ? "btn-primary" : "btn-secondary";
  const claseBloque = bloque ? "btn-block" : "";

  return (
    <button className={`btn ${claseVariante} ${claseBloque}`} {...props}>
=======
import React from 'react';

/**
 *
 * USO: Botones estandarizados para acciones del sistema CITT / Duoc UC.
 * SOPORTA: Variantes primarias, secundarias y modo bloque (100% ancho).
 */

interface BotonCITTProps {
  children: React.ReactNode;           // El texto o icono del botón
  tipo?: 'primario' | 'secundario';     // Estilo de color
  esBloque?: boolean;                   // Si ocupa el 100% del ancho
  onClick?: () => void;                // Función al hacer click
  type?: 'button' | 'submit' | 'reset'; // Tipo de botón
}

const BotonCITT: React.FC<BotonCITTProps> = ({ 
  children, 
  tipo = 'primario', 
  esBloque = false, 
  onClick,
  type = 'button'
}) => {
  
  // Construcción dinámica de clases según el diseño original
  const claseTipo = tipo === 'primario' ? 'boton-primario' : 'boton-secundario';
  const claseBloque = esBloque ? 'boton-bloque' : '';

  return (
    <button 
      type={type}
      className={`boton ${claseTipo} ${claseBloque}`}
      onClick={onClick}
    >
>>>>>>> 828e6c260f77f2e9440140c4e8e15ef8adf22871
      {children}
    </button>
  );
};

<<<<<<< HEAD
export default Boton;
=======
export default BotonCITT;
>>>>>>> 828e6c260f77f2e9440140c4e8e15ef8adf22871
