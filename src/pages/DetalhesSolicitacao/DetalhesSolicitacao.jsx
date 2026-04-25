import React from 'react';
import './DetalhesSolicitacao.css';

function DetalhesSolicitacao({ demanda, modo }) {
  // 'modo' pode ser 'CLIENTE' (vendo dados do prof) ou 'PROFISSIONAL' (vendo dados do cliente)
  
  const exibirPessoa = modo === 'CLIENTE' ? demanda.professional : demanda.client;
  const tituloRelacao = modo === 'CLIENTE' ? "Profissional Designado" : "Dados do Solicitante";

  return (
    <div className="card-detalhes-contato">
      <div className="header-match">
        <div className="badge-andamento">SESSÃO EM ANDAMENTO</div>
        <h3>{tituloRelacao}</h3>
      </div>

      <div className="corpo-detalhes">
        <div className="info-principal">
          <div className="avatar-fake">
            {exibirPessoa?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h4>{exibirPessoa?.name || "Usuário ConectaPro"}</h4>
            <p className="especialidade">
              {modo === 'CLIENTE' ? (demanda.category?.name || "Especialista") : "Cliente Verificado"}
            </p>
          </div>
        </div>

        <div className="grid-contatos">
          <div className="item-contato">
            <i className="bi bi-whatsapp"></i>
            <div>
              <span>WhatsApp / Telefone</span>
              <p>{exibirPessoa?.phone || "(00) 00000-0000"}</p>
            </div>
          </div>

          <div className="item-contato">
            <i className="bi bi-envelope-at"></i>
            <div>
              <span>E-mail de Contacto</span>
              <p>{exibirPessoa?.email || "contato@email.com"}</p>
            </div>
          </div>
        </div>

        {modo === 'PROFISSIONAL' && (
          <div className="endereco-servico">
            <i className="bi bi-geo-alt"></i>
            <div>
              <span>Local do Serviço</span>
              <p>
                {demanda.address?.street}, {demanda.address?.number} - {demanda.address?.city}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="footer-detalhes">
        <p>Combine os detalhes finais, valores e horários diretamente pelo WhatsApp.</p>
        <a 
          href={`https://wa.me/${exibirPessoa?.phone?.replace(/\D/g, '')}`} 
          target="_blank" 
          rel="noreferrer"
          className="btn-whatsapp-direto"
        >
          <i className="bi bi-chat-dots"></i> Iniciar Conversa
        </a>
      </div>
    </div>
  );
}

export default DetalhesSolicitacao;