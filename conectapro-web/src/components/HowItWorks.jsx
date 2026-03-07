import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <h2 className="section-title">SEU SERVIÇO COMEÇA AQUI!</h2>
      
      <div className="steps-container">
        {/* Passo 1 */}
        <div className="step-card">
          <div className="step-icon-wrapper">
            <span className="step-number">1</span>
            <div className="icon-placeholder">📱</div>
          </div>
          <h3>Conexão instantânea</h3>
          <p>Clientes e profissionais encontram-se rapidamente.</p>
        </div>

        {/* Passo 2 */}
        <div className="step-card">
          <div className="step-icon-wrapper">
            <span className="step-number">2</span>
            <div className="icon-placeholder">🔍</div>
          </div>
          <h3>Escolha certa</h3>
          <p>Compare perfis e avaliações para tomar a melhor decisão.</p>
        </div>

        {/* Passo 3 */}
        <div className="step-card">
          <div className="step-icon-wrapper">
            <span className="step-number">3</span>
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