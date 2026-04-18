import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-text">conecta</span><span className="logo-highlight">PRO.</span>
      </div>
      
      <nav className="nav-menu">
        <a href="#home" className="nav-item">Home</a>
        <a href="#sobre" className="nav-item">Sobre</a>
        <a href="#servicos" className="nav-item">Serviços</a>
        <a href="#contato" className="nav-item">Fale Conosco</a>
        <a href="#faq" className="nav-item">FAQ</a>
      </nav>

      <div className="auth-section">
        <button className="btn-login">Login</button>
      </div>
    </header>
  );
};

export default Header;