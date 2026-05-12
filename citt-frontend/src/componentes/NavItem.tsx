import React from 'react';

/**
 *
 * USO: Elemento de navegación para el Sidebar o Menú Principal del CITT.
 * CARACTERÍSTICA: Cambia visualmente cuando la ruta está activa y soporta iconos de FontAwesome.
 */

interface NavItemCITTProps {
  etiqueta: string;            // Texto a mostrar (ej: "Inventario", "Reservas")
  iconoClass: string;          // Clase de FontAwesome
  esActivo?: boolean;          // Indica si el usuario está en esta página
  onClick?: () => void;        // Función para la navegación
}

const NavItemCITT: React.FC<NavItemCITTProps> = ({ 
  etiqueta, 
  iconoClass, 
  esActivo = false, 
  onClick 
}) => {
  return (
    <a 
      href="#" 
      className={`nav-link ${esActivo ? 'active' : ''}`} 
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
    >
      {/* ICONO: Representación visual de la sección */}
      <i className={iconoClass}></i>

      {/* ETIQUETA: Texto descriptivo en la navegación */}
      <span>{etiqueta}</span>
    </a>
  );
};

export default NavItemCITT;