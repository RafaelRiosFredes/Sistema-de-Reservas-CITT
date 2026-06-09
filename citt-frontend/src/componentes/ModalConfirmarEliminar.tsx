import { useState, useEffect } from "react";
import Modal from "../componentes/Modal";
import { AlertTriangle } from "lucide-react";

interface ModalConfirmarEliminarProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  nombreEspacio: string;
}

export const ModalConfirmarEliminar = ({ isOpen, onClose, onConfirm, nombreEspacio }: ModalConfirmarEliminarProps) => {
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Limpia el mensaje de error cada vez que el modal se abre o se cierra
  useEffect(() => {
    if (!isOpen) {
      setErrorMensaje(null);
    }
  }, [isOpen]);

  // Esta es la función clave que atrapa el error
  const handleConfirmClick = async () => {
    setIsDeleting(true);
    setErrorMensaje(null);
    
    try {
      await onConfirm(); // Ejecuta la función eliminar
      onClose();         // Si tiene éxito, cierra el modal
    } catch (error) {
      // SI FALLA (porque tiene solicitudes), atrapa el error y muestra este mensaje:
      setErrorMensaje("No puedes eliminar este espacio ya que tiene solicitudes activas o un historial de reservas asociado. Te recomendamos cambiar su estado a 'En Mantención' o 'Dañado' para inhabilitarlo.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="Confirmar Eliminación">
      <div className="flex flex-col gap-4 p-2">
        <p className="text-gray-600">
          ¿Estás seguro de que deseas eliminar el espacio <strong className="text-gray-800">{nombreEspacio}</strong>?
        </p>

        {/* ALERTA DE ERROR VISUAL */}
        {errorMensaje && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex gap-3 text-sm leading-relaxed animate-in fade-in zoom-in duration-300">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <p>{errorMensaje}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button 
            onClick={onClose} 
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors cursor-pointer border-none"
          >
            Cancelar
          </button>
          
          {/* Si ocurre el error, ocultamos el botón de eliminar para proteger los datos */}
          {!errorMensaje && (
            <button 
              onClick={handleConfirmClick} 
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2 cursor-pointer border-none"
            >
              {isDeleting ? "Eliminando..." : "Eliminar Definitivamente"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};