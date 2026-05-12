import React from "react";

interface TablaDatosProps {
  columnas: string[];
  children: React.ReactNode; // Aquí irán las filas (<tr>)
}

const TablaDatos: React.FC<TablaDatosProps> = ({ columnas, children }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-border bg-gray-50/50">
              {columnas.map((col, index) => (
                <th
                  key={index}
                  className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">{children}</tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaDatos;
