import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { AppLayout } from "../componentes/AppLayout";
import { RefreshCw } from "lucide-react";
import InputBusqueda from "../componentes/InputBusqueda";
import SelectForm from "../componentes/SelectForm";
import Paginador from "../componentes/Paginador";
import { AccionesArticulos } from "../componentes/AccionesArticulos";
import { TablaArticulosGestion } from "../componentes/TablaArticulosGestion";
import { CatalogoArticulos } from "../componentes/CatalogoArticulos";
import { TablaArticulosLectura } from "../componentes/TablaArticulosLectura";

export const ArticulosPage: React.FC = () => {
  // Obtener roles y rol activo desde localStorage
  const rolActivo = localStorage.getItem("rolActivo");
  const rolesRaw = localStorage.getItem("userRoles");
  const userRoles: string[] = rolesRaw ? JSON.parse(rolesRaw) : [];

  // Función para verificar acceso a vistas según roles
  const verificarAcceso = (rolesPermitidos: string[]) => {
    if (rolActivo) return rolesPermitidos.includes(rolActivo);
    return userRoles.some((r) => rolesPermitidos.includes(r));
  };

  const isAdminArea = verificarAcceso(["ADMIN", "DIRECTOR", "COORDINADOR"]);
  const isAyudante = verificarAcceso(["AYUDANTE"]);
  const isAlumno = verificarAcceso(["ALUMNO", "DOCENTE"]);

  // Definir qué vista mostrar según roles (estrictamente excluyente)
  const mostrarVistaAdmin = isAdminArea;
  const mostrarVistaAyudante = isAyudante && !isAdminArea;
  const mostrarVistaCatalogo = isAlumno && !isAdminArea && !isAyudante;

  const [articulos, setArticulos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoriaId, setFiltroCategoriaId] = useState("");
  const [mostrarEliminados, setMostrarEliminados] = useState(false);

  const fetchCategorias = async () => {
    try {
      const response = await api.get("/categorias/todas");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al cargar categorías", error);
    }
  };

  const fetchArticulos = async (page = 0) => {
    // Si es vista de catálogo, no hacemos llamada a API y mostramos datos predefinidos
    if (mostrarVistaCatalogo) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/articulos", {
        params: {
          page,
          size: 10,
          nombre: filtroNombre || undefined,
          idCategoria: filtroCategoriaId || undefined,
          mostrarEliminados: mostrarEliminados,
        },
      });
      setArticulos(response.data.content || response.data);
      setTotalPages(response.data.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error al cargar artículos", error);
    } finally {
      setLoading(false);
    }
  };

  const refrescarDatos = () => {
    fetchArticulos(currentPage);
    fetchCategorias();
  };

  useEffect(() => {
    if (!mostrarVistaCatalogo) fetchCategorias();
  }, [mostrarVistaCatalogo]);

  useEffect(() => {
    fetchArticulos(currentPage);
  }, [currentPage, filtroNombre, filtroCategoriaId, mostrarEliminados]);

  return (
    <AppLayout titulo="Inventario / Artículos" breadcrumb="Inicio / Artículos">
      {/* HEADER DE FILTROS OCULTO PARA EL CATÁLOGO */}
      {!mostrarVistaCatalogo && (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-end gap-4 justify-between">
          <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
            <InputBusqueda
              placeholder="Buscar por nombre o marca..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
            <div className="w-64 flex flex-col gap-2">
              <SelectForm
                label=""
                value={filtroCategoriaId}
                onChange={(e) => setFiltroCategoriaId(e.target.value)}
                opciones={[
                  { valor: "", texto: "Todas las Categorías" },
                  ...categorias.map((c) => ({
                    valor: c.idCategoria.toString(),
                    texto: c.nombreCategoria,
                  })),
                ]}
              />
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer w-max">
                <input
                  type="checkbox"
                  checked={mostrarEliminados}
                  onChange={(e) => setMostrarEliminados(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Mostrar artículos dados de baja
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={refrescarDatos}
              className="p-2 border border-slate-300 rounded-lg hover:text-blue-600 cursor-pointer bg-white"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            {mostrarVistaAdmin && (
              <AccionesArticulos
                onActualizar={() => fetchArticulos(currentPage)}
                categorias={categorias}
              />
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* RENDERIZADO ESTRICTAMENTE EXCLUYENTE */}
          {mostrarVistaAdmin && (
            <TablaArticulosGestion
              articulos={articulos}
              onActualizar={() => fetchArticulos(currentPage)}
              categorias={categorias}
            />
          )}

          {mostrarVistaAyudante && (
            <TablaArticulosLectura articulos={articulos} />
          )}

          {mostrarVistaCatalogo && <CatalogoArticulos />}

          {/* PAGINADOR OCULTO PARA CATÁLOGO */}
          {!mostrarVistaCatalogo && totalPages > 0 && (
            <div className="mt-6">
              <Paginador
                paginaActual={currentPage}
                totalPaginas={totalPages}
                onCambiarPagina={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
};
