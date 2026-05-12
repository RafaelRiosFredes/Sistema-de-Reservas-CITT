import React from "react";

interface TextareaFormProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const TextareaForm: React.FC<TextareaFormProps> = ({ label, ...props }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea className="form-input resize-none" rows={3} {...props} />
    </div>
  );
};

export default TextareaForm;
