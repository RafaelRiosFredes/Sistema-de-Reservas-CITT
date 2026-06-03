import { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api/axiosConfig";
import { AlertTriangle, Info } from "lucide-react";

interface Espacio {
  id: number;
  nombre: string;
  comentarios: string;
  capacidad: number;
  estado: string;
}

interface ModalActualizarEstadoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  espacio: Espacio | null;
}

export const ModalActualizarEstado = ({ isOpen, onClose, onSuccess, espacio }: ModalActualizarEstadoProps) => {
  const [estado, setEstado] = useState("DISPONIBLE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sincronizar el estado actual cuando se abre el modal
  useEffect(() => {
    if (espacio) {
      setEstado(espacio.estado ? espacio.estado.toUpperCase() : "DISPONIBLE");
      setErrorMsg(null);
    }
  }, [espacio, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!espacio) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Como tu backend pide todos los datos en el DTO, enviamos los datos actuales
      // pero con el nuevo estado seleccionado.
      await api.put(`/espacios/${espacio.id}`, {
        nombre: espacio.nombre,
        capacidad: espacio.capacidad,
        comentarios: espacio.comentarios,
        estado: estado
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.mensaje || "Error al actualizar el estado del espacio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="Actualizar Estado del Espacio">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
        
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex gap-3 text-sm border border-blue-100 mb-2">
          <Info className="w-5 h-5 flex-shrink-0 text-blue-500 mt-0.5" />
          <p>
            Estás modificando la disponibilidad de <strong>{espacio?.nombre}</strong>. Esto afectará si los alumnos pueden o no solicitar reservas para este lugar.
          </p>
        </div>

        {/* SELECTOR DE ESTADOS */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-700">Nuevo Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg text-sm bg-white font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="DISPONIBLE">🟢 Disponible (Operativo)</option>
            <option value="MANTENCION">🟡 En Mantención (Temporal)</option>
            <option value="DAÑADO">🔴 Dañado / Clausurado</option>
          </select>
        </div>

        {/* ADVERTENCIAS DINÁMICAS */}
        {(estado === "MANTENCION" || estado === "DAÑADO") && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex gap-3 text-sm leading-relaxed mt-2 animate-in fade-in zoom-in duration-300">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-bold">¡Atención!</p>
              <p className="mt-1">
                El espacio pasará a estar <strong>inhabilitado para nuevas reservas</strong>. Recuerda revisar el calendario y cancelar/rechazar las solicitudes pendientes que coincidan con este periodo.
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium border border-red-100">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors cursor-pointer border-none"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#021626] hover:bg-[#003b73] text-white rounded-lg font-bold transition-colors cursor-pointer border-none shadow-sm"
          >
            {isSubmitting ? "Guardando..." : "Confirmar Estado"}
          </button>
        </div>
      </form>
    </Modal>
  );
};