import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Laptop,
  Smartphone,
  Printer,
  Monitor,
} from "lucide-react";

export interface MarcaDesglose {
  marca: string;
  cantidad: number;
}

export interface CategoriaCatalogo {
  idCategoria: number;
  nombreCategoria: string;
  totalCategoria: number;
  desgloseMarcas: MarcaDesglose[];
}

interface CategoriaAccordionProps {
  categoria: CategoriaCatalogo;
  selecciones: Record<string, number>;
  onActualizarSeleccion: (marca: string, cantidad: number) => void;
}

interface AnimatedBrandItemProps {
  item: MarcaDesglose;
  idx: number;
  selecciones: Record<string, number>;
  onActualizarSeleccion: (marca: string, cantidad: number) => void;
}

// Subcomponente que maneja su propia animación de altura muy suave (grid-template-rows)
const AnimatedBrandItem: React.FC<AnimatedBrandItemProps> = ({
  item,
  idx,
  selecciones,
  onActualizarSeleccion,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Escalonamos la aparición: 50ms base + 150ms de diferencia entre cada uno
    const t = setTimeout(() => setMounted(true), 50 + idx * 150);
    return () => clearTimeout(t);
  }, [idx]);

  const cantidadSeleccionada = selecciones[item.marca] || 0;
  const isSelected = cantidadSeleccionada > 0;

  const handleIncrementar = (marca: string, stockMaximo: number) => {
    if (cantidadSeleccionada < stockMaximo) {
      onActualizarSeleccion(marca, cantidadSeleccionada + 1);
    }
  };

  const handleDecrementar = (marca: string) => {
    if (cantidadSeleccionada <= 1) {
      onActualizarSeleccion(marca, 0);
    } else {
      onActualizarSeleccion(marca, cantidadSeleccionada - 1);
    }
  };

  return (
    <div
      className="grid transition-all duration-500 ease-in-out"
      style={{
        gridTemplateRows: mounted ? "1fr" : "0fr",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(-10px)",
      }}
    >
      <div className="overflow-hidden">
        <div
          className={`relative flex items-center justify-between p-4 mb-3 rounded-xl transition-colors ${
            isSelected
              ? "border-2 border-blue-600 bg-white shadow-sm"
              : "border border-slate-200 bg-white hover:border-blue-300"
          }`}
        >
          {/* Línea horizontal conectora del árbol */}
          <div className="absolute -left-6 top-1/2 w-6 border-t-2 border-slate-200 -translate-y-1/2" />

          {/* Lado Izquierdo: Nombre de Marca */}
          <div className="flex-1">
            <h4 className="text-lg font-bold text-slate-800 m-0 leading-none">
              {item.marca}
            </h4>
          </div>

          {/* Lado Derecho: Controles interactivos */}
          <div className="flex items-center gap-6">
            {isSelected && (
              <div className="flex items-center bg-blue-50 border border-blue-100 rounded-lg overflow-hidden shadow-sm h-9 animate-in fade-in zoom-in duration-200">
                <button
                  onClick={() => handleIncrementar(item.marca, item.cantidad)}
                  disabled={cantidadSeleccionada >= item.cantidad}
                  className="px-3 h-full text-blue-600 hover:bg-blue-100 font-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  +
                </button>
                <div className="px-3 h-full flex items-center justify-center bg-white border-x border-blue-100 font-bold text-slate-800 min-w-[3rem]">
                  {cantidadSeleccionada}
                </div>
                <button
                  onClick={() => handleDecrementar(item.marca)}
                  className="px-3 h-full text-blue-600 hover:bg-blue-100 font-black transition-colors"
                >
                  -
                </button>
              </div>
            )}

            <span className="text-sm font-medium text-slate-500 w-32 text-right">
              Stock: {item.cantidad} Unidades
            </span>

            {/* Botón de Acción Final */}
            <div className="w-40 flex justify-end">
              {isSelected ? (
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap animate-in fade-in duration-200">
                  Selección actual
                </span>
              ) : (
                <button
                  onClick={() => {
                    onActualizarSeleccion(item.marca, 1);
                  }}
                  className="bg-[#007bff] hover:bg-blue-700 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Seleccionar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoriaAccordion: React.FC<CategoriaAccordionProps> = ({
  categoria,
  selecciones,
  onActualizarSeleccion,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderIcon = () => {
    const nombre = categoria.nombreCategoria.toLowerCase();
    if (nombre.includes("tablet") || nombre.includes("celular"))
      return <Smartphone size={20} />;
    if (nombre.includes("impresora")) return <Printer size={20} />;
    if (nombre.includes("monitor")) return <Monitor size={20} />;
    return <Laptop size={20} />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all mb-4">
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            {renderIcon()}
          </div>
          <h3 className="text-lg font-bold text-slate-800 m-0">
            {categoria.nombreCategoria}
          </h3>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-slate-600">
            Stock Total: {categoria.totalCategoria} Unidades
          </span>
          <div className="text-slate-400 bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm flex items-center justify-center transition-transform duration-300">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="px-6 pb-6 pt-2">
          <div className="ml-5 pl-6 border-l-2 border-slate-200 relative pt-1">
            {categoria.desgloseMarcas.map((item, idx) => (
              <AnimatedBrandItem
                key={item.marca}
                item={item}
                idx={idx}
                selecciones={selecciones}
                onActualizarSeleccion={onActualizarSeleccion}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriaAccordion;
