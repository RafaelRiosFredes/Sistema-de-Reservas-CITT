import React from "react";

export interface ItemSeleccionArticuloProps {
  idArticulo: string;
  nombre: string;
  stockDisponible: number;
  seleccionado: boolean;
  cantidad: number;
  onToggle: (id: string) => void;
  onChangeCantidad: (id: string, cantidad: number) => void;
}

const ItemSeleccionArticulo: React.FC<ItemSeleccionArticuloProps> = ({
  idArticulo,
  nombre,
  stockDisponible,
  seleccionado,
  cantidad,
  onToggle,
  onChangeCantidad,
}) => {
  return (
    <div
      className={`p-4 border rounded-lg flex items-center justify-between mb-3 transition-colors ${seleccionado ? "border-primary bg-primary/5" : "border-gray-border bg-white"}`}
    >
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={seleccionado}
          onChange={() => onToggle(idArticulo)}
          className="w-5 h-5 accent-primary cursor-pointer"
        />
        <div>
          <p className="font-bold text-dark m-0">{nombre}</p>
          <p className="text-xs text-gray-500 m-0">Stock: {stockDisponible}</p>
        </div>
      </div>

      {seleccionado && (
        <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-border shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase">
            Cant:
          </span>
          <input
            type="number"
            min={1}
            max={stockDisponible}
            value={cantidad}
            onChange={(e) =>
              onChangeCantidad(idArticulo, parseInt(e.target.value) || 1)
            }
            className="w-12 text-center border-none outline-none font-bold text-sm bg-transparent"
          />
        </div>
      )}
    </div>
  );
};

export default ItemSeleccionArticulo;
