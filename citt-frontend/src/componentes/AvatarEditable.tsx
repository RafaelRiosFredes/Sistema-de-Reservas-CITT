import React from "react";
import { Camera } from "lucide-react";

interface AvatarEditableProps {
  nombreUsuario: string;
  onEditarFoto?: () => void;
}

const AvatarEditable: React.FC<AvatarEditableProps> = ({
  nombreUsuario,
  onEditarFoto,
}) => {
  const inicial = nombreUsuario ? nombreUsuario.charAt(0).toUpperCase() : "?";

  return (
    <div className="relative inline-block">
      <div className="w-32 h-32 rounded-full bg-[#003B5C] text-white flex items-center justify-center text-5xl font-bold shadow-md">
        {inicial}
      </div>
      {onEditarFoto && (
        <button
          onClick={onEditarFoto}
          className="absolute bottom-0 right-0 p-2 bg-[#FFC107] text-dark rounded-full border-2 border-white hover:scale-105 transition-transform cursor-pointer shadow-sm"
          title="Cambiar foto de perfil"
        >
          <Camera size={18} />
        </button>
      )}
    </div>
  );
};

export default AvatarEditable;
