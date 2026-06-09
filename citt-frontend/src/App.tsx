import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './componentes/AppLayout';
import LoginPage from './pages/LoginPage';
import PerfilPage from './pages/perfilPage';
import UsuariosPage from './pages/UsuariosPage';
import EspaciosPage from "./pages/EspaciosPage";
import { ReservarEspacioPage } from "./pages/SolicitarReservaPage";
import { FormularioReservaEspacioPage } from "./pages/FormularioSolicitudPage";
import { ReservasPage } from "./pages/ReservasPage";
import { HistorialEspaciosPage } from "./pages/HistorialPage";
import { CalendarioPage } from "./pages/CalendarioPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* RUTAS PRIVADAS (Con el menú lateral) */}
        <Route element={<AppLayout />}>
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/espacios" element={<EspaciosPage />} />
          <Route path="/reservar-espacio" element={<ReservarEspacioPage />} />
          <Route path="/formulario-reserva" element={<FormularioReservaEspacioPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/historial-espacios" element={<HistorialEspaciosPage />} />
          <Route path="/calendario" element={<CalendarioPage />} />
        </Route>

        {/* COMODÍN */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;