import React, { useState, useEffect } from "react";
import { useSeguridad } from "../hooks/useSeguridad"; 
import { Info, DoorOpen, Briefcase, Users } from "lucide-react";
import api from "../api/axiosConfig";
import EstadoActualEspacios from "../componentes/EstadoActualEspacios";
import BarraOcupacion from "../componentes/BarraOcupacion";

import { useNavigate } from "react-router-dom";

interface Espacio {
  id: number;
  nombre: string;
  comentarios: string;
  capacidad: number;
  estado: string;
  porcentajeOcupacion?: number;
}

export const SolicitarReservaPage: React.FC = () => {
  const { isVerificando } = useSeguridad(); 
  const navigate = useNavigate();
  
  const rolActivo = localStorage.getItem("rolActivo") || "ALUMNO";
  const rolUpper = rolActivo.toUpperCase();
  
  let rolUser: "PROFESOR" | "AYUDANTE" | "ALUMNO" = "ALUMNO";
  if (rolUpper.includes("PROFESOR") || rolUpper.includes("DOCENTE")) rolUser = "PROFESOR";
  else if (rolUpper.includes("AYUDANTE")) rolUser = "AYUDANTE";
  
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const titulosPorRol = {
    PROFESOR: "Portal Docente - Espacios CITT",
    AYUDANTE: "Portal Ayudante - Espacios CITT",
    ALUMNO: "Espacios Disponibles CITT"
  };

  const subtitulosPorRol = {
    PROFESOR: "Visualiza los laboratorios operativos y gestiona las solicitudes de reserva para tus clases o proyectos.",
    AYUDANTE: "Revisa los laboratorios operativos y gestiona las solicitudes de reserva para tus ayudantías o talleres.",
    ALUMNO: "Visualiza los laboratorios operativos de la sede y gestiona tus solicitudes de reserva."
  };

  if (isVerificando) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003b73]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reserva de Espacios</h1>
        <p className="text-sm text-gray-500">Inicio / Reserva Espacios</p>
      </div>
      <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#021626] flex items-center gap-3">
              <DoorOpen size={28} className="text-blue-600" />
              {titulosPorRol[rolUser]}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {subtitulosPorRol[rolUser]}
            </p>
          </div>
        </div>

        {!isLoading && espacios.length > 0 && (
          <div className="w-full mb-2">
            <EstadoActualEspacios espacios={espacios} />
          </div>
        )}

        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">
          Detalle de Equipamiento
        </h3>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003b73]"></div>
          </div>
        ) : espacios.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 shadow-sm border border-gray-100 text-center">
            <Info size={44} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg">No hay espacios físicos registrados en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {espacios.map((espacio) => {
              const esDisponible = espacio.estado?.toUpperCase() === "DISPONIBLE";
              const porcentajeOcupacion = espacio.porcentajeOcupacion || 0; 
              
              return (
                <div 
                  key={espacio.id} 
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden"
                >
                  {!esDisponible && (
                    <div className="absolute inset-0 bg-gray-50/40 z-0 pointer-events-none"></div>
                  )}

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Sala de Innovación
                        </span>
                        <h3 className="text-xl font-bold text-[#021626]">{espacio.nombre}</h3>
                      </div>
                      {renderEstadoLocal(espacio.estado)}
                    </div>

                    <div className="flex flex-col gap-3 mb-6 flex-grow mt-2">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Users size={18} className="text-blue-600" />
                        <span className="text-sm">Capacidad: {espacio.capacidad} personas</span>
                      </div>
                      
                      <div className="flex items-start gap-3 text-gray-600">
                        <Briefcase size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm line-clamp-2">
                          {espacio.comentarios || "Sin descripción de equipamiento."}
                        </span>
                      </div>
                    </div>

                    <BarraOcupacion 
                      porcentaje={porcentajeOcupacion}
                      esDisponible={esDisponible}
                      onReservarClick={() => navigate("/crear-solicitud", { state: { idEspacio: espacio.id, nombreEspacio: espacio.nombre } })}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
