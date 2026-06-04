import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ArticulosPage } from "./pages/ArticulosPage";
import { AppLayout } from "./componentes/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/articulos" element={<ArticulosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
