import React from 'react';
import './FAQ.css';
import ilustracaoImg from '../../assets/imgfaq.jpg';

function FAQ() {
  return (
    <div className="faq-page-container">
      <div className="faq-card-horizontal">
        
        <div className="faq-visual-side">
          <p className="faq-pre-title">ESTAMOS AQUI PARA TE AJUDAR!</p>
          <h1 className="faq-main-title">Atendimento ao Cliente e Suporte da Plataforma</h1>
          <p className="faq-main-text">
            Se você precisa de ajuda, quer esclarecer alguma informação ou deseja enviar uma 
            sugestão para melhorarmos a plataforma, envie sua mensagem. Nossa equipe 
            analisará seu contato com atenção e retornará o mais rápido possível.
          </p>
          <div className="faq-image-box">
             <img src={ilustracaoImg} alt="Suporte ConectaPRO" />
          </div>
        </div>

        <div className="faq-form-side">
          <form className="faq-form-style" onSubmit={(e) => e.preventDefault()}>
            <div className="faq-input-group">
              <label>Nome</label>
              <input type="text" placeholder="Digite seu nome" />
            </div>

            <div className="faq-input-group">
              <label>E-mail</label>
              <input type="email" placeholder="Digite seu e-mail" />
            </div>

            <div className="faq-input-group">
              <label>Motivo do contato</label>
              <select defaultValue="">
                <option value="" disabled>Selecione um motivo</option>
                <option value="duvida">Dúvida Geral</option>
                <option value="suporte">Suporte Técnico</option>
                <option value="sugestao">Sugestão</option>
              </select>
            </div>

            <div className="faq-input-group">
              <label>Mensagem</label>
              <textarea placeholder="Digite sua mensagem"></textarea>
            </div>

            <button type="submit" className="faq-submit-button">Enviar</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default FAQ;