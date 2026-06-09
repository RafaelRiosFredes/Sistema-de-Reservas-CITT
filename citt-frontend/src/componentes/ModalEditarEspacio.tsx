import { useState, useEffect } from "react";
import Modal from "../componentes/Modal";
import api from "../api/axiosConfig";

interface Espacio {
  id: number;
  nombre: string;
  comentarios: string;
  capacidad: number;
  estado: string;
}

interface ModalEditarEspacioProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  espacio: Espacio | null;
}

export const ModalEditarEspacio = ({ isOpen, onClose, onSuccess, espacio }: ModalEditarEspacioProps) => {
  const [nombre, setNombre] = useState("");
  const [capacidad, setCapacidad] = useState(10);
  const [comentarios, setComentarios] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carga los datos del espacio cuando el modal se abre
  useEffect(() => {
    if (espacio) {
      setNombre(espacio.nombre);
      setCapacidad(espacio.capacidad);
      setComentarios(espacio.comentarios || "");
      setError("");
    }
  }, [espacio, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!espacio) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Enviamos el objeto completo al backend incluyendo comentarios 
      // y reteniendo el estado actual del espacio
      await api.put(`/espacios/${espacio.id}`, { 
        nombre, 
        capacidad,
        comentarios,
        estado: espacio.estado 
      });
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.mensaje || "Error al actualizar el espacio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="Editar Espacio Físico">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        {/* NOMBRE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-700">Nombre del Espacio</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            className="p-2.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
        </div>

        {/* CAPACIDAD */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-700">Capacidad (Personas)</label>
          <input 
            type="number" 
            value={capacidad} 
            onChange={(e) => setCapacidad(Number(e.target.value))} 
            className="p-2.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500" 
            min={1}
            required 
          />
        </div>

        {/* COMENTARIOS */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-700">Comentarios / Equipamiento</label>
          <textarea 
            value={comentarios} 
            onChange={(e) => setComentarios(e.target.value)} 
            placeholder="Ej: Proyector, computadores, pizarra acrílica."
            className="p-2.5 border border-gray-300 rounded-lg text-sm h-24 resize-none bg-white outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        {/* ACCIONES */}
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
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default ModalEditarEspacio;