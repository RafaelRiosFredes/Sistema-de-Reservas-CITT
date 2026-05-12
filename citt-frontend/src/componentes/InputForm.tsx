<<<<<<< HEAD
import React from "react";

interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputForm: React.FC<InputFormProps> = ({ label, ...props }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" {...props} />
=======
import React from 'react';

/**
 *
 * USO: Grupo de formulario estandarizado para capturar datos del usuario.
 * CARACTERÍSTICA: Incluye etiqueta superior, campo de entrada tipado y mensajes de ayuda/error.
 */

interface InputCITTProps {
  label: string;               // Texto de la etiqueta encima del input
  type?: string;               // email, text, password, etc.
  placeholder?: string;        // Texto de sugerencia
  value?: string;              // Valor del campo (para control de React)
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Función para capturar cambios
  mensajeAyuda?: string;       // Texto opcional debajo del input
  esError?: boolean;           // Si es true, el mensaje puede cambiar de estilo
}

const InputCITT: React.FC<InputCITTProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  mensajeAyuda,
  esError = false
}) => {
  return (
    <div className="grupo-formulario">
      {/* ETIQUETA: Indica qué debe ingresar el usuario */}
      <label className="etiqueta-formulario">{label}</label>

      {/* CAMPO DE ENTRADA: Con validación de tipo y placeholder */}
      <input
        type={type}
        className={`entrada-formulario ${esError ? 'entrada-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {/* OPCIONAL: Texto de ayuda o error debajo del campo */}
      {mensajeAyuda && (
        <span className={`ayuda-formulario ${esError ? 'texto-error' : ''}`}>
          {mensajeAyuda}
        </span>
      )}
>>>>>>> 828e6c260f77f2e9440140c4e8e15ef8adf22871
    </div>
  );
};

<<<<<<< HEAD
export default InputForm;
=======
export default InputCITT;
>>>>>>> 828e6c260f77f2e9440140c4e8e15ef8adf22871
