import React from "react";
import { Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FormularioReservaEspacioPage: React.FC = () => {
  const navigate = useNavigate();

  return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-8 border-blue-100/50">
          <Wrench size={40} className="text-blue-500" />
        </div>

        <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
          Formulario en Construcción
        </h2>

        <p className="text-slate-500 text-lg mb-8">
          Esta vista albergará el formulario para ingresar la fecha, hora,
          propósito y confirmar el espacio seleccionado para la solicitud de
          reserva.
        </p>

        <button
          onClick={() => navigate("/reservar-espacio")}
          className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 hover:border-[#003B5C] hover:text-[#003B5C] rounded-xl font-bold transition-all shadow-sm cursor-pointer"
        >
          Volver a los Espacios
        </button>
      </div>
  );
};
