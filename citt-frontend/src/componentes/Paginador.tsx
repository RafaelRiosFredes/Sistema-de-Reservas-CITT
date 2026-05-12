import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginadorProps {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

const Paginador: React.FC<PaginadorProps> = ({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}) => {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-border sm:px-6">
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => onCambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 0}
          className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => onCambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas - 1}
          className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 m-0">
            Página <span className="font-bold">{paginaActual + 1}</span> de{" "}
            <span className="font-bold">{totalPaginas}</span>
          </p>
        </div>
        <div>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate">
            <button
              onClick={() => onCambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 0}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-border rounded-l-md hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => onCambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas - 1}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-border rounded-r-md hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Paginador;
