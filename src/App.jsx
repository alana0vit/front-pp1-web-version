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
import PerfilProfissional from "./pages/PerfilProfissional/PerfilProfissional";
import SolicServico from "./pages/SolicServico/SolicServico";
import TermosDeUso from "./pages/TermosDeUso/TermosDeUso";
import DetalhesSolicitacao from "./pages/DetalhesSolicitacao/DetalhesSolicitacao";

// GUARDA 1: Apenas Clientes
const RotaPrivadaCliente = ({ children }) => {
  const userStorage = localStorage.getItem("@ConectaPro:user");
  const user = userStorage ? JSON.parse(userStorage) : null;
  
  if (!user || user.userType !== "CLIENT") return <Navigate to="/login" />;
  return children;
};

// GUARDA 2: Apenas Profissionais
const RotaPrivadaProfissional = ({ children }) => {
  const userStorage = localStorage.getItem("@ConectaPro:user");
  const user = userStorage ? JSON.parse(userStorage) : null;
  
  if (!user || user.userType !== "PROFESSIONAL") return <Navigate to="/login" />;
  return children;
};

// GUARDA 3: Qualquer Usuário Logado (Usado para o Editar Perfil)
const RotaPrivadaGeral = ({ children }) => {
  const userStorage = localStorage.getItem("@ConectaPro:user");
  const user = userStorage ? JSON.parse(userStorage) : null;
  
  if (!user) return <Navigate to="/login" />;
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

        {/* Rotas Privadas - CLIENTE */}
        <Route path="/dashboard-cliente" element={<RotaPrivadaCliente><DashboardCliente /></RotaPrivadaCliente>} />
        <Route path="/lista-profissionais" element={<RotaPrivadaCliente><ListaProf /></RotaPrivadaCliente>} />
        <Route path="/solicitar-servico" element={<RotaPrivadaCliente><SolicServico /></RotaPrivadaCliente>} />
        <Route path="/perfil" element={<RotaPrivadaCliente><PerfilCliente /></RotaPrivadaCliente>} />
        <Route path="/detalhes-solicitacao" element={<RotaPrivadaCliente><DetalhesSolicitacao /></RotaPrivadaCliente>} />

        {/* Rotas Privadas - PROFISSIONAL */}
        <Route path="/dashboard-profissional" element={<RotaPrivadaProfissional><DashboardProfissional /></RotaPrivadaProfissional>} />
        <Route path="/perfil-profissional" element={<RotaPrivadaProfissional><PerfilProfissional /></RotaPrivadaProfissional>} />

        {/* Rotas Privadas - GERAIS (Ambos acessam) */}
        <Route path="/editar-perfil" element={<RotaPrivadaGeral><EditarPerfil /></RotaPrivadaGeral>} />

        {/* Rota de fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;