import React from "react";
import TablaDatos from "./TablaDatos";
import BadgeEstado from "./BadgeEstado";

interface TablaArticulosLecturaProps {
  articulos: any[];
}

export const TablaArticulosLectura: React.FC<TablaArticulosLecturaProps> = ({
  articulos,
}) => {
  return (
    <TablaDatos
      columnas={[
        "Código",
        "Artículo",
        "Categoría",
        "Ubicación / Etiqueta",
        "Estado",
      ]}
    >
      {articulos.map((art) => (
        <tr
          key={art.idArticulo}
          className="hover:bg-slate-50 transition-colors"
        >
          <td className="p-4 border-b border-gray-border font-mono text-sm text-slate-500">
            {art.codigoDuoc || "N/A"}
          </td>
          <td className="p-4 border-b border-gray-border">
            <p className="font-bold text-slate-800 m-0">{art.nombreArticulo}</p>
            <p className="text-xs text-slate-400 m-0">
              {art.marca || "Genérico"}
            </p>
          </td>
          <td className="p-4 border-b border-gray-border text-sm font-medium">
            {art.categoria?.nombreCategoria || "Sin categoría"}
          </td>
          <td className="p-4 border-b border-gray-border text-sm text-slate-600">
            {art.etiqueta || "Sin asignar"}
          </td>
          <td className="p-4 border-b border-gray-border">
            <BadgeEstado estado={art.estado?.nombreEstado || "MANTENCION"} />
          </td>
        </tr>
      ))}
    </TablaDatos>
  );
};
