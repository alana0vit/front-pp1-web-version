import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">
          Conectar <br />
          <span className="highlight-text">Contratar</span> <br />
          Resolver
        </h1>
        <p className="hero-subtitle">
          Uma plataforma que aproxima clientes e profissionais de diversas áreas, de forma simples e segura.
        </p>
        <button className="btn-how-it-works">Como funciona?</button>
      </div>
      
      <div className="hero-image">
        {/* Placeholder para a imagem. Substitua esta div pela tag <img> */}
        <div className="image-placeholder">
          Ilustração Aqui
        </div>
      </div>

    </section>
  );
};

export default HeroSection;