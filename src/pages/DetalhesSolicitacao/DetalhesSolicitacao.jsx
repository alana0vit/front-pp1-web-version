import React from "react";
import "./DetalhesSolicitacao.css";

function DetalhesSolicitacao({ demanda, modo }) {
  const exibirPessoa =
    modo === "CLIENTE" ? demanda?.professionalId : demanda?.clientId;
  const tituloRelacao =
    modo === "CLIENTE" ? "Profissional Designado" : "Dados do Solicitante";
  const inicialNome = exibirPessoa?.name
    ? exibirPessoa.name.charAt(0).toUpperCase()
    : "U";

  const endereco = demanda?.addressId; 

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
                ? demanda?.categoryId?.name || "Especialista Parceiro"
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

        {modo === "PROFISSIONAL" && endereco && (
          <div className="endereco-servico">
            <i className="bi bi-geo-alt"></i>
            <div>
              <span>Local do Serviço</span>
              <p>
                {endereco.street || "Rua não informada"},{" "}
                {endereco.number || "S/N"}
                {endereco.neighborhood
                  ? ` - ${endereco.neighborhood}`
                  : ""}
                {endereco.city ? ` - ${endereco.city}` : ""}
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
