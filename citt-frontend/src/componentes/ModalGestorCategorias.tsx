import React, { useState, useEffect } from "react";
import {
  Edit2,
  Check,
  X,
  AlertCircle,
  Plus,
  Power,
  Box,
  Cpu,
} from "lucide-react";
import Modal from "./Modal";
import Boton from "./Boton";
import api from "../api/axiosConfig";

interface CategoriaAdminDTO {
  idCategoria: number;
  nombreCategoria: string;
  esTecnologico: boolean;
  eliminado: boolean;
}

interface ModalGestorCategoriasProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCrear: () => void; // Función para abrir el modal de creación desde el gestor
}

export const ModalGestorCategorias: React.FC<ModalGestorCategoriasProps> = ({
  isOpen,
  onClose,
  onOpenCrear,
}) => {
  const [categorias, setCategorias] = useState<CategoriaAdminDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados para edición inline
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editEsTecnologico, setEditEsTecnologico] = useState(true);

  const fetchCategoriasAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/categorias/todas");
      setCategorias(response.data);
      setErrorMsg(""); // Limpiamos el error si tiene éxito
    } catch (error: any) {
      // Manejo de errores mejorado con detalles del backend
      const status = error.response?.status || "Desconocido";
      const mensajeBackend =
        error.response?.data?.mensaje ||
        error.response?.data?.mensaje ||
        error.message;

      setErrorMsg(`Error del Servidor (Status ${status}): ${mensajeBackend}`);
      console.error("Respuesta completa del servidor:", error.response);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategoriasAdmin();
      setEditingId(null);
      setErrorMsg("");
    }
  }, [isOpen]);

  const handleToggleEstado = async (cat: CategoriaAdminDTO) => {
    try {
      if (!cat.eliminado) {
        // Si NO está eliminado (Activo), hacemos DELETE lógico
        await api.delete(`/categorias/${cat.idCategoria}`);
      } else {
        // Si ESTÁ eliminado (Inactivo), usamos PATCH para restaurar
        await api.patch(`/categorias/${cat.idCategoria}/restaurar`);
      }
      // Actualizamos la tabla
      fetchCategoriasAdmin();
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.mensaje ||
        "Error al cambiar el estado de la categoría.",
      );
    }
  };

  const iniciarEdicion = (cat: CategoriaAdminDTO) => {
    setEditingId(cat.idCategoria);
    setEditNombre(cat.nombreCategoria);
    setEditEsTecnologico(cat.esTecnologico);
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setErrorMsg("");
  };

  const guardarEdicion = async (id: number) => {
    if (!editNombre.trim()) {
      setErrorMsg("El nombre no puede estar vacío.");
      return;
    }

    try {
      await api.put(`/categorias/${id}`, {
        nombreCategoria: editNombre.trim(),
        esTecnologico: editEsTecnologico,
      });
      setEditingId(null);
      fetchCategoriasAdmin(); // Recargamos para reflejar cambios
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.mensaje || "Error al actualizar la categoría.",
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="Gestión de Categorías">
      <div className="flex flex-col space-y-4">
        {/* Cabecera de Acciones */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-slate-500">
            Administra el catálogo base. Las categorías inactivas no afectarán a
            los artículos existentes, pero no podrán ser asignadas a nuevos
            ítems.
          </p>
          <Boton
            onClick={() => {
              onClose(); // Cerramos el gestor actual
              onOpenCrear(); // Abrimos el modal de creación
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs py-1.5 px-3 whitespace-nowrap"
          >
            <Plus size={14} strokeWidth={3} />
            Nueva Categoría
          </Boton>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Tabla / Lista de Categorías */}
        <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[50vh] overflow-y-auto custom-scrollbar">
          {isLoading && categorias.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              Cargando datos...
            </div>
          ) : categorias.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No hay categorías registradas.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-bold">Categoría</th>
                  <th className="px-4 py-3 font-bold">Tipo</th>
                  <th className="px-4 py-3 font-bold">Estado</th>
                  <th className="px-4 py-3 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {categorias.map((cat) => {
                  // Lógica para determinar el estado visual de la fila
                  const isEditing = editingId === cat.idCategoria;
                  const isActivo = !cat.eliminado;

                  return (
                    <tr
                      key={cat.idCategoria}
                      className={`transition-colors ${isActivo ? "hover:bg-slate-50" : "bg-slate-50/50 opacity-80"}`}
                    >
                      {/* COLUMNA NOMBRE */}
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editNombre}
                            onChange={(e) => setEditNombre(e.target.value)}
                            className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                        ) : (
                          <span
                            className={
                              !isActivo ? "line-through text-slate-400" : ""
                            }
                          >
                            {cat.nombreCategoria}
                          </span>
                        )}
                      </td>

                      {/* COLUMNA TIPO TECNOLÓGICO */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <select
                            value={editEsTecnologico ? "true" : "false"}
                            onChange={(e) =>
                              setEditEsTecnologico(e.target.value === "true")
                            }
                            className="w-full px-2 py-1 border border-blue-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="true">Tecnológico</option>
                            <option value="false">Mobiliario</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${cat.esTecnologico
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                          >
                            {cat.esTecnologico ? (
                              <Cpu size={10} />
                            ) : (
                              <Box size={10} />
                            )}
                            {cat.esTecnologico ? "TEC" : "NO-TEC"}
                          </span>
                        )}
                      </td>

                      {/* COLUMNA ESTADO */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${isActivo
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-200 text-slate-500"
                            }`}
                        >
                          {/* Traducimos el booleano a texto visual */}
                          {isActivo ? "ACTIVO" : "INACTIVO"}
                        </span>
                      </td>

                      {/* COLUMNA ACCIONES */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => guardarEdicion(cat.idCategoria)}
                              className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                              title="Guardar"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={cancelarEdicion}
                              className="p-1.5 text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 rounded-md transition-colors"
                              title="Cancelar"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => iniciarEdicion(cat)}
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                              disabled={!isActivo}
                              title={
                                isActivo
                                  ? "Editar Categoría"
                                  : "Restaure para editar"
                              }
                            >
                              <Edit2
                                size={16}
                                className={
                                  !isActivo
                                    ? "opacity-30 cursor-not-allowed"
                                    : ""
                                }
                              />
                            </button>

                            {/* EL SWITCH DE ESTADO (Desactivar / Restaurar) */}
                            <button
                              onClick={() => handleToggleEstado(cat)}
                              className={`p-1.5 rounded-full transition-colors ${isActivo
                                  ? "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                                  : "bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600"
                                }`}
                              title={
                                isActivo
                                  ? "Desactivar Categoría"
                                  : "Restaurar Categoría"
                              }
                            >
                              <Power size={14} strokeWidth={3} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
};
