import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./componentes/AppLayout";
import EspaciosPage from "./pages/EspaciosPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/espacios" replace />} />

        {/* RUTAS PRIVADAS (Con el menú lateral) */}
        <Route element={<MainLayout />}>
          <Route path="/espacios" element={<EspaciosPage />} />
        </Route>

        {/* COMODÍN */}
        <Route path="*" element={<Navigate to="/espacios" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;