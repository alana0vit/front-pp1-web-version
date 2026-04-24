import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

// Páginas
import Cadastro from "./pages/Cadastro/Cadastro";
import DashboardCliente from "./pages/DashboardCliente/DashboardCliente";
import DashboardProfissional from './pages/DashboardProfissional/DashboardProfissional';
import EditarPerfil from "./pages/EditarPerfil/EditarPerfil";
import EsqueceuSenha from "./pages/EsqueceuSenha/EsqueceuSenha";
import FaleConosco from "./pages/FaleConosco/FaleConosco";
import FAQ from "./pages/FAQ/FAQ";
import Home from "./pages/Home/Home";
import ListaProf from "./pages/ListaProf/ListaProf";
import Login from "./pages/Login/Login";
import PerfilCliente from "./pages/PerfilCliente/PerfilCliente";
import SolicServico from "./pages/SolicServico/SolicServico";
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

// Componente de Proteção: Garante que apenas Profissionais logados acedam a certas páginas
const RotaPrivadaProfissional = ({ children }) => {
  const userStorage = localStorage.getItem("@ConectaPro:user");
  const user = userStorage ? JSON.parse(userStorage) : null;
  
  if (!user || user.userType !== "PROFESSIONAL") {
    return <Navigate to="/login" />;
  }
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
        <Route path="/fale-conosco" element={<FaleConosco />} />
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
        
        {/* Rota para a lista de profissionais - Acessível apenas para Clientes */}
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

        {/* Rotas Privadas do Profissional */}
        <Route
          path="/dashboard-profissional"
          element={
            <RotaPrivadaProfissional>
              <DashboardProfissional />
            </RotaPrivadaProfissional>
          }
        />

        {/* Rota de fallback (caso a página não exista) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;