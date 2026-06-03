import React from "react";
import "./DetalhesSolicitacao.css";

function DetalhesSolicitacao({ demanda, modo }) {
  // 'modo' pode ser 'CLIENTE' (vendo dados do prof) ou 'PROFISSIONAL' (vendo dados do cliente)

  // Extração segura das entidades para evitar quebras se vierem nulas do banco
  const exibirPessoa =
    modo === "CLIENTE" ? demanda?.professional : demanda?.client;
  const tituloRelacao =
    modo === "CLIENTE" ? "Profissional Designado" : "Dados do Solicitante";

  // Fallback para a inicial do avatar
  const inicialNome = exibirPessoa?.name
    ? exibirPessoa.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="card-detalhes-contato">
      <div className="header-match">
        <div className="badge-andamento">SESSÃO EM ANDAMENTO</div>
        <h3>{tituloRelacao}</h3>
      </div>

      <div className="corpo-detalhes">
        <div className="info-principal">
          <div className="avatar-fake">{inicialNome}</div>
          <div>
            <h4>{exibirPessoa?.name || "Usuário ConectaPro"}</h4>
            <p className="especialidade">
              {modo === "CLIENTE"
                ? demanda?.category?.name || "Especialista Parceiro"
                : "Cliente Verificado"}
            </p>
          </div>
        </div>

        <div className="grid-contatos">
          <div className="item-contato">
            <i className="bi bi-whatsapp"></i>
            <div>
              <span>WhatsApp / Telefone</span>
              <p>{exibirPessoa?.phone || "Contacto não registado"}</p>
            </div>
          </div>

          <div className="item-contato">
            <i className="bi bi-envelope-at"></i>
            <div>
              <span>E-mail de Contacto</span>
              <p>{exibirPessoa?.email || "email@naoinformado.com"}</p>
            </div>
          </div>
        </div>

        {/* O profissional precisa de ver a morada completa para ir fazer o serviço */}
        {modo === "PROFISSIONAL" && demanda?.address && (
          <div className="endereco-servico">
            <i className="bi bi-geo-alt"></i>
            <div>
              <span>Local do Serviço</span>
              <p>
                {demanda.address.street || "Rua não informada"},{" "}
                {demanda.address.number || "S/N"}
                {demanda.address.neighborhood
                  ? ` - ${demanda.address.neighborhood}`
                  : ""}
                {demanda.address.city ? ` - ${demanda.address.city}` : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="footer-detalhes">
        <p>
          Combine os detalhes finais, valores e horários diretamente pelo
          WhatsApp.
        </p>
        {exibirPessoa?.phone ? (
          <a
            href={`https://wa.me/${exibirPessoa.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp-direto"
          >
            <i className="bi bi-chat-dots"></i> Iniciar Conversa
          </a>
        ) : (
          <button className="btn-whatsapp-direto disabled" disabled>
            <i className="bi bi-chat-dots"></i> Sem número disponível
          </button>
        )}
      </div>
    </div>
  );
}

export default DetalhesSolicitacao;
