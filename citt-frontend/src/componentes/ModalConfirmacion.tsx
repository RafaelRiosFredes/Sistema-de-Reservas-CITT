import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Boton from "./Boton";

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean; // Indica si la acción es destructiva (rojo) o no (azul)
}

export const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose(); // Cierra el modal después de la confirmación exitosa
    } catch (error) {
      console.error("Error en la confirmación:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={!isLoading ? onClose : () => {}}
      titulo={title}
    >
      <div className="p-2">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50">
          <AlertTriangle
            className={`w-8 h-8 ${isDestructive ? "text-red-500" : "text-amber-500"}`}
          />
        </div>

        <div className="text-center mb-8">
          <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <Boton
            type="button"
            variante="secundario"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            {cancelText}
          </Boton>
          <Boton
            type="button"
            variante="primario"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 shadow-md ${
              isDestructive
                ? "bg-red-600 hover:bg-red-700 shadow-red-200 text-white"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 text-white"
            }`}
          >
            {isLoading ? "Procesando..." : confirmText}
          </Boton>
        </div>
      </div>
    </Modal>
  );
};
