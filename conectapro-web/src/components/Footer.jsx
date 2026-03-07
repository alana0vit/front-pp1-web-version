import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <>
      <footer className="footer-section">
        <hr className="footer-divider" />
        
        <div className="footer-content">
          <div className="footer-column">
            <h3>Nossas Redes</h3>
            <div className="social-item">
              {/* Marian, bora trocar esses emojis pelos ícones oficiais (Insta, Whats, YouTube). Lembra também de colocar as tags <a> com os links reais para os perfis da marca! */}
              <span className="icon">📸</span>
              <p>conectaPro_26</p>
            </div>
            <div className="social-item">
              <span className="icon">💬</span>
              <p>(81) 95555-0000</p>
            </div>
            <div className="social-item">
              <span className="icon">▶️</span>
              <p>conectaPro_news</p>
            </div>
          </div>

          {/* Coluna 2: Contacto */}
          <div className="footer-column">
            <h3>Contato</h3>
            <p className="contact-info">conectaPro@conectapro.com</p>
            <p className="contact-info">3333-3333</p>
          </div>

          {/* Coluna 3: Suporte */}
          <div className="footer-column support-column">
            <h3>Suporte</h3>
            <form className="support-form">
              <input type="text" placeholder="Título do chamado" />
              <textarea placeholder="Descrição" rows="4"></textarea>
              <button type="button" className="btn-send">Enviar</button>
            </form>
          </div>
        </div>
      </footer>
      
      {/* Faixa Azul do F.A.Q */}
      <div className="faq-banner">
        <h2>F.A.Q</h2>
        <p>Veja as respostas para as perguntas mais frequentes</p>
        <div className="faq-buttons">
          <button className="btn-light">Leia já!</button>
          <button className="btn-light">Ainda em dúvida? Pergunte aqui...</button>
        </div>
      </div>
    </>
  );
};

export default Footer;