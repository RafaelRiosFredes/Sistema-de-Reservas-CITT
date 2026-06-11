import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MonitorSmartphone,
  Box,
  PackageOpen,
  Wrench,
  CalendarCheck,
  FileText,
  Users
} from "lucide-react";
import api from "../../api/axiosConfig";

interface Estadisticas {
  totalArticulosTecnologicos: number;
  totalInmobiliario: number;
  totalPrestados: number;
  totalDanados: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await api.get("/articulos/estadisticas");
        setEstadisticas(response.data);
      } catch (error) {
        console.error("Error obteniendo estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  const metricas = [
    {
      titulo: "Artículos Tecnológicos",
      valor: estadisticas?.totalArticulosTecnologicos ?? 0,
      icono: MonitorSmartphone,
      color: "bg-blue-500",
      bgLight: "bg-blue-50"
    },
    {
      titulo: "Inmobiliario",
      valor: estadisticas?.totalInmobiliario ?? 0,
      icono: Box,
      color: "bg-indigo-500",
      bgLight: "bg-indigo-50"
    },
    {
      titulo: "Prestados Actualmente",
      valor: estadisticas?.totalPrestados ?? 0,
      icono: PackageOpen,
      color: "bg-amber-500",
      bgLight: "bg-amber-50"
    },
    {
      titulo: "Dañados o Mantención",
      valor: estadisticas?.totalDanados ?? 0,
      icono: Wrench,
      color: "bg-red-500",
      bgLight: "bg-red-50"
    }
  ];

  const accesosRapidos = [
    { titulo: "Gestión Reservas", ruta: "/reservas", icono: CalendarCheck, color: "text-blue-600", bg: "bg-blue-100" },
    { titulo: "Inventario", ruta: "/articulos", icono: Box, color: "text-indigo-600", bg: "bg-indigo-100" },
    { titulo: "Espacios", ruta: "/espacios", icono: MonitorSmartphone, color: "text-emerald-600", bg: "bg-emerald-100" },
    { titulo: "Usuarios", ruta: "/usuarios", icono: Users, color: "text-amber-600", bg: "bg-amber-100" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">


      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metricas.map((metrica, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${metrica.bgLight}`}>
              <metrica.icono className={`w-6 h-6 text-white p-1.5 rounded-full ${metrica.color}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{metrica.titulo}</span>
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <span className="text-3xl font-black text-gray-800 leading-none mt-1">{metrica.valor}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Accesos Directos */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {accesosRapidos.map((acceso, index) => (
            <button
              key={index}
              onClick={() => navigate(acceso.ruta)}
              className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-blue-100 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${acceso.bg}`}>
                <acceso.icono className={`w-6 h-6 ${acceso.color}`} />
              </div>
              <span className="font-semibold text-gray-700 text-sm">{acceso.titulo}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
