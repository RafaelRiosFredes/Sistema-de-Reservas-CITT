import React, { useState } from "react";
import { ChevronDown, ChevronUp, Package, Check, X } from "lucide-react";
import Boton from "./Boton";

interface MarcaDesglose {
  marca: string;
  cantidad: number;
}

interface CategoriaAccordionProps {
  nombreCategoria: string;
  totalDisponibles: number;
  desgloseMarcas: MarcaDesglose[];
  // Actualizamos la función para que ahora también envíe la cantidad deseada al padre
  onSolicitar: (marca: string, cantidad: number) => void;
}

const CategoriaAccordion: React.FC<CategoriaAccordionProps> = ({
  nombreCategoria,
  totalDisponibles,
  desgloseMarcas,
  onSolicitar,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Estados para manejar la lógica de "cuántos quiere"
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string | null>(
    null,
  );
  const [cantidadDeseada, setCantidadDeseada] = useState<number>(1);

  const iniciarSeleccion = (marca: string) => {
    setMarcaSeleccionada(marca);
    setCantidadDeseada(1); // Siempre partimos sugiriendo 1
  };

  const confirmarSolicitud = (marca: string) => {
    onSolicitar(marca, cantidadDeseada);
    setMarcaSeleccionada(null); // Reseteamos la vista después de pedir
  };

  return (
    <div className="bg-white rounded-xl border border-gray-border shadow-sm overflow-hidden mb-4 transition-all hover:shadow-md">
      {/* CABECERA PLEGABLE */}
      <div
        className="px-6 py-4 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <Package size={24} />
          </div>
          <h3 className="m-0 text-xl">{nombreCategoria}</h3>
        </div>

        <div className="flex items-center gap-8">
          <span className="font-bold text-lg text-dark">
            Stock Total: {totalDisponibles}
          </span>
          <div className="text-gray-400">
            {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>
      </div>

      {/* CONTENIDO DESPLEGADO: LISTA VERTICAL CON SELECTOR DE CANTIDAD */}
      {isOpen && (
        <div className="border-t-2 border-dark bg-white flex flex-col">
          {desgloseMarcas.map((item, idx) => {
            const enModoSeleccion = marcaSeleccionada === item.marca;

            return (
              <div
                key={idx}
                className="px-8 py-4 border-b border-gray-border last:border-b-0 flex justify-between items-center hover:bg-gray-50 transition-colors h-[72px]"
              >
                {/* Lado Izquierdo: Datos */}
                <div className="flex items-center justify-between w-1/2 pr-8">
                  <p className="font-bold text-dark text-lg m-0">
                    {item.marca}
                  </p>
                  <p className="font-bold text-gray-500 text-sm m-0">
                    Stock: {item.cantidad}
                  </p>
                </div>

                {/* Lado Derecho: Interacción (Botón o Selector) */}
                {enModoSeleccion ? (
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                    {/* Input de Cantidad */}
                    <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-md border border-gray-border shadow-sm">
                      <span className="text-xs font-bold text-gray-400 uppercase">
                        Cant:
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={item.cantidad}
                        value={cantidadDeseada}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          // Bloqueamos que no pida más del stock ni menos de 1
                          if (val > 0 && val <= item.cantidad)
                            setCantidadDeseada(val);
                        }}
                        className="w-10 text-center border-none outline-none font-bold text-sm bg-transparent"
                      />
                    </div>

                    {/* Botón Cancelar */}
                    <button
                      onClick={() => setMarcaSeleccionada(null)}
                      className="p-1.5 text-gray-400 hover:text-error hover:bg-error/10 rounded-md transition-colors cursor-pointer border-none bg-transparent"
                      title="Cancelar"
                    >
                      <X size={20} />
                    </button>

                    {/* Botón Confirmar */}
                    <Boton
                      variante="primario"
                      onClick={() => confirmarSolicitud(item.marca)}
                      className="px-4 py-2 text-sm flex items-center gap-1"
                    >
                      <Check size={16} /> Pedir
                    </Boton>
                  </div>
                ) : (
                  <Boton
                    variante="secundario"
                    onClick={() => iniciarSeleccion(item.marca)}
                    className="bg-white text-dark border border-gray-border hover:border-primary hover:text-primary transition-all font-bold px-6 py-2 rounded-md cursor-pointer"
                  >
                    Seleccionar
                  </Boton>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoriaAccordion;
