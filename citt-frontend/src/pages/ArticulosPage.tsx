import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { AppLayout } from "../componentes/AppLayout";
import { Plus, Edit2, Trash2, Package, RefreshCw, Search } from "lucide-react";

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
}

// DTO para categorías, necesario para el filtro desplegable
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

  // Estados de Filtros
  const [filtroNombre, setFiltroNombre] = useState<string>("");
  const [filtroCategoriaId, setFiltroCategoriaId] = useState<string>(""); // Almacena el ID seleccionado como string
  const [filtroTipoTec, setFiltroTipoTec] = useState<string>("TODOS");

  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchCategorias = async () => {
    // Cargamos las categorías para el filtro, esto se hace una sola vez al montar el componente
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

  // Carga inicial de artículos al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  // Gatillo de actualización combinando paginación y filtros hacia la API
  useEffect(() => {
    fetchArticulos(currentPage);
  }, [currentPage, filtroNombre, filtroCategoriaId]);

  const fetchArticulos = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      // Construcción dinámica de la URL con filtros aplicados
      let url = `/articulos?page=${page}&size=10`;

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

  // Manejadores de cambio para los filtros, que también reinician la paginación a la primera página
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

          {/* Filtro por Categoría */}
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

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm whitespace-nowrap">
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
                {articulosVisualizados.map((articulo) => (
                  <tr
                    key={articulo.idArticulo}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-400 font-semibold">
                      #{articulo.idArticulo}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 font-bold">
                      {articulo.codigoDuoc || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">
                      {articulo.nombreArticulo}
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
                          articulo.nombreEstado === "DISPONIBLE"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : articulo.nombreEstado === "PRESTADO"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : articulo.nombreEstado === "MANTENCION"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {articulo.nombreEstado || "DESCONOCIDO"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
    </AppLayout>
  );
};
