import React, { useEffect, useState } from "react";
import {
  FileText,
  ClipboardList,
  DoorOpen,
  User,
  Calendar,
  Clock,
  ArrowDownToLine,
  Undo2,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import api from "../api/axiosConfig";
import BadgeEstado from "../componentes/BadgeEstado";
import { ModalConfirmacion } from "../componentes/ModalConfirmacion";

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

const ESTADOS_ACTIVOS = ["PENDIENTE", "APROBADA", "EN PROCESO"];

export const ReservasPage: React.FC = () => {
  const rolActivo = localStorage.getItem("rolActivo") || "";
  const isStaff = ["AYUDANTE", "DOCENTE", "COORDINADOR", "DIRECTOR", "ADMIN"].includes(
    rolActivo.toUpperCase()
  );

  const [misReservas, setMisReservas] = useState<ReservaDTO[]>([]);
  const [todasReservas, setTodasReservas] = useState<ReservaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState<"mias" | "todas">("mias");
  const [filtro, setFiltro] = useState("");

  // Modal states
  const [modalLiberar, setModalLiberar] = useState(false);
  const [modalIngreso, setModalIngreso] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] =
    useState<ReservaDTO | null>(null);

  // Feedback
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const misRes = await api.get("/solicitudes/mis-solicitudes");
      setMisReservas(Array.isArray(misRes.data) ? misRes.data : []);

      if (isStaff) {
        const todasRes = await api.get("/solicitudes");
        setTodasReservas(Array.isArray(todasRes.data) ? todasRes.data : []);
      }
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar solo activas
  const misReservasFiltradas = misReservas
    .filter((r) => ESTADOS_ACTIVOS.includes(r.estado))
    .filter(
      (r) =>
        r.proposito?.toLowerCase().includes(filtro.toLowerCase()) ||
        r.nombreEspacio?.toLowerCase().includes(filtro.toLowerCase())
    );

  const todasFiltradas = todasReservas
    .filter((r) => ESTADOS_ACTIVOS.includes(r.estado))
    .filter(
      (r) =>
        r.emailUsuario?.toLowerCase().includes(filtro.toLowerCase()) ||
        r.proposito?.toLowerCase().includes(filtro.toLowerCase()) ||
        r.nombreEspacio?.toLowerCase().includes(filtro.toLowerCase())
    );

  const handleRegistrarIngreso = async () => {
    if (!reservaSeleccionada) return;
    try {
      await api.patch(
        `/solicitudes/${reservaSeleccionada.idSolicitud}/entregar`,
        []
      );
      setSuccessMsg("Ingreso registrado exitosamente. Espacio en uso.");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchData();
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.mensaje || "Error al registrar el ingreso."
      );
      setTimeout(() => setErrorMsg(""), 4000);
    }
    setModalIngreso(false);
    setReservaSeleccionada(null);
  };

  const handleLiberarEspacio = async () => {
    if (!reservaSeleccionada) return;
    try {
      await api.patch(
        `/solicitudes/${reservaSeleccionada.idSolicitud}/devolver`
      );
      setSuccessMsg("Salida registrada exitosamente. Espacio liberado.");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchData();
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.mensaje || "Error al registrar la salida."
      );
      setTimeout(() => setErrorMsg(""), 4000);
    }
    setModalLiberar(false);
    setReservaSeleccionada(null);
  };

  const formatHora = (hora: string) => {
    if (!hora) return "";
    return hora.substring(0, 5);
  };

  const reservasAMostrar =
    vistaActiva === "mias" ? misReservasFiltradas : todasFiltradas;

  return (
    <>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* BANNER */}
        <div className="bg-gradient-to-r from-[#003B5C] to-[#007bff] rounded-xl p-6 text-white shadow-md flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <ClipboardList size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black m-0 tracking-tight">
              {isStaff ? "Gestión de Reservas" : "Mis Reservas de Espacios"}
            </h2>
            <p className="text-blue-100 text-sm mt-1 m-0 font-medium">
              {isStaff
                ? "Administra las solicitudes de reserva y el uso de los espacios."
                : "Revisa el estado de tus reservas de espacios activas."}
            </p>
          </div>
        </div>

        {/* MENSAJES DE FEEDBACK */}
        {successMsg && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2 animate-in fade-in duration-300">
            <CheckCircle size={18} className="shrink-0" />
            <p className="m-0 font-medium">{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 animate-in fade-in duration-300">
            <AlertCircle size={18} className="shrink-0" />
            <p className="m-0 font-medium">{errorMsg}</p>
          </div>
        )}

        {/* TABS PARA STAFF */}
        {isStaff && (
          <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-max">
            <button
              onClick={() => setVistaActiva("mias")}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                vistaActiva === "mias"
                  ? "bg-[#003B5C] text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <User size={16} />
                Mis Reservas
              </span>
            </button>
            <button
              onClick={() => setVistaActiva("todas")}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                vistaActiva === "todas"
                  ? "bg-[#003B5C] text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText size={16} />
                Todas las Reservas
              </span>
            </button>
          </div>
        )}

        {/* BARRA DE BÚSQUEDA + REFRESH */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center p-2">
            <div className="pl-4 text-slate-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder={
                vistaActiva === "todas"
                  ? "Buscar por email, propósito o espacio..."
                  : "Buscar por propósito o espacio..."
              }
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border-none outline-none font-medium text-slate-700 bg-transparent"
            />
          </div>
          <button
            onClick={fetchData}
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
        ) : reservasAMostrar.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold text-lg m-0">
              No hay reservas activas
            </p>
            <p className="text-slate-400 text-sm mt-2 m-0">
              {vistaActiva === "mias"
                ? "No tienes reservas pendientes o en proceso."
                : "No hay reservas activas en el sistema."}
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
                    {vistaActiva === "todas" && (
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Solicitante
                      </th>
                    )}
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
                    {isStaff && vistaActiva === "todas" && (
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reservasAMostrar.map((r) => (
                    <tr
                      key={r.idSolicitud}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-4 font-mono text-sm text-slate-500">
                        #{r.idSolicitud}
                      </td>
                      {vistaActiva === "todas" && (
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                              {r.emailUsuario?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]">
                              {r.emailUsuario}
                            </span>
                          </div>
                        </td>
                      )}
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
                        <BadgeEstado
                          estado={r.estado as any}
                        />
                      </td>
                      {isStaff && vistaActiva === "todas" && (
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            {r.estado === "APROBADA" && (
                              <button
                                onClick={() => {
                                  setReservaSeleccionada(r);
                                  setModalIngreso(true);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer"
                                title="Registrar ingreso al espacio"
                              >
                                <ArrowDownToLine size={14} />
                                Ingreso
                              </button>
                            )}
                            {r.estado === "EN PROCESO" && (
                              <button
                                onClick={() => {
                                  setReservaSeleccionada(r);
                                  setModalLiberar(true);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 hover:border-emerald-300 transition-all cursor-pointer"
                                title="Registrar salida y liberar espacio"
                              >
                                <Undo2 size={14} />
                                Liberar
                              </button>
                            )}
                            {r.estado === "PENDIENTE" && (
                              <span className="text-xs text-slate-400 italic px-2">
                                Esperando aprobación
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CONTADOR */}
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {reservasAMostrar.length} reserva
                {reservasAMostrar.length !== 1 ? "s" : ""} activa
                {reservasAMostrar.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* MODAL INGRESO */}
      <ModalConfirmacion
        isOpen={modalIngreso}
        onClose={() => {
          setModalIngreso(false);
          setReservaSeleccionada(null);
        }}
        onConfirm={handleRegistrarIngreso}
        title="Confirmar Ingreso"
        message={
          <>
            ¿Confirmas el ingreso de <strong>{reservaSeleccionada?.emailUsuario}</strong> al espacio{" "}
            <strong>{reservaSeleccionada?.nombreEspacio}</strong> para la reserva{" "}
            <strong>#{reservaSeleccionada?.idSolicitud}</strong>?
            <br />
            <span className="text-xs text-slate-400 mt-2 block">
              La reserva pasará al estado "EN PROCESO".
            </span>
          </>
        }
        confirmText="Confirmar Ingreso"
        isDestructive={false}
      />

      {/* MODAL LIBERAR */}
      <ModalConfirmacion
        isOpen={modalLiberar}
        onClose={() => {
          setModalLiberar(false);
          setReservaSeleccionada(null);
        }}
        onConfirm={handleLiberarEspacio}
        title="Confirmar Salida"
        message={
          <>
            ¿Confirmas la salida del espacio <strong>{reservaSeleccionada?.nombreEspacio}</strong> (Reserva{" "}
            <strong>#{reservaSeleccionada?.idSolicitud}</strong>)?
            <br />
            <span className="text-xs text-slate-400 mt-2 block">
              La reserva será marcada como "FINALIZADA" y el espacio quedará disponible.
            </span>
          </>
        }
        confirmText="Confirmar Salida"
        isDestructive={false}
      />
    </>
  );
};
