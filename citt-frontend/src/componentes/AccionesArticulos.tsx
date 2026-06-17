import React, { useState } from "react";
import { Plus, Tags } from "lucide-react";
import { ModalCrearArticulo } from "../componentes/ModalCrearArticulo";
import { ModalGestorCategorias } from "../componentes/ModalGestorCategorias";
import { ModalCrearCategoria } from "../componentes/ModalCrearCategoria";

interface AccionesArticulosProps {
  onActualizar: () => void;
  categorias: any[];
}

export const AccionesArticulos: React.FC<AccionesArticulosProps> = ({
  onActualizar,
  categorias,
}) => {
  const [isArticuloModalOpen, setIsArticuloModalOpen] = useState(false);
  const [isGestorCategoriasOpen, setIsGestorCategoriasOpen] = useState(false);
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {/* Botón Secundario: Gestionar Categorías */}
      <button
        onClick={() => setIsGestorCategoriasOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium text-sm shadow-sm cursor-pointer"
      >
        <Tags className="w-4 h-4" />
        Gestionar Categorías
      </button>

      {/* Botón Principal: Añadir Artículo */}
      <button
        onClick={() => setIsArticuloModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Agregar Artículo
      </button>

      {/* Crear Artículo */}
      {isArticuloModalOpen && (
        <ModalCrearArticulo
          isOpen={isArticuloModalOpen}
          onClose={() => setIsArticuloModalOpen(false)}
          categorias={categorias}
          onSuccess={onActualizar}
        />
      )}

      {/* Gestor de Categorías */}
      {isGestorCategoriasOpen && (
        <ModalGestorCategorias
          isOpen={isGestorCategoriasOpen}
          onClose={() => {
            setIsGestorCategoriasOpen(false);
            onActualizar();
          }}
          onOpenCrear={() => {
            setIsGestorCategoriasOpen(false);
            setIsCategoriaModalOpen(true);
          }}
        />
      )}

      {/* Crear Nueva Categoría */}
      {isCategoriaModalOpen && (
        <ModalCrearCategoria
          isOpen={isCategoriaModalOpen}
          onClose={() => {
            setIsCategoriaModalOpen(false);
            setIsGestorCategoriasOpen(true);
          }}
          onSuccess={() => {
            onActualizar();
            setIsCategoriaModalOpen(false);
            setIsGestorCategoriasOpen(true);
          }}
        />
      )}
    </div>
  );
};
