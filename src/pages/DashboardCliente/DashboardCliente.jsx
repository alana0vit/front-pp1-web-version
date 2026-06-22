import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import DetalhesSolicitacao from '../DetalhesSolicitacao/DetalhesSolicitacao';
import './DashboardCliente.css';

function DashboardCliente() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('ATIVAS');
  const [pedidoDetalhado, setPedidoDetalhado] = useState(null);
  const [buscaTexto, setBuscaTexto] = useState('');

  const [pedidoParaAvaliar, setPedidoParaAvaliar] = useState(null);
  const [estrelas, setEstrelas] = useState(5);
  const [comentario, setComentario] = useState('');
  const [anonimo, setAnonimo] = useState(false);
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

  const [avaliacoes, setAvaliacoes] = useState({});

  const [cardSelecionado, setCardSelecionado] = useState('ANDAMENTO');

  const userStorage = localStorage.getItem('@ConectaPro:user');
  const usuarioLogado = userStorage && userStorage !== "undefined" ? JSON.parse(userStorage) : null;
  const clienteId = usuarioLogado?.id;

  const buscarMeusPedidos = async () => {
    if (!clienteId) return;

    try {
      setLoading(true);
      const response = await api.get('/api/demand/user');

      const dadosSeguros = Array.isArray(response.data) ? response.data : [];

      const meusPedidos = dadosSeguros
        .filter(d => {
          const idCli = d.client?.id || d.clientId?.id || d.clientId;
          return Number(idCli) === Number(clienteId);
        })
        .sort((a, b) => (b.id || 0) - (a.id || 0));

      setPedidos(meusPedidos);
    } catch (err) {
      console.error("Erro ao carregar demandas:", err);
      toast.error("Erro ao carregar os seus serviços.");
    } finally {
      setLoading(false);
    }
  };

  const buscarAvaliacoes = async () => {
    if (!clienteId) return;
    try {
      const res = await api.get(`/api/rating/user/${clienteId}/evaluator`);
      const ratings = Array.isArray(res.data) ? res.data : [];
      const mapa = {};
      ratings.forEach(r => {
        if (r.service && r.service.id && r.points != null) {
          mapa[r.service.id] = r.points;
        }
      });
      setAvaliacoes(mapa);
    } catch (err) {
      console.error("Erro ao carregar avaliações:", err);
    }
  };
  useEffect(() => {
    buscarMeusPedidos();
    buscarAvaliacoes();
  }, [clienteId]);

  const traduzirStatus = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'ABERTO' || s === '1' || s === 'OPENED') return 'Aguardando Resposta';
    if (s === 'AGUARDANDO' || s === '3' || s === 'IN_WAITING') return 'Em Andamento';
    if (s === 'FECHADO' || s === '0' || s === 'CLOSED') return 'Concluída';
    if (s === 'REJEITADO' || s === '2' || s === 'REJECTED') return 'Recusada';
    return s;
  };

  const enviarAvaliacaoSistema = async (e) => {
    e.preventDefault();
    if (!pedidoParaAvaliar) return;

    const professionalId = pedidoParaAvaliar.professionalId?.id || pedidoParaAvaliar.professionalId;

    if (!professionalId) {
      toast.error("Não foi possível identificar o profissional associado a este serviço.");
      return;
    }

    try {
      setEnviandoAvaliacao(true);

      const payloadCriar = {
        service: Number(pedidoParaAvaliar.id),
        evaluatingPerson: Number(clienteId),
        personEvaluated: Number(professionalId)
      };

      const resRating = await api.post("/api/rating", payloadCriar);
      const ratingIdGerado = resRating.data.id;

      const payloadConcluir = {
        approved: true,
        points: Number(estrelas),
        description: comentario.trim(),
        anonymous: Boolean(anonimo)
      };

      await api.put(`/api/rating/${ratingIdGerado}`, payloadConcluir);

      setAvaliacoes(prev => ({ ...prev, [pedidoParaAvaliar.id]: Number(estrelas) }));

      toast.success("Avaliação enviada com sucesso! Obrigado pelo seu feedback.");

      setPedidoParaAvaliar(null);
      setComentario('');
      setEstrelas(5);
      setAnonimo(false);
    } catch (err) {
      console.error("Erro ao processar avaliação:", err);
      toast.error("Ocorreu uma falha ao registrar sua avaliação no banco.");
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    const status = String(p.demandStatus || '').toUpperCase();
    const matchesTexto = p.title?.toLowerCase().includes(buscaTexto.toLowerCase());

    if (!matchesTexto) return false;

    if (abaAtiva === 'ATIVAS') {
      return status === 'ABERTO' || status === '1' || status === 'OPENED' ||
        status === 'AGUARDANDO' || status === '3' || status === 'IN_WAITING';
    }
    if (abaAtiva === 'HISTORICO') {
      return status === 'FECHADO' || status === '0' || status === 'CLOSED' ||
        status === 'REJEITADO' || status === '2' || status === 'REJECTED';
    }
    return true;
  });

  const emAndamento = pedidos.filter(p => {
    const s = String(p.demandStatus || '').toUpperCase();
    return s === 'AGUARDANDO' || s === '3' || s === 'IN_WAITING';
  }).length;

  const aguardando = pedidos.filter(p => {
    const s = String(p.demandStatus || '').toUpperCase();
    return s === 'ABERTO' || s === '1' || s === 'OPENED';
  }).length;

  const concluidos = pedidos.filter(p => {
    const s = String(p.demandStatus || '').toUpperCase();
    return s === 'FECHADO' || s === '0' || s === 'CLOSED';
  }).length;

  return (
    <div className="premium-dashboard-wrapper">

      <header className="dashboard-welcome-banner">
        <div className="welcome-left-content">
          <h1>
            Olá, <span className="user-name-highlight">{usuarioLogado?.name || 'Cliente'}</span>
          </h1>
          <p>Acompanhe o status e a execução dos seus serviços em tempo real.</p>
        </div>
        <button className="btn-edit-profile-top" onClick={() => navigate('/editar-perfil')}>
          <i className="bi bi-person-gear"></i>
          Editar Meu Perfil
        </button>
      </header>

      <div className="section-context-title">
        <h2>Como estão seus serviços?</h2>
      </div>

      <div className="dashboard-main-grid-layout">

        <aside className="sidebar-status-controls">
          <button className="btn-primary-solicitar-new" onClick={() => navigate('/lista-profissionais')}>
            <i className="bi bi-plus-circle-fill"></i> Solicitar Novo Serviço
          </button>

          <div className="status-cards-vertical-stack">
            <div
              className={`premium-status-card card-blue-theme ${abaAtiva === 'ATIVAS' && cardSelecionado === 'ANDAMENTO' ? 'active-card' : ''}`}
              onClick={() => {
                setAbaAtiva('ATIVAS');
                setCardSelecionado('ANDAMENTO');
              }}
            >
              <span className="status-counter-number">{emAndamento}</span>
              <div className="status-meta-info">
                <span className="status-counter-label">Em Andamento</span>
                <span className="status-counter-subtext">Serviços ativos em execução</span>
              </div>
              <div className="status-icon-box"><i className="bi bi-play-circle-fill"></i></div>
            </div>

            <div
              className={`premium-status-card card-amber-theme ${abaAtiva === 'ATIVAS' && cardSelecionado === 'AGUARDANDO' ? 'active-card' : ''}`}
              onClick={() => {
                setAbaAtiva('ATIVAS');
                setCardSelecionado('AGUARDANDO');
              }}
            >
              <span className="status-counter-number">{aguardando}</span>
              <div className="status-meta-info">
                <span className="status-counter-label">Aguardando Aceitação</span>
                <span className="status-counter-subtext">Aguardando retorno do profissional</span>
              </div>
              <div className="status-icon-box"><i className="bi bi-clock-fill"></i></div>
            </div>

            <div
              className={`premium-status-card card-green-theme ${abaAtiva === 'HISTORICO' ? 'active-card' : ''}`}
              onClick={() => {
                setAbaAtiva('HISTORICO');
                setCardSelecionado('FINALIZADOS');
              }}
            >
              <span className="status-counter-number">{concluidos}</span>
              <div className="status-meta-info">
                <span className="status-counter-label">Serviços Finalizados</span>
                <span className="status-counter-subtext">Histórico de chamados encerrados</span>
              </div>
              <div className="status-icon-box"><i className="bi bi-check-circle-fill"></i></div>
            </div>
          </div>
        </aside>

        <main className="main-content-orders-area">
          <div className="orders-board-card">

            <div className="orders-board-header">
              <h3>Listagem de Pedidos</h3>

              <div className="search-and-refresh-container">
                <div className="search-input-relative-box">
                  <i className="bi bi-search search-inner-icon"></i>
                  <input
                    type="text"
                    placeholder="Filtrar por título..."
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                    className="premium-search-input"
                  />
                </div>
                <button
                  className="btn-refresh-dashboard"
                  onClick={() => { buscarMeusPedidos(); buscarAvaliacoes(); }}
                  disabled={loading}
                  title="Atualizar chamados"
                >
                  <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i>
                </button>
              </div>
            </div>

            <div className="premium-tabs-bar">
              <button
                className={`tab-link-item ${abaAtiva === 'ATIVAS' ? 'is-active' : ''}`}
                onClick={() => {
                  setAbaAtiva('ATIVAS');
                  setCardSelecionado('ANDAMENTO');
                }}
              >
                Chamados Ativos
              </button>
              <button
                className={`tab-link-item ${abaAtiva === 'HISTORICO' ? 'is-active' : ''}`}
                onClick={() => {
                  setAbaAtiva('HISTORICO');
                  setCardSelecionado('FINALIZADOS');
                }}
              >
                Histórico e Rejeitados
              </button>
            </div>

            {loading ? (
              <div className="dashboard-state-feedback">
                <div className="spinner-loader-sml"></div>
                <p>Buscando suas solicitações com segurança...</p>
              </div>
            ) : pedidosFiltrados.length === 0 ? (
              <div className="premium-empty-state-container">
                <div className="empty-state-icon-circle">
                  <i className="bi bi-inbox"></i>
                </div>
                <h4>Nenhum chamado encontrado</h4>
                <p>Não há registros correspondentes para exibir nesta aba no momento.</p>
              </div>
            ) : (
              <div className="premium-dynamic-list-container">
                {pedidosFiltrados.map(pedido => {
                  const statusAtual = String(pedido.demandStatus || '').toUpperCase();
                  const notaAvaliacao = avaliacoes[pedido.id];  // undefined se não avaliado, número se avaliado

                  return (
                    <div
                      key={pedido.id}
                      className="premium-order-row-item"
                      onClick={() => setPedidoDetalhado(pedido)}
                    >
                      <div className="row-item-top-flex">
                        <h4>{pedido.title}</h4>
                        <span className={`status-pill-badge ${statusAtual === '1' || statusAtual === 'ABERTO' || statusAtual === 'OPENED' ? 'pill-opened' : statusAtual === '3' || statusAtual === 'AGUARDANDO' || statusAtual === 'IN_WAITING' ? 'pill-waiting' : statusAtual === '0' || statusAtual === 'FECHADO' || statusAtual === 'CLOSED' ? 'pill-closed' : 'pill-rejected'}`}>
                          {traduzirStatus(pedido.demandStatus)}
                        </span>
                      </div>

                      {pedido.professionalId?.name && (
                        <p className="row-item-professional-meta">
                          <i className="bi bi-person-badge"></i> Profissional: <strong>{pedido.professionalId.name}</strong>
                          {pedido.professionalId.phone && (
                            <span className="phone-sub-span">
                              <i className="bi bi-telephone"></i> {pedido.professionalId.phone}
                            </span>
                          )}
                        </p>
                      )}

                      <p className="row-item-truncated-description">
                        {pedido.description}
                      </p>

                      <div className="row-item-footer-actions" onClick={(e) => e.stopPropagation()}>
                        <span className="btn-trigger-view-more" onClick={() => setPedidoDetalhado(pedido)}>
                          <i className="bi bi-eye"></i> Ver mais detalhes
                        </span>

                        {(statusAtual === 'FECHADO' || statusAtual === 'CLOSED' || statusAtual === '0') && (
                          notaAvaliacao != null ? (
                            <span className="avaliacao-exibida">
                              {[1, 2, 3, 4, 5].map(star => (
                                <i
                                  key={star}
                                  className={`bi ${star <= notaAvaliacao ? 'bi-star-fill' : 'bi-star'} ${star <= notaAvaliacao ? 'active-star' : 'regular-star'}`}
                                ></i>
                              ))}
                              <span className="avaliado-texto">Avaliado</span>
                            </span>
                          ) : (
                            <button
                              className="btn-action-trigger-rating"
                              onClick={() => setPedidoParaAvaliar(pedido)}
                            >
                              <i className="bi bi-star-fill"></i> Avaliar Serviço
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </main>
      </div>

      {pedidoDetalhado && (
        <div className="modal-overlay-blur" onClick={() => setPedidoDetalhado(null)}>
          <div className="modal-sheet-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <h3>Detalhes da Solicitação</h3>
              <button className="btn-modal-close-round" onClick={() => setPedidoDetalhado(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-sheet-body">
              <div className="meta-field-group">
                <label>Título do Chamado</label>
                <p className="field-title-highlight">{pedidoDetalhado.title}</p>
              </div>

              <div className="meta-field-group">
                <label>Status Atual</label>
                <div style={{ marginTop: '6px' }}>
                  <span className={`status-pill-badge ${String(pedidoDetalhado.demandStatus).toUpperCase() === '1' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'ABERTO' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'OPENED' ? 'pill-opened' : String(pedidoDetalhado.demandStatus).toUpperCase() === '3' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'AGUARDANDO' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'IN_WAITING' ? 'pill-waiting' : String(pedidoDetalhado.demandStatus).toUpperCase() === '0' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'FECHADO' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'CLOSED' ? 'pill-closed' : 'pill-rejected'}`}>
                    {traduzirStatus(pedidoDetalhado.demandStatus)}
                  </span>
                </div>
              </div>

              {pedidoDetalhado.professionalId?.name && (
                <div className="meta-field-group">
                  <label>Profissional Designado</label>
                  <p className="field-text-normal">
                    <strong>{pedidoDetalhado.professionalId.name}</strong>
                    <span className="phone-sub-span">
                      <i className="bi bi-telephone"></i> {pedidoDetalhado.professionalId.phone || 'Sem telefone'}
                    </span>
                  </p>
                </div>
              )}

              <div className="meta-field-group">
                <label>Descrição Detalhada do Problema</label>
                <div className="field-box-description-content">
                  {pedidoDetalhado.description}
                </div>
              </div>

              <div className="modal-sheet-footer-actions">
                {(String(pedidoDetalhado.demandStatus).toUpperCase() === 'OPENED' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'ABERTO' || String(pedidoDetalhado.demandStatus).toUpperCase() === '1') && (
                  <button
                    className="btn-modal-submit-primary"
                    onClick={() => {
                      setPedidoDetalhado(null);
                      navigate(`/editar-demanda/${pedidoDetalhado.id}`);
                    }}
                  >
                    <i className="bi bi-pencil-square"></i> Editar Esta Solicitação
                  </button>
                )}

                {(String(pedidoDetalhado.demandStatus).toUpperCase() === 'REJECTED' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'REJEITADO' || String(pedidoDetalhado.demandStatus).toUpperCase() === '2') && (
                  <button
                    className="btn-modal-submit-success"
                    onClick={() => {
                      setPedidoDetalhado(null);
                      navigate('/lista-profissionais', { state: { reassignDemandId: pedidoDetalhado.id } });
                    }}
                  >
                    <i className="bi bi-arrow-left-right"></i> Solicitar a Outro Profissional
                  </button>
                )}

                {(String(pedidoDetalhado.demandStatus).toUpperCase() === 'IN_WAITING' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'AGUARDANDO' || String(pedidoDetalhado.demandStatus).toUpperCase() === '3') && (
                  <DetalhesSolicitacao demanda={pedidoDetalhado} modo="CLIENTE" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {pedidoParaAvaliar && (
        <div className="modal-overlay-blur" onClick={() => setPedidoParaAvaliar(null)}>
          <div className="modal-sheet-container" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <h3>Avaliar Prestador de Serviço</h3>
              <button className="btn-modal-close-round" onClick={() => setPedidoParaAvaliar(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={enviarAvaliacaoSistema} className="modal-sheet-body form-gap-layout">
              <p className="form-intro-context-text">
                Conte-nos como foi a sua experiência com o profissional <strong>{pedidoParaAvaliar.professionalId?.name || 'parceiro'}</strong> no serviço <em>"{pedidoParaAvaliar.title}"</em>.
              </p>

              <div className="rating-selector-score-box">
                <label>SUA NOTA</label>
                <div className="stars-row-layout">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <i
                      key={num}
                      className={num <= estrelas ? "bi bi-star-fill active-star" : "bi bi-star regular-star"}
                      onClick={() => setEstrelas(num)}
                    ></i>
                  ))}
                </div>
                <span className="rating-score-qualifier-label">
                  {estrelas === 5 ? 'Excelente!' : estrelas === 4 ? 'Muito Bom' : estrelas === 3 ? 'Regular' : estrelas === 2 ? 'Ruim' : 'Muito Ruim'}
                </span>
              </div>

              <div className="meta-field-group">
                <label>COMENTÁRIO / CRÍTICA</label>
                <textarea
                  rows="4"
                  placeholder="Deixe o seu feedback detalhado aqui..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required
                  className="premium-textarea-input"
                ></textarea>
              </div>

              <div className="anonymous-checkbox-row-wrapper">
                <input
                  type="checkbox"
                  id="chkAnonimo"
                  checked={anonimo}
                  onChange={(e) => setAnonimo(e.target.checked)}
                />
                <label htmlFor="chkAnonimo">
                  Enviar esta avaliação de forma anônima
                </label>
              </div>

              <button
                type="submit"
                className="btn-submit-rating-form"
                disabled={enviandoAvaliacao}
              >
                {enviandoAvaliacao ? (
                  <>
                    <span className="spinner-loader-sml input-loader"></span>
                    Registrando Nota...
                  </>
                ) : "Submeter Avaliação"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardCliente;
