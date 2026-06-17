import { useState } from "react";
import Modal from "./Modal";
import api from "../api/axiosConfig";

interface ModalCrearEspacioProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalCrearEspacio = ({ isOpen, onClose, onSuccess }: ModalCrearEspacioProps) => {
  const [nombre, setNombre] = useState("");
  const [capacidad, setCapacidad] = useState(10);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ nombre: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({ nombre: "" });
    
    if (!nombre.trim()) {
      setFieldErrors({ nombre: "El nombre del espacio es obligatorio" });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Al ser baseURL: 'http://localhost:8080/api', esta ruta resulta en
      // http://localhost:8080/api/espacios
      await api.post("/espacios", { 
        nombre: nombre.trim(), 
        capacidad 
      });
      
      onSuccess(); // Recarga la tabla en la página principal
      onClose();   // Cierra el modal
      setNombre("");
      setCapacidad(10);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.mensaje || "Error al registrar el espacio. Verifica que el nombre no esté duplicado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="Registrar Nuevo Espacio">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2" noValidate>
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-700">Nombre del Laboratorio/Sala</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => {
              setNombre(e.target.value);
              setFieldErrors({ nombre: "" });
            }}
            placeholder="Ej: Laboratorio Mac" 
            className={`p-3 border rounded-lg focus:ring-2 outline-none transition-all ${fieldErrors.nombre ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:ring-blue-500'}`}
          />
          {fieldErrors.nombre && (
            <span className="text-red-500 text-xs font-medium mt-1">{fieldErrors.nombre}</span>
          )}
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-700">Capacidad Máxima (Personas)</label>
          <input 
            type="number" 
            value={capacidad} 
            onChange={(e) => setCapacidad(Number(e.target.value))}
            min={1} 
            max={50} 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            required 
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold cursor-pointer border-none transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold cursor-pointer border-none transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? "Guardando..." : "Guardar Espacio"}
          </button>
        </div>
      </form>
    </Modal>
  );
};