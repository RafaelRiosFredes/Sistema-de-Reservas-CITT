import React, { useState } from "react";
import { Edit2, Trash2, RotateCcw } from "lucide-react";
import TablaDatos from "../componentes/TablaDatos";
import BadgeEstado from "../componentes/BadgeEstado";
import { ModalEditarArticulo } from "../componentes/ModalEditarArticulo";
import { ModalConfirmacion } from "../componentes/ModalConfirmacion";
import api from "../api/axiosConfig";

interface TablaArticulosGestionProps {
  articulos: any[];
  onActualizar: () => void;
  categorias: any[];
}

export const TablaArticulosGestion: React.FC<TablaArticulosGestionProps> = ({
  articulos,
  onActualizar,
  categorias,
}) => {
  const [articuloEditando, setArticuloEditando] = useState<any>(null);
  const [articuloEliminando, setArticuloEliminando] = useState<any>(null);
  const [articuloRestaurando, setArticuloRestaurando] = useState<any>(null);
  const [articuloAEliminarDefinitivo, setArticuloAEliminarDefinitivo] =
    useState<any>(null);

  // Eliminación lógica con manejo de errores específico
  const handleEliminar = async () => {
    if (!articuloEliminando) return;
    try {
      await api.delete(`/articulos/${articuloEliminando.idArticulo}`);
      onActualizar();
    } catch (error) {
      console.error("Error al dar de baja el artículo", error);
    } finally {
      setArticuloEliminando(null);
    }
  };

  // Restauración con manejo de errores específico
  const handleRestaurar = async () => {
    if (!articuloRestaurando) return;
    try {
      await api.patch(`/articulos/${articuloRestaurando.idArticulo}/restaurar`);
      onActualizar();
    } catch (error) {
      console.error("Error al restaurar el artículo", error);
    } finally {
      setArticuloRestaurando(null);
    }
  };

  // Eliminación definitiva con manejo de errores específico
  const handleEliminarDefinitivo = async () => {
    if (!articuloAEliminarDefinitivo) return;
    try {
      await api.delete(
        `/articulos/${articuloAEliminarDefinitivo.idArticulo}/definitivo`,
      );
      onActualizar();
      setArticuloAEliminarDefinitivo(null);
    } catch (error: any) {
      alert(
        "No se pudo eliminar físicamente.\n\nEs altamente probable que este artículo tenga un historial de préstamos o reservas asociadas, por lo que la base de datos impide su destrucción para mantener la integridad.",
      );
      setArticuloAEliminarDefinitivo(null);
    }
  };

  return (
    <>
      <TablaDatos
        columnas={[
          "ID",
          "Código Duoc",
          "Artículo",
          "Categoría",
          "Estado",
          "Acciones",
        ]}
      >
        {articulos.map((art) => {
          const isEliminado = art.eliminado ?? false;

          return (
            <tr
              key={art.idArticulo}
              className={`transition-colors group ${
                isEliminado
                  ? "bg-red-50/40 opacity-75 grayscale-[20%]"
                  : "hover:bg-blue-50/40"
              }`}
            >
              <td className="p-4 border-b border-gray-200 text-sm text-gray-400 font-semibold">
                #{art.idArticulo}
              </td>

              <td
                className={`p-4 border-b border-gray-200 text-sm font-mono font-bold ${isEliminado ? "text-gray-400 line-through" : "text-gray-600"}`}
              >
                {art.codigoDuoc || "-"}
              </td>

              <td className="p-4 border-b border-gray-200 text-sm font-bold text-gray-800">
                <span
                  className={isEliminado ? "line-through text-gray-500" : ""}
                >
                  {art.nombreArticulo}
                </span>
                <div className="text-xs font-normal text-gray-400 font-mono mt-0.5">
                  {art.marca || "Sin marca"}
                </div>
              </td>

              <td className="p-4 border-b border-gray-200 text-sm text-gray-600 font-medium">
                {art.nombreCategoria || "General"}
              </td>

              <td className="p-4 border-b border-gray-200">
                {isEliminado ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border bg-red-100 text-red-600 border-red-200">
                    DADO DE BAJA
                  </span>
                ) : (
                  <BadgeEstado estado={art.nombreEstado || "MANTENCION"} />
                )}
              </td>

              <td className="p-4 border-b border-gray-200 text-center">
                <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEliminado ? (
                    <>
                      {/* Acciones para artículos dados de baja */}
                      <button
                        onClick={() => setArticuloRestaurando(art)}
                        className="text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
                        title="Restaurar al Inventario"
                      >
                        <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => setArticuloAEliminarDefinitivo(art)}
                        className="text-red-400 hover:text-red-700 transition-colors cursor-pointer"
                        title="Destrucción Física (Definitiva)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Acciones para artículos activos */}
                      <button
                        onClick={() => setArticuloEditando(art)}
                        className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setArticuloEliminando(art)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Dar de Baja (Lógico)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </TablaDatos>

      {articuloEditando && (
        <ModalEditarArticulo
          isOpen={!!articuloEditando}
          onClose={() => setArticuloEditando(null)}
          onSuccess={onActualizar}
          categorias={categorias}
          articulo={articuloEditando}
        />
      )}

      <ModalConfirmacion
        isOpen={!!articuloEliminando}
        onClose={() => setArticuloEliminando(null)}
        onConfirm={handleEliminar}
        title="Dar de baja Artículo"
        message={
          <>
            ¿Estás seguro de que deseas dar de baja el artículo{" "}
            <strong>"{articuloEliminando?.nombreArticulo}"</strong>?<br />
            <br />
            Este desaparecerá del inventario activo y ya no estará disponible
            para nuevas reservas.
          </>
        }
        confirmText="Sí, dar de baja"
        isDestructive={true}
      />

      <ModalConfirmacion
        isOpen={!!articuloRestaurando}
        onClose={() => setArticuloRestaurando(null)}
        onConfirm={handleRestaurar}
        title="Restaurar Artículo"
        message={
          <>
            ¿Deseas reintegrar el artículo{" "}
            <strong>"{articuloRestaurando?.nombreArticulo}"</strong> al
            inventario activo?
            <br />
            <br />
            Al hacerlo, volverá a estar disponible para préstamos y solicitudes
            de alumnos.
          </>
        }
        confirmText="Sí, restaurar"
        isDestructive={false}
      />

      <ModalConfirmacion
        isOpen={!!articuloAEliminarDefinitivo}
        onClose={() => setArticuloAEliminarDefinitivo(null)}
        onConfirm={handleEliminarDefinitivo}
        title="Destrucción de Registro"
        message={
          <>
            Estás a punto de borrar físicamente de la base de datos el artículo{" "}
            <strong>"{articuloAEliminarDefinitivo?.nombreArticulo}"</strong>.
            <br />
            <br />
            Esta acción es{" "}
            <strong className="text-red-600">IRREVERSIBLE</strong>.<br />
            <em>
              Nota: Si el artículo ha sido parte de reservas en el pasado, el
              sistema bloqueará su eliminación.
            </em>
          </>
        }
        confirmText="Destruir Físicamente"
        isDestructive={true}
      />
    </>
  );
};
