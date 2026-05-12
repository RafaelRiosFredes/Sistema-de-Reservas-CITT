import React from "react";

interface ItemAlertaProps {
  titulo: string;
  subtitulo: string;
  detalleDerecha: string;
  estadoCritico?: boolean; // True para rojo, False para el color primario (azul/morado)
}

const ItemAlerta: React.FC<ItemAlertaProps> = ({
  titulo,
  subtitulo,
  detalleDerecha,
  estadoCritico = false,
}) => {
  const colorPunto = estadoCritico ? "bg-error" : "bg-primary";
  const colorTextoDerecha = estadoCritico
    ? "text-error font-bold"
    : "text-gray-500";

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-border last:border-0 hover:bg-gray-50 transition-colors px-2 rounded-md">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${colorPunto}`}></div>
        <span className="font-bold text-dark text-sm">{titulo}</span>
      </div>
      <span className="text-sm text-gray-500">{subtitulo}</span>
      <span className={`text-sm ${colorTextoDerecha}`}>{detalleDerecha}</span>
    </div>
  );
};

export default ItemAlerta;
