import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PerfilPage from './pages/perfilPage';
import UsuariosPage from './pages/UsuariosPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;