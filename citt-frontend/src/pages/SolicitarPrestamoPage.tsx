import React from "react";
import { AppLayout } from "../componentes/AppLayout";
import { CatalogoArticulos } from "../componentes/CatalogoArticulos";

export const SolicitarPrestamoPage: React.FC = () => {
  return (
    <AppLayout
      titulo="Solicitar Préstamo"
      breadcrumb="Inicio / Solicitar Préstamo"
    >
      <CatalogoArticulos />
    </AppLayout>
  );
};
