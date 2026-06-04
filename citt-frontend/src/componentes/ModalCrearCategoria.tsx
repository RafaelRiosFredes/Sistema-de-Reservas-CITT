import React, { useState } from "react";
import { AlertCircle, Tag, Cpu, Box } from "lucide-react";
import Modal from "../componentes/Modal";
import InputForm from "../componentes/InputForm";
import Boton from "../componentes/Boton";
import api from "../api/axiosConfig";

interface ModalCrearCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalCrearCategoria: React.FC<ModalCrearCategoriaProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Estados controlados para el formulario
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [esTecnologico, setEsTecnologico] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Función para resetear el estado del formulario
  const resetearEstado = () => {
    setNombreCategoria("");
    setEsTecnologico(true);
    setErrorMsg("");
  };

  const handleClose = () => {
    resetearEstado();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica del formulario
    if (!nombreCategoria.trim()) {
      setErrorMsg("El nombre de la categoría es obligatorio.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      await api.post("/categorias", {
        nombreCategoria: nombreCategoria.trim(),
        esTecnologico: esTecnologico,
      });

      resetearEstado();
      onSuccess(); // Notificamos al padre para refrescar la lista de categorías
      onClose();
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.mensaje ||
          "Error inesperado al crear la categoría. Por favor, intenta nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      titulo="Añadir Nueva Categoría"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Renderizado Condicional de Errores */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        <div className="space-y-5">
          {/* Campo: Nombre de Categoría */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Tag size={16} className="text-slate-400" />
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                Nombre de la Categoría
              </label>
            </div>
            <InputForm
              label="Nombre de la Categoría"
              type="text"
              placeholder="Ej: Monitores, Teclados, Sillas..."
              value={nombreCategoria}
              onChange={(e: {
                target: { value: React.SetStateAction<string> };
              }) => setNombreCategoria(e.target.value)}
            />
          </div>

          {/* Clasificación del Activo */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
              Clasificación del Activo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEsTecnologico(true)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  esTecnologico
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                <Cpu
                  size={24}
                  className={`mb-2 ${esTecnologico ? "text-blue-600" : "text-slate-400"}`}
                />
                <span className="text-sm font-bold">Tecnológico</span>
              </button>

              <button
                type="button"
                onClick={() => setEsTecnologico(false)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  !esTecnologico
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                <Box
                  size={24}
                  className={`mb-2 ${!esTecnologico ? "text-amber-500" : "text-slate-400"}`}
                />
                <span className="text-sm font-bold">Inmobiliario</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
                Esta clasificación es importante para la gestión interna y reportes, pero no afecta la funcionalidad del sistema.            
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <Boton
            type="button"
            variante="secundario"
            onClick={handleClose}
            className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            disabled={isLoading}
          >
            Cancelar
          </Boton>
          <Boton
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Crear Categoría"}
          </Boton>
        </div>
      </form>
    </Modal>
  );
};
