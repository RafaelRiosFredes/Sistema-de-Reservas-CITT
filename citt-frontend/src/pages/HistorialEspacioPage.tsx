import React, { useEffect, useState } from "react";
import {
  History,
  Search,
  RefreshCw,
  DoorOpen,
  Calendar,
  Clock,
  Archive,
} from "lucide-react";
import api from "../api/axiosConfig";
import BadgeEstado from "../componentes/BadgeEstado";

interface ReservaDTO {
  idSolicitud: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  proposito: string;
  estado: string;
  cantidadIntegrantes: number | null;
  emailUsuario: string;
  nombreEspacio: string;
}

export const HistorialEspaciosPage: React.FC = () => {
  const [reservas, setReservas] = useState<ReservaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const response = await api.get("/solicitudes");
      setReservas(response.data);
    } catch (error) {
      console.error("Error al cargar historial de espacios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  // Filtrar solo las reservas FINALIZADAS o RECHAZADAS
  const reservasFinalizadas = reservas
    .filter((r) => r.estado === "FINALIZADA" || r.estado === "RECHAZADA")
    .filter(
      (r) =>
        r.emailUsuario?.toLowerCase().includes(filtro.toLowerCase()) ||
        r.proposito?.toLowerCase().includes(filtro.toLowerCase()) ||
        r.nombreEspacio?.toLowerCase().includes(filtro.toLowerCase()),
    );

  const formatHora = (hora: string) => {
    if (!hora) return "";
    return hora.substring(0, 5);
  };

  return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* BANNER */}
        <div className="bg-gradient-to-r from-[#1e293b] to-[#475569] rounded-xl p-6 text-white shadow-md flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <History size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black m-0 tracking-tight">
              Historial de Reservas de Espacios
            </h2>
            <p className="text-slate-300 text-sm mt-1 m-0 font-medium">
              Registro completo de reservas de espacios finalizadas o rechazadas.
            </p>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA + REFRESH */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center p-2">
            <div className="pl-4 text-slate-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Buscar por email, propósito o espacio..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border-none outline-none font-medium text-slate-700 bg-transparent"
            />
          </div>
          <button
            onClick={fetchHistorial}
            className="p-3 border border-slate-300 rounded-xl hover:text-blue-600 hover:border-blue-300 cursor-pointer bg-white transition-colors shadow-sm"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* TABLA */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : reservasFinalizadas.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Archive size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold text-lg m-0">
              No hay reservas en el historial
            </p>
            <p className="text-slate-400 text-sm mt-2 m-0">
              Las reservas completadas o rechazadas aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-gray-50/50">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Solicitante
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Horario
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Espacio
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Propósito
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reservasFinalizadas.map((r) => (
                    <tr
                      key={r.idSolicitud}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-4 font-mono text-sm text-slate-500">
                        #{r.idSolicitud}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                            {r.emailUsuario?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]">
                            {r.emailUsuario}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" />
                          {r.fecha}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          {formatHora(r.horaInicio)} - {formatHora(r.horaFin)}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-700">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                          <DoorOpen size={12} />
                          {r.nombreEspacio || "—"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600 max-w-[180px] truncate">
                        {r.proposito || "—"}
                      </td>
                      <td className="p-4">
                        <BadgeEstado estado={r.estado as any} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CONTADOR */}
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {reservasFinalizadas.length} reserva
                {reservasFinalizadas.length !== 1 ? "s" : ""} en historial
              </span>
            </div>
          </div>
        )}
      </div>
  );
};
