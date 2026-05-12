import React from "react";

interface SelectFormProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  opciones: { valor: string; texto: string }[];
}

const SelectForm: React.FC<SelectFormProps> = ({
  label,
  opciones,
  ...props
}) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-input bg-white" {...props}>
        <option value="" disabled>
          Seleccione una opción
        </option>
        {opciones.map((opc) => (
          <option key={opc.valor} value={opc.valor}>
            {opc.texto}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectForm;
