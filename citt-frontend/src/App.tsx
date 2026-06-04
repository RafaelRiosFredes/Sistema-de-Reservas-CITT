import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ArticulosPage } from "./pages/ArticulosPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticulosPage />} />
        <Route path="/admin/articulos" element={<ArticulosPage />} />
        {/* Esto redirige cualquier cosa extraña a la raíz */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
