import React from "react";

interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputForm: React.FC<InputFormProps> = ({ label, ...props }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" {...props} />
    </div>
  );
};

export default InputForm;
