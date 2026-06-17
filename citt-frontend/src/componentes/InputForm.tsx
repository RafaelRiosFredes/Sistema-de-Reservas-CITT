import React from "react";

interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  mensajeAyuda?: string;
  esError?: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  label,
  mensajeAyuda,
  esError = false,
  className = "",
  ...props
}) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className={`form-input ${esError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""} ${className}`}
        {...props}
      />
      {mensajeAyuda && (
        <span
          className={`block mt-1 text-xs font-medium ${esError ? "text-red-500" : "text-gray-500"}`}
        >
          {mensajeAyuda}
        </span>
      )}
    </div>
  );
};

export default InputForm;
