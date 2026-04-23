import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import FAQ from "./pages/FAQ/FAQ";
import DashboardProfissional from './pages/DashboardProfissional/DashboardProfissional';
import ListaProf from "./pages/ListaProf/ListaProf";
import SolicServico from "./pages/SolicServico/SolicServico";
import DashboardCliente from "./pages/DashboardCliente/DashboardCliente";
import PerfilCliente from "./pages/PerfilCliente/PerfilCliente";
import EditarPerfil from "./pages/EditarPerfil/EditarPerfil";
import EsqueceuSenha from "./pages/EsqueceuSenha/EsqueceuSenha";
import TermosDeUso from "./pages/TermosDeUso/TermosDeUso";

// Componente de Proteção: Garante que apenas Clientes logados acedam a certas páginas
const RotaPrivadaCliente = ({ children }) => {
  const userStorage = localStorage.getItem("@ConectaPro:user");
  const user = userStorage ? JSON.parse(userStorage) : null;

  // Verifica se o utilizador existe e se o tipo é CLIENT
  if (!user || user.userType !== "CLIENT") {
    return <Navigate to="/login" />;
  }

  return children;
};

const RotaPrivadaProfissional = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("@ConectaPro:user"));
  if (!user || user.userType !== "PROFESSIONAL")
    return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />

        {/* Rotas Privadas do Cliente */}
        <Route
          path="/dashboard-cliente"
          element={
            <RotaPrivadaCliente>
              <DashboardCliente />
            </RotaPrivadaCliente>
          }
        />
        <Route
          path="/lista-profissionais"
          element={
            <RotaPrivadaCliente>
              <ListaProf />
            </RotaPrivadaCliente>
          }
        />
        <Route
          path="/solicitar-servico"
          element={
            <RotaPrivadaCliente>
              <SolicServico />
            </RotaPrivadaCliente>
          }
        />
        <Route
          path="/perfil"
          element={
            <RotaPrivadaCliente>
              <PerfilCliente />
            </RotaPrivadaCliente>
          }
        />
        <Route
          path="/editar-perfil"
          element={
            <RotaPrivadaCliente>
              <EditarPerfil />
            </RotaPrivadaCliente>
          }
        />

        {/* Rota de fallback (caso a página não exista) */}
        <Route path="*" element={<Navigate to="/" />} />

        <Route
          path="/dashboard-profissional"
          element={
            <RotaPrivadaProfissional>
              <DashboardProfissional />
            </RotaPrivadaProfissional>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
