import React from "react";
import { Search } from "lucide-react";

interface InputBusquedaProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const InputBusqueda: React.FC<InputBusquedaProps> = ({
  placeholder = "Buscar...",
  ...props
}) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg font-lato text-sm transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default InputBusqueda;
