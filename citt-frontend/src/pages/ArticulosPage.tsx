import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { AppLayout } from "../componentes/AppLayout";
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  RefreshCw,
  Search,
  Tags,
  RotateCcw,
} from "lucide-react";
import { ModalCrearCategoria } from "../componentes/ModalCrearCategoria";
import { ModalCrearArticulo } from "../componentes/ModalCrearArticulo";
import { ModalGestorCategorias } from "../componentes/ModalGestorCategorias";
import { ModalEditarArticulo } from "../componentes/ModalEditarArticulo";
import { ModalConfirmacion } from "../componentes/ModalConfirmacion";

interface ArticuloResponseDTO {
  idArticulo: number;
  nombreArticulo: string;
  marca: string;
  comentarios: string;
  sfai: string;
  colliers: string;
  numeroSerie: string;
  valor: number;
  etiqueta: string;
  fechaCompra: Date;
  codigoDuoc: string;
  idCategoria: number;
  nombreCategoria: string;
  idEstadoArticulo: number;
  nombreEstado: string;
  esTecnologico: boolean;
  eliminado?: boolean;
}

interface CategoriaDTO {
  idCategoria: number;
  nombreCategoria: string;
  esTecnologico: boolean;
}

export const ArticulosPage: React.FC = () => {
  const [articulos, setArticulos] = useState<ArticuloResponseDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]); // Estado para la lista desplegable
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCategorias, setLoadingCategorias] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros y modales
  const [filtroNombre, setFiltroNombre] = useState<string>("");
  const [filtroCategoriaId, setFiltroCategoriaId] = useState<string>(""); // Almacena el ID seleccionado como string
  const [filtroMostrarEliminados, setFiltroMostrarEliminados] =
    useState<boolean>(false);
  const [articuloARestaurar, setArticuloARestaurar] = useState<{
    id: number;
    nombre: string;
  } | null>(null);
  const [filtroTipoTec, setFiltroTipoTec] = useState<string>("TODOS");

  const [isCrearCategoriaOpen, setIsCrearCategoriaOpen] = useState(false);
  const [isGestorCategoriasOpen, setIsGestorCategoriasOpen] = useState(false);
  const [isArticuloModalOpen, setIsArticuloModalOpen] = useState(false);
  const [isEditarArticuloOpen, setIsEditarArticuloOpen] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<any>(null);
  const [articuloAEliminar, setArticuloAEliminar] = useState<{
    id: number;
    nombre: string;
  } | null>(null);
  const [articuloAEliminarDefinitivo, setArticuloAEliminarDefinitivo] =
    useState<{
      id: number;
      nombre: string;
    } | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchCategorias = async () => {
    // Este método se puede llamar tanto al montar el componente
    //  como después de crear/editar categorías para mantener la lista actualizada.
    setLoadingCategorias(true);
    try {
      const response = await api.get("/categorias");
      if (Array.isArray(response.data)) {
        setCategorias(response.data);
      }
    } catch (err) {
      console.error("Error al cargar categorías para el buscador:", err);
    } finally {
      setLoadingCategorias(false);
    }
  };

  // Cargar categorías una sola vez al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  // Cada vez que cambie la página o los filtros, recargamos los artículos desde el backend.
  useEffect(() => {
    fetchArticulos(currentPage);
  }, [currentPage, filtroNombre, filtroCategoriaId, filtroMostrarEliminados]);

  const fetchArticulos = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      // Construcción dinámica de la URL con parámetros de paginación y filtros
      let url = `/articulos?page=${page}&size=10&mostrarEliminados=${filtroMostrarEliminados}`;

      if (filtroNombre.trim() !== "") {
        url += `&nombre=${encodeURIComponent(filtroNombre)}`;
      }
      if (filtroCategoriaId !== "") {
        url += `&idCategoria=${filtroCategoriaId}`;
      }

      const response = await api.get(url);

      if (response.data && Array.isArray(response.data.content)) {
        setArticulos(response.data.content);
        setTotalPages(response.data.totalPages || 0);
      } else if (Array.isArray(response.data)) {
        setArticulos(response.data);
      } else {
        throw new Error("Estructura de datos inesperada del servidor.");
      }
    } catch (err: any) {
      setError("No se pudieron cargar los artículos desde el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Manejo seguro de cambios restableciendo la página a 0 de forma preventiva
  const handleFiltroNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroNombre(e.target.value);
    setCurrentPage(0);
  };

  const handleFiltroCategoriaChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFiltroCategoriaId(e.target.value);
    setCurrentPage(0);
  };

  const handleFiltroTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroTipoTec(e.target.value);
    setCurrentPage(0);
  };

  // Filtrado local complementario exclusivo para segmentar por la columna tecnológica
  const articulosVisualizados = articulos.filter((art) => {
    if (filtroTipoTec === "TODOS") return true;
    const valorTec = art.esTecnologico ?? false;
    return filtroTipoTec === "TEC" ? valorTec : !valorTec;
  });

  return (
    <AppLayout titulo="Inventario" breadcrumb="Inicio / Inventario">
      {/* BARRA DE FILTROS SUPERIOR */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-end gap-4 justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
          {/* Filtro por Nombre */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Buscar por Nombre
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={filtroNombre}
                onChange={handleFiltroNombreChange}
                placeholder="Ej: Monitor, Notebook..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
              />
            </div>
          </div>

          {/* Filtro por Categoría (Lista Plegable Conectada al Backend) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Categoría
            </label>
            <select
              value={filtroCategoriaId}
              onChange={handleFiltroCategoriaChange}
              disabled={loadingCategorias}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 font-medium cursor-pointer disabled:opacity-60"
            >
              <option value="">Todas las Categorías</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nombreCategoria}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Clasificación Tecnológica */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Clasificación
            </label>
            <select
              value={filtroTipoTec}
              onChange={handleFiltroTipoChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 font-medium cursor-pointer"
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="TEC">Solo Tecnológicos</option>
              <option value="NOTEC">No Tecnológicos</option>
            </select>
          </div>
          {/* Mostrar dados de baja */}
          <div className="flex items-center h-full pt-6">
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filtroMostrarEliminados}
                onChange={(e) => {
                  setFiltroMostrarEliminados(e.target.checked);
                  setCurrentPage(0);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-xs font-bold text-gray-500 uppercase">
                Incluir Dados de Baja
              </span>
            </label>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              fetchArticulos(currentPage);
              fetchCategorias();
            }}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-200 rounded-lg transition-all shadow-sm disabled:opacity-50"
            title="Sincronizar Datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* BOTÓN SECUNDARIO: Gestionar Categorías */}
          <button
            onClick={() => setIsGestorCategoriasOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm whitespace-nowrap"
          >
            <Tags className="w-4 h-4" />
            Gestionar Categorías
          </button>

          {/* BOTÓN PRIMARIO: Añadir Artículo */}
          <button
            onClick={() => {
              setIsArticuloModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Añadir Artículo
          </button>
        </div>
      </div>

      {/* RENDERIZADO DE TABLA */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium">
          {error}
        </div>
      ) : articulosVisualizados.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-bold text-lg">
            No hay artículos registrados
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Modifica los criterios de búsqueda o añade un nuevo ítem al
            inventario.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Código Duoc</th>
                  <th className="px-6 py-4">Artículo</th>
                  <th className="px-6 py-4">Marca</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Clasificación</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articulosVisualizados.map((articulo) => {
                  const isEliminado = articulo.eliminado ?? false;

                  return (
                    <tr
                      key={articulo.idArticulo}
                      className={`transition-colors group ${
                        isEliminado
                          ? "bg-red-50/40 opacity-75 grayscale-[20%]"
                          : "hover:bg-blue-50/40"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-400 font-semibold">
                        #{articulo.idArticulo}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-mono font-bold ${isEliminado ? "text-gray-400 line-through" : "text-gray-600"}`}
                      >
                        {articulo.codigoDuoc || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">
                        <span
                          className={
                            isEliminado ? "line-through text-gray-500" : ""
                          }
                        >
                          {articulo.nombreArticulo}
                        </span>
                        <div className="text-xs font-normal text-gray-400 font-mono mt-0.5">
                          S/N: {articulo.numeroSerie || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {articulo.marca || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {articulo.nombreCategoria || "General"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {(articulo.esTecnologico ?? false) ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-purple-50 text-purple-700 border border-purple-200">
                            ⚡ Tecnológico
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200">
                            📦 No Tecnológico
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${
                            isEliminado
                              ? "bg-red-100 text-red-600 border-red-200"
                              : articulo.nombreEstado === "DISPONIBLE"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : articulo.nombreEstado === "PRESTADO"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : articulo.nombreEstado === "MANTENCION"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {isEliminado
                            ? "DADO DE BAJA"
                            : articulo.nombreEstado || "DESCONOCIDO"}
                        </span>
                      </td>
                      {/* COLUMNA ACCIONES */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isEliminado ? (
                            // ACCIONES CUANDO ESTÁ DADO DE BAJA (Eliminado lógicamente)
                            <>
                              {/* Botón Restaurar */}
                              <button
                                onClick={() =>
                                  setArticuloARestaurar({
                                    id: articulo.idArticulo,
                                    nombre: articulo.nombreArticulo,
                                  })
                                }
                                className="text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
                                title="Restaurar al Inventario"
                              >
                                <RotateCcw
                                  className="w-4 h-4"
                                  strokeWidth={2.5}
                                />
                              </button>

                              {/* Botón Eliminar Definitivamente */}
                              <button
                                onClick={() =>
                                  setArticuloAEliminarDefinitivo({
                                    id: articulo.idArticulo,
                                    nombre: articulo.nombreArticulo,
                                  })
                                }
                                className="text-red-400 hover:text-red-700 transition-colors cursor-pointer"
                                title="Destrucción Física (Definitiva)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            // ACCIONES NORMALES (Cuando el artículo está Activo)
                            <>
                              {/* Botón Editar */}
                              <button
                                onClick={() => {
                                  setArticuloSeleccionado(articulo);
                                  setIsEditarArticuloOpen(true);
                                }}
                                className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Botón Dar de Baja Lógica */}
                              <button
                                onClick={() =>
                                  setArticuloAEliminar({
                                    id: articulo.idArticulo,
                                    nombre: articulo.nombreArticulo,
                                  })
                                }
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
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
              <span className="text-sm text-gray-500 font-medium">
                Mostrando página{" "}
                <span className="font-bold text-gray-700">
                  {currentPage + 1}
                </span>{" "}
                de <span className="font-bold text-gray-700">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentPage === 0}
                  className="px-3 py-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* --- ZONA DE MODALES --- */}

      {/* 1. Gestor Principal de Categorías */}
      <ModalGestorCategorias
        isOpen={isGestorCategoriasOpen}
        onClose={() => setIsGestorCategoriasOpen(false)}
        onOpenCrear={() => setIsCrearCategoriaOpen(true)} // <-- La transición asimétrica
      />

      {/* 2. Creador de Categorías (Llamado desde el Gestor o desde un flujo vacío) */}
      <ModalCrearCategoria
        isOpen={isCrearCategoriaOpen}
        onClose={() => setIsCrearCategoriaOpen(false)}
        onSuccess={() => {
          fetchCategorias(); // Recargamos el menú principal
          // Opcional: Podrías reabrir el gestor aquí, pero mantenerlo cerrado es menos intrusivo.
        }}
      />

      {/* 3. Creador de Artículos */}
      <ModalCrearArticulo
        isOpen={isArticuloModalOpen}
        onClose={() => setIsArticuloModalOpen(false)}
        categorias={categorias}
        onSuccess={() => {
          setCurrentPage(0);
          fetchArticulos(0);
        }}
      />

      {/* 4. Modificador de Artículos */}
      <ModalEditarArticulo
        isOpen={isEditarArticuloOpen}
        onClose={() => {
          setIsEditarArticuloOpen(false);
          setArticuloSeleccionado(null);
        }}
        categorias={categorias}
        articulo={articuloSeleccionado}
        onSuccess={() => {
          fetchArticulos(currentPage); // Mantiene al usuario en la misma página
        }}
      />

      {/* 5. Eliminador de Artículos */}
      <ModalConfirmacion
        isOpen={articuloAEliminar !== null}
        onClose={() => setArticuloAEliminar(null)}
        title="Dar de baja Artículo"
        message={
          <>
            ¿Estás seguro de que deseas dar de baja el artículo{" "}
            <strong>"{articuloAEliminar?.nombre}"</strong>?<br />
            <br />
            Este desaparecerá del inventario activo y ya no estará disponible
            para nuevas reservas.
          </>
        }
        confirmText="Sí, dar de baja"
        isDestructive={true}
        onConfirm={async () => {
          if (articuloAEliminar) {
            await api.delete(`/articulos/${articuloAEliminar.id}`);
            fetchArticulos(currentPage); // Refresca la tabla automáticamente
            setArticuloAEliminar(null); // Cierra el modal
          }
        }}
      />

      {/* 6. Restaurador de Artículos */}
      <ModalConfirmacion
        isOpen={articuloARestaurar !== null}
        onClose={() => setArticuloARestaurar(null)}
        title="Restaurar Artículo"
        message={
          <>
            ¿Deseas reintegrar el artículo{" "}
            <strong>"{articuloARestaurar?.nombre}"</strong> al inventario
            activo?
            <br />
            <br />
            Al hacerlo, volverá a estar disponible para préstamos y solicitudes
            de alumnos.
          </>
        }
        confirmText="Sí, restaurar"
        isDestructive={false}
        onConfirm={async () => {
          if (articuloARestaurar) {
            await api.patch(`/articulos/${articuloARestaurar.id}/restaurar`);
            fetchArticulos(currentPage); // Refresca la tabla automáticamente
            setArticuloARestaurar(null); // Cierra el modal
          }
        }}
      />

      {/* 7. Destrucción Física de Artículos (Hard Delete) */}
      <ModalConfirmacion
        isOpen={articuloAEliminarDefinitivo !== null}
        onClose={() => setArticuloAEliminarDefinitivo(null)}
        title="Destrucción de Registro"
        message={
          <>
            Estás a punto de borrar físicamente de la base de datos el artículo{" "}
            <strong>"{articuloAEliminarDefinitivo?.nombre}"</strong>.<br />
            <br />
            Esta acción es{" "}
            <strong className="text-red-600">IRREVERSIBLE</strong>.<br />
            <em>
              Nota: Si el artículo ha sido parte de reservas o préstamos en el
              pasado, el sistema bloqueará su eliminación para proteger la
              integridad del historial.
            </em>
          </>
        }
        confirmText="Destruir Físicamente"
        isDestructive={true}
        onConfirm={async () => {
          if (articuloAEliminarDefinitivo) {
            try {
              await api.delete(
                `/articulos/${articuloAEliminarDefinitivo.id}/definitivo`,
              );
              fetchArticulos(currentPage);
              setArticuloAEliminarDefinitivo(null);
            } catch (error: any) {
              // En caso de error, asumimos que es por restricciones de integridad referencial
              alert(
                "No se pudo eliminar físicamente.\n\n" +
                  "Es altamente probable que este artículo tenga un historial de préstamos o reservas asociadas, por lo que la base de datos impide su destrucción.",
              );
              setArticuloAEliminarDefinitivo(null);
            }
          }
        }}
      />
    </AppLayout>
  );
};
