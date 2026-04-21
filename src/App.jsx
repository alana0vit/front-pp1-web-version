import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes Globais
import Footer from './components/Footer';
import Header from './components/Header';

// Páginas Originais
import Cadastro from './pages/Cadastro/Cadastro';
import FAQ from './pages/FAQ/FAQ';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';

// Suas Páginas (Transplantadas e Corrigidas)
import DashboardCliente from './pages/DashboardCliente/DashboardCliente';
import EditarPerfil from './pages/EditarPerfil/EditarPerfil';
import EsqueceuSenha from './pages/EsqueceuSenha/EsqueceuSenha';
import ListaProf from './pages/ListaProf/ListaProf';
import PerfilCliente from './pages/PerfilCliente/PerfilCliente';
import PerfilProfissional from './pages/PerfilProfissional/PerfilProfissional';
import SolicServico from './pages/SolicServico/SolicServico';

// Estilos globais
import './App.css';

function App() {
  return (
    <Router>
      {/* Alertas visuais do sistema */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Header />
      
      <main className="main-content">
        <Routes>
          {/* Início e Institucional */}
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />

          {/* Busca e Contratação */}
          <Route path="/lista-profissionais" element={<ListaProf />} />
          <Route path="/perfil-profissional" element={<PerfilProfissional />} />
          <Route path="/solicitar-servico" element={<SolicServico />} />

          {/* Gestão e Dashboard */}
          <Route path="/dashboard" element={<DashboardCliente />} />
          <Route path="/perfil-cliente" element={<PerfilCliente />} />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;