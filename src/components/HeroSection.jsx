import React from 'react';
import './HeroSection.css';
import ilustracaoHero from '../assets/banner.png';

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
        <div className="hero-actions">
          <button className="btn-how-it-works">Como funciona?</button>
        </div>
      </div>
      
      <div className="hero-image-container">
        <img 
          src={ilustracaoHero} 
          alt="Banner Principal" 
          className="hero-main-img" 
        />
      </div>
    </section>
  );
};

export default HeroSection;