import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <h2 className="section-title">SEU SERVIÇO COMEÇA AQUI!</h2>
      
      <div className="steps-container">
        <div className="step-card">
          <div className="step-icon-wrapper">
            <span className="step-number">1</span>
            {/* Marian, substitui esse emoji por um ícone real do nosso design (pode usar o react-icons ou jogar um SVG aqui). */}
            <div className="icon-placeholder">📱</div>
          </div>
          <h3>Conexão instantânea</h3>
          <p>Clientes e profissionais encontram-se rapidamente.</p>
        </div>

        <div className="step-card">
          <div className="step-icon-wrapper">
            <span className="step-number">2</span>
            {/* Mesma coisa aqui, colocar o ícone real de lupa/pesquisa. */}
            <div className="icon-placeholder">🔍</div>
          </div>
          <h3>Escolha certa</h3>
          <p>Compare perfis e avaliações para tomar a melhor decisão.</p>
        </div>

        <div className="step-card">
          <div className="step-icon-wrapper">
            <span className="step-number">3</span>
            {/* Colocar o ícone real de calendário aqui. */}
            <div className="icon-placeholder">📅</div>
          </div>
          <h3>Agende e conclua</h3>
          <p>Organize o serviço e finalize com facilidade, sem complicações.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;