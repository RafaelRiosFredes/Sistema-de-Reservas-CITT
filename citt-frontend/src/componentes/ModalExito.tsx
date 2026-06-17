import React from "react";
import { Check } from "lucide-react";

interface ModalExitoProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  mensaje: string;
  textoBoton?: string;
}

const ModalExito: React.FC<ModalExitoProps> = ({
  isOpen,
  onClose,
  titulo,
  mensaje,
  textoBoton = "Aceptar",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 p-8 text-center">
        {/* Círculo verde de éxito */}
        <div className="mx-auto w-16 h-16 bg-[#28A745] text-white rounded-full flex items-center justify-center mb-6 shadow-md">
          <Check size={32} strokeWidth={3} />
        </div>

        {/* Textos */}
        <h2 className="text-2xl font-bold text-dark m-0 mb-3">{titulo}</h2>
        <p className="text-gray-500 text-sm mb-8 m-0">{mensaje}</p>

        {/* Botón */}
        <button
          onClick={onClose}
          className="w-full bg-[#002B49] text-white font-bold py-3 rounded-md transition-transform hover:-translate-y-0.5 active:scale-95 cursor-pointer border-none"
        >
          {textoBoton}
        </button>
      </div>
    </div>
  );
};

export default ModalExito;
