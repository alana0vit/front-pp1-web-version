import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login/Login';

// Componentes Globais
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home/Home';
import Cadastro from './pages/Cadastro/Cadastro';
import FAQ from './pages/FAQ/FAQ';

// Estilos globais
import './App.css';

function App() {
  return (
    <Router>
      {/* ToastContainer permite que os alertas bonitos apareçam em qualquer tela */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Header />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;