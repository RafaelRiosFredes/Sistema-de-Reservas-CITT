import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  PackageOpen, 
  ClipboardList,
  MonitorSmartphone,
  GraduationCap
} from "lucide-react";

export const AlumnoDashboard: React.FC = () => {
  const navigate = useNavigate();

  const accesosRapidos = [
    { titulo: "Mis Solicitudes Activas", ruta: "/solicitudes", icono: ClipboardList, color: "text-amber-600", bg: "bg-amber-100", desc: "Seguimiento de mis peticiones" },
    { titulo: "Calendario de Laboratorios", ruta: "/calendario", icono: Calendar, color: "text-blue-600", bg: "bg-blue-100", desc: "Ver horarios y disponibilidad" },
    { titulo: "Solicitar Espacios", ruta: "/solicitar-reserva", icono: MonitorSmartphone, color: "text-emerald-600", bg: "bg-emerald-100", desc: "Reservar para estudiar o trabajar" },
    { titulo: "Solicitar Equipamiento", ruta: "/solicitar-prestamo", icono: PackageOpen, color: "text-indigo-600", bg: "bg-indigo-100", desc: "Pedir componentes o herramientas" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">


      {/* Accesos Rápidos (Alumno) */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">¿En qué te podemos ayudar?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {accesosRapidos.map((acceso, index) => (
            <button
              key={index}
              onClick={() => navigate(acceso.ruta)}
              className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:-translate-y-2 hover:shadow-lg hover:border-gray-200 cursor-pointer group text-center"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${acceso.bg}`}>
                <acceso.icono className={`w-8 h-8 ${acceso.color}`} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-1">{acceso.titulo}</h4>
                <p className="text-sm text-gray-500">{acceso.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
