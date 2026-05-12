import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";

// Interfaz para los datos que le pasaremos al gráfico
interface DatoOcupacion {
  dia: string;
  porcentaje: number;
}

interface GraficoOcupacionProps {
  datos: DatoOcupacion[];
  porcentajePromedio: number;
}

const GraficoOcupacion: React.FC<GraficoOcupacionProps> = ({
  datos,
  porcentajePromedio,
}) => {
  // Función para imitar el diseño de tu mockup:
  // Si el porcentaje es muy bajo, lo pintamos gris. Si es medio, amarillo. Si es alto, azul oscuro.
  const obtenerColorBarra = (porcentaje: number) => {
    if (porcentaje < 30) return "#E1E8ED"; // Gris claro
    if (porcentaje >= 30 && porcentaje <= 60) return "#FFC107"; // Amarillo
    return "#002B49"; // Azul oscuro institucional
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-border shadow-sm w-full h-full flex flex-col">
      {/* Cabecera del Gráfico */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary" size={20} />
          <h3 className="m-0 text-lg font-bold">Carga Semanal de Espacios</h3>
        </div>
        <span className="text-3xl font-black text-dark leading-none">
          {porcentajePromedio}%
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6 m-0">
        Ocupación promedio de laboratorios
      </p>

      {/* Contenedor del Gráfico */}
      <div className="flex-grow w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={datos}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            {/* Eje X (L, M, X, J, V) */}
            <XAxis
              dataKey="dia"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A0AEC0", fontSize: 12, fontWeight: "bold" }}
              dy={10}
            />
            {/* Tooltip al pasar el mouse */}
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E1E8ED",
                fontWeight: "bold",
              }}
              // Cambiamos 'value: number' por 'value: any' para que TypeScript no pelee con Recharts
              formatter={(value: any) => [`${value}%`, "Ocupación"]}
            />
            {/* Las Barras */}
            <Bar dataKey="porcentaje" radius={[4, 4, 4, 4]} barSize={40}>
              {datos.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={obtenerColorBarra(entry.porcentaje)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficoOcupacion;
