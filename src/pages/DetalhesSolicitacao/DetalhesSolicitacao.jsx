import React, { useEffect, useState } from 'react';
import './DetalhesSolicitacao.css';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';

function DetalhesSolicitacao() {
  const location = useLocation();
  const pedidoId = location.state?.pedidoId;

  const [demanda, setDemanda] = useState(null);
  const modo = 'CLIENTE'; // você pode dinamizar depois

  useEffect(() => {
    if (!pedidoId) return;

    const buscar = async () => {
      try {
        const response = await api.get(`/api/demand/user/${pedidoId}`);
        setDemanda(response.data);
      } catch (err) {
        console.error("Erro ao buscar demanda:", err);
      }
    };

    buscar();
  }, [pedidoId]);

  // ✅ proteção contra undefined
  if (!demanda) {
    return <p style={{ padding: '20px' }}>Carregando...</p>;
  }

  const exibirPessoa =
    modo === 'CLIENTE' ? demanda.professionalId : demanda.clientId;

  return (
    <div className="card-detalhes-contato">
      <div className="header-match">
        <div className="badge-andamento">SESSÃO EM ANDAMENTO</div>
      </div>

      <div className="corpo-detalhes">
        <div className="info-principal">
          <div className="avatar-fake">
            {exibirPessoa?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <h4>{exibirPessoa?.name || "Usuário ConectaPro"}</h4>
            <p className="especialidade">
              {modo === 'CLIENTE'
                ? demanda.category?.name || "Especialista"
                : "Cliente Verificado"}
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
                {demanda.address?.street}, {demanda.address?.number} -{" "}
                {demanda.address?.city}
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