import React, { useEffect, useState } from "react";
import { Search, PackageOpen } from "lucide-react";
import api from "../api/axiosConfig";
import CategoriaAccordion from "./CategoriaAccordion";
import type { CategoriaCatalogo } from "./CategoriaAccordion";

export const CatalogoArticulos: React.FC = () => {
  const [categorias, setCategorias] = useState<CategoriaCatalogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  // Estado global para las selecciones de cantidad por categoría y marca
  const [seleccionesGlobales, setSeleccionesGlobales] = useState<
    Record<number, Record<string, number>>
  >({});

  // Carga inicial del catálogo de artículos
  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        const response = await api.get("/categorias/catalogo-alumnos");
        setCategorias(response.data);
      } catch (error) {
        console.error("Error cargando el catálogo de artículos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalogo();
  }, []);

  // Función para actualizar la cantidad seleccionada de una marca dentro de una categoría
  const actualizarSeleccion = (
    idCategoria: number,
    marca: string,
    cantidad: number,
  ) => {
    setSeleccionesGlobales((prev) => {
      const categoriaActual = { ...(prev[idCategoria] || {}) };

      if (cantidad <= 0) {
        delete categoriaActual[marca]; // Limpia la memoria si vuelve a 0
      } else {
        categoriaActual[marca] = cantidad;
      }

      return {
        ...prev,
        [idCategoria]: categoriaActual,
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filtrado simple por nombre de categoría
  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nombreCategoria.toLowerCase().includes(filtro.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* BANNER SUPERIOR */}
      <div className="bg-gradient-to-r from-[#003B5C] to-[#007bff] rounded-xl p-6 text-white shadow-md flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          <PackageOpen size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black m-0 tracking-tight">
            Artículos Disponibles
          </h2>
          <p className="text-blue-100 text-sm mt-1 m-0 font-medium">
            Consulta el catálogo y solicita equipos en préstamo.
          </p>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 flex items-center p-2">
        <div className="pl-4 text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Todas las categorías..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border-none outline-none font-medium text-slate-700 bg-transparent"
        />
      </div>

      {/* LISTADO DE ACORDEONES */}
      <div className="flex flex-col">
        {categoriasFiltradas.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-bold text-lg">
              No se encontraron artículos disponibles en este momento.
            </p>
          </div>
        ) : (
          categoriasFiltradas.map((cat) => (
            <CategoriaAccordion
              key={cat.idCategoria}
              categoria={cat}
              selecciones={seleccionesGlobales[cat.idCategoria] || {}}
              onActualizarSeleccion={(marca, cantidad) =>
                actualizarSeleccion(cat.idCategoria, marca, cantidad)
              }
            />
          ))
        )}
      </div>
    </div>
  );
};
