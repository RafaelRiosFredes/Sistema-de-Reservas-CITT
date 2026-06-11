import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  PackageOpen, 
  History,
  MonitorSmartphone
} from "lucide-react";

export const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();

  const accesosRapidos = [
    { titulo: "Calendario de Actividades", ruta: "/calendario", icono: Calendar, color: "text-blue-600", bg: "bg-blue-100", desc: "Revisar programación" },
    { titulo: "Reserva de Espacios", ruta: "/solicitar-reserva", icono: MonitorSmartphone, color: "text-emerald-600", bg: "bg-emerald-100", desc: "Agendar laboratorios" },
    { titulo: "Préstamo de Recursos", ruta: "/solicitar-prestamo", icono: PackageOpen, color: "text-amber-600", bg: "bg-amber-100", desc: "Pedir equipamiento" },
    { titulo: "Historial de Ocupación", ruta: "/historial-espacios", icono: History, color: "text-indigo-600", bg: "bg-indigo-100", desc: "Revisar registros pasados" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">


      {/* Accesos Rápidos (Staff) */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">¿Qué necesitas hacer hoy?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {accesosRapidos.map((acceso, index) => (
            <button
              key={index}
              onClick={() => navigate(acceso.ruta)}
              className="flex flex-col items-start gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-blue-200 cursor-pointer group text-left"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${acceso.bg}`}>
                <acceso.icono className={`w-7 h-7 ${acceso.color}`} />
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
