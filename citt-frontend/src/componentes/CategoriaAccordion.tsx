import React, { useState } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import Boton from "./Boton";

interface MarcaDesglose {
  marca: string;
  cantidad: number;
}

interface CategoriaAccordionProps {
  nombreCategoria: string;
  totalDisponibles: number;
  desgloseMarcas: MarcaDesglose[];
  onSolicitar: (marca: string) => void;
}

const CategoriaAccordion: React.FC<CategoriaAccordionProps> = ({
  nombreCategoria,
  totalDisponibles,
  desgloseMarcas,
  onSolicitar,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-border shadow-sm overflow-hidden mb-4 transition-all hover:shadow-md">
      {/* Cabecera Plegable */}
      <div
        className="p-6 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <h3 className="m-0 text-xl">{nombreCategoria}</h3>
            <p className="text-gray-500 m-0 text-sm mt-1">
              <span className="font-bold text-success">
                {totalDisponibles} Unid.
              </span>{" "}
              disponibles en total
            </p>
          </div>
        </div>
        <div className="text-gray-400">
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      {/* Contenido Desplegado (Las Marcas) */}
      {isOpen && (
        <div className="border-t border-gray-border bg-gray-light p-6">
          <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">
            Desglose por Marca
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {desgloseMarcas.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg border border-gray-border flex justify-between items-center"
              >
                <div>
                  <p className="font-bold m-0">{item.marca}</p>
                  <p className="text-sm text-gray-500 m-0">
                    {item.cantidad} disponibles
                  </p>
                </div>
                <Boton onClick={() => onSolicitar(item.marca)}>Solicitar</Boton>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriaAccordion;
