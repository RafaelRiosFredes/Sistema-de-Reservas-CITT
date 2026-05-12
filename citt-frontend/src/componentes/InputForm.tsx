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
        className={`form-input ${esError ? "border-error focus:border-error focus:ring-error" : ""} ${className}`}
        {...props}
      />
      {mensajeAyuda && (
        <span
          className={`block mt-1 text-sm ${esError ? "text-error" : "text-gray-500"}`}
        >
          {mensajeAyuda}
        </span>
      )}
    </div>
  );
};

export default InputForm;
