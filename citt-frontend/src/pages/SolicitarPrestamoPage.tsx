import React from "react";

import { CatalogoArticulos } from "../componentes/CatalogoArticulos";

export const SolicitarPrestamoPage: React.FC = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Solicitar Préstamo</h1>
        <p className="text-sm text-gray-500">Inicio / Solicitar Préstamo</p>
      </div>
      <CatalogoArticulos />
    </>
  );
};
