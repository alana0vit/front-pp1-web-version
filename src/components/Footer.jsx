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
              <span className="bi bi-instagram"></span>
              <a href="https://www.instagram.com/conectaPro_26" target="_blank" rel="noreferrer">ConectaPro</a>
            </div>
            <div className="social-item">
              <span className="bi bi-whatsapp"></span>
              <a href="https://wa.me/5581955550000" target="_blank" rel="noreferrer">(81) 95555-0000</a>
            </div>
            <div className="social-item">
              <span className="bi bi-newspaper"></span>
              <a href="#news">ConectaPro_News</a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Contato</h3>
            <div className="social-item">
              <span className="bi bi-envelope"></span>
              <a href="mailto:conectaPro@conectapro.com">conectaPro@conectapro.com</a>
            </div>
            <div className="social-item">
              <span className="bi bi-telephone"></span>
              <a href="tel:08133333333">3333-3333</a>
            </div>
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