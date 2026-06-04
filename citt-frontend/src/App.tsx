import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./componentes/AppLayout";
import EspaciosPage from "./pages/EspaciosPage";
import { ReservarEspacioPage } from "./pages/SolicitarReservaPage";
import { FormularioReservaEspacioPage } from "./pages/FormularioSolicitudPage";
import { ReservasPage } from "./pages/ReservasPage";
import { HistorialEspaciosPage } from "./pages/HistorialPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/espacios" replace />} />

        {/* RUTAS PRIVADAS (Con el menú lateral) */}
        <Route element={<MainLayout />}>
          <Route path="/espacios" element={<EspaciosPage />} />
          <Route path="/reservar-espacio" element={<ReservarEspacioPage />} />
          <Route path="/formulario-reserva" element={<FormularioReservaEspacioPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/historial-espacios" element={<HistorialEspaciosPage />} />
        </Route>

        {/* COMODÍN */}
        <Route path="*" element={<Navigate to="/espacios" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;