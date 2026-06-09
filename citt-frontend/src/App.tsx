import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PerfilPage from "./pages/PerfilPage";
import { AppLayout } from "./componentes/AppLayout";
import SessionTimeout from "./componentes/SessionTimeout";

// Páginas de la rama espacios
import EspaciosPage from "./pages/EspaciosPage";

// Páginas de la rama articulos
import { ArticulosPage } from "./pages/ArticulosPage";
import { SolicitarPrestamoPage } from "./pages/SolicitarPrestamoPage";
import { SolicitudesPage } from "./pages/SolicitudesPage";
import { HistorialPage } from "./pages/HistorialPage";
import { FormularioSolicitudPage } from "./pages/FormularioSolicitudPage";
import { SolicitarReservaPage } from "./pages/SolicitarReservaPage";

function App() {
  return (
    <BrowserRouter>
      <SessionTimeout />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* =========================================
            RUTAS PRIVADAS (Envueltas por AppLayout)
        ========================================= */}
        <Route element={<AppLayout />}>
          <Route path="/perfil" element={<PerfilPage />} />

          {/* Módulo de Artículos y Préstamos */}
          <Route path="/articulos" element={<ArticulosPage />} />
          <Route path="/solicitar-prestamo" element={<SolicitarPrestamoPage />} />
          <Route path="/solicitudes" element={<SolicitudesPage />} />
          <Route path="/crear-solicitud" element={<FormularioSolicitudPage />} />
          <Route path="/historial" element={<HistorialPage />} />

          {/* Módulo de Espacios */}
          <Route path="/espacios" element={<EspaciosPage />} />

          {/* Rutas en desarrollo (apuntan a PerfilPage temporalmente) */}
          <Route path="/dashboard" element={<PerfilPage />} />
          <Route path="/calendario" element={<PerfilPage />} />
          <Route path="/usuarios" element={<PerfilPage />} />
          <Route path="/prestamos" element={<PerfilPage />} />
          <Route path="/reservas" element={<PerfilPage />} />
          <Route path="/solicitar-reserva" element={<SolicitarReservaPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
