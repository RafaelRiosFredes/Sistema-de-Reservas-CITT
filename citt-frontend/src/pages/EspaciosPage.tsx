import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSeguridad } from "../hooks/useSeguridad"; 
import { Plus, Trash2, Edit, AlertTriangle } from "lucide-react";
import api from "../api/axiosConfig";
import TablaDatos from "../componentes/TablaDatos";
import { ModalCrearEspacio } from "../componentes/ModalCrearEspacio";
import { ModalEditarEspacio } from "../componentes/ModalEditarEspacio";
import { ModalConfirmarEliminar } from "../componentes/ModalConfirmarEliminar";
import { ModalActualizarEstado } from "../componentes/ModalActualizarEstado"; 

type RolUsuario = "ADMIN" | "PROFESOR" | "AYUDANTE" | "ALUMNO";

interface Espacio {
  id: number;
  nombre: string;
  comentarios: string;
  capacidad: number;
  estado: string;
}

const EspaciosPage = () => {
  const { isVerificando } = useSeguridad(); 
  const [rolAsignado, setRolAsignado] = useState<RolUsuario>("ALUMNO");
  
  // Shared States
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Admin Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [espacioAEditar, setEspacioAEditar] = useState<Espacio | null>(null);
  const [espacioABorrar, setEspacioABorrar] = useState<Espacio | null>(null);
  const [espacioEstado, setEspacioEstado] = useState<Espacio | null>(null);

  useEffect(() => {
    if (!isVerificando) {
      const rolActivo = localStorage.getItem("activeRole"); 
      const rolesRaw = localStorage.getItem("userRoles");

      try {
        if (rolActivo) {
          const rolUpper = rolActivo.toUpperCase();
          if (rolUpper.includes("ADMIN") || rolUpper.includes("COORDINADOR") || rolUpper.includes("DIRECTOR")) {
            setRolAsignado("ADMIN");
            return;
          }
          if (rolUpper.includes("PROFESOR") || rolUpper.includes("DOCENTE")) {
            setRolAsignado("PROFESOR");
            return;
          }
          if (rolUpper.includes("AYUDANTE")) {
            setRolAsignado("AYUDANTE");
            return;
          }
        }

        if (rolesRaw) {
          const rolesArray = JSON.parse(rolesRaw);
          const esAdminOCoordinador = rolesArray.some((rol: any) => {
            const nombreRol = typeof rol === "string" ? rol : rol.nombre || rol.authority || "";
            const rUpper = nombreRol.toUpperCase();
            return rUpper.includes("ADMIN") || rUpper.includes("COORDINADOR") || rUpper.includes("DIRECTOR");
          });
          const esProfesor = rolesArray.some((rol: any) => {
            const nombreRol = typeof rol === "string" ? rol : rol.nombre || rol.authority || "";
            const rUpper = nombreRol.toUpperCase();
            return rUpper.includes("PROFESOR") || rUpper.includes("DOCENTE");
          });
          const esAyudante = rolesArray.some((rol: any) => {
            const nombreRol = typeof rol === "string" ? rol : rol.nombre || rol.authority || "";
            return nombreRol.toUpperCase().includes("AYUDANTE");
          });

          if (esAdminOCoordinador) setRolAsignado("ADMIN");
          else if (esProfesor) setRolAsignado("PROFESOR");
          else if (esAyudante) setRolAsignado("AYUDANTE");
          else setRolAsignado("ALUMNO");
        }
      } catch (error) {
        console.error("Error al procesar la asignación de roles", error);
        setRolAsignado("ALUMNO"); 
      }
    }
  }, [isVerificando]);

  const fetchEspacios = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/espacios");
      setEspacios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error al cargar los espacios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isVerificando) {
      fetchEspacios();
    }
  }, [isVerificando]);

  const ejecutarEliminar = async () => {
    if (!espacioABorrar) return;
    try { 
      await api.delete(`/espacios/${espacioABorrar.id}`); 
      fetchEspacios(); 
      setEspacioABorrar(null);
    } catch (error: any) { 
      throw new Error("No se puede eliminar por integridad de datos");
    }
  };

  const renderEstadoLocal = (estado: string) => {
    const est = estado ? estado.toUpperCase() : "DESCONOCIDO";
    if (est === "DISPONIBLE") {
      return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">🟢 Disponible</span>;
    }
    if (est === "MANTENCION") {
      return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">🟡 En Mantención</span>;
    }
    if (est === "DAÑADO") {
      return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200">🔴 Dañado</span>;
    }
    return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">⚪ {estado}</span>;
  };

  if (isVerificando) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003b73]"></div>
      </div>
    );
  }

  const rolActivo = localStorage.getItem("activeRole") || "";
  const isAdminArea = ["ADMIN", "DIRECTOR", "COORDINADOR"].includes(rolActivo.toUpperCase());

  if (!isAdminArea) {
    return <Navigate to="/solicitar-reserva" replace />;
  }

  // --- ADMIN VIEW ONLY ---
  return (
    <>

      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm cursor-pointer">
            <Plus className="w-4 h-4" /> Agregar Espacio
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <TablaDatos columnas={["CÓDIGO", "NOMBRE", "CAPACIDAD", "ESTADO", "ACCIONES"]}>
            {espacios.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-5 font-medium text-gray-600">ESP-{e.id.toString().padStart(3, '0')}</td>
                <td className="p-5 font-bold text-gray-800">{e.nombre}</td>
                <td className="p-5 text-gray-600">{e.capacidad} pers.</td>
                <td className="p-5">{renderEstadoLocal(e.estado)}</td>
                <td className="p-5 flex gap-3">
                  <button onClick={() => setEspacioEstado(e)} className="text-amber-500 hover:text-amber-700" title="Gestionar Estado">
                    <AlertTriangle size={18} />
                  </button>
                  <button onClick={() => setEspacioAEditar(e)} className="text-blue-600 hover:text-blue-800" title="Editar Información">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => setEspacioABorrar(e)} className="text-red-400 hover:text-red-600" title="Eliminar Espacio">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </TablaDatos>
        </div>

        <ModalCrearEspacio isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchEspacios} />
        <ModalEditarEspacio isOpen={!!espacioAEditar} onClose={() => setEspacioAEditar(null)} onSuccess={() => { fetchEspacios(); setEspacioAEditar(null); }} espacio={espacioAEditar} />
        <ModalConfirmarEliminar isOpen={!!espacioABorrar} onClose={() => setEspacioABorrar(null)} onConfirm={ejecutarEliminar} nombreEspacio={espacioABorrar?.nombre || ""} />
        <ModalActualizarEstado isOpen={!!espacioEstado} onClose={() => setEspacioEstado(null)} onSuccess={() => { fetchEspacios(); setEspacioEstado(null); }} espacio={espacioEstado} />
      </div>
    </>
  );
};

export default EspaciosPage;