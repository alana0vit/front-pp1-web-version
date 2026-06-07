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

  // Estados para o Modal de Avaliação
  const [pedidoParaAvaliar, setPedidoParaAvaliar] = useState(null);
  const [estrelas, setEstrelas] = useState(5);
  const [comentario, setComentario] = useState('');
  const [anonimo, setAnonimo] = useState(false);
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);
  
  // Estado para sumir com o botão imediatamente após avaliar
  const [demandasAvaliadas, setDemandasAvaliadas] = useState([]);

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

  useEffect(() => {
    buscarMeusPedidos();
  }, [clienteId]);

  const traduzirStatus = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'ABERTO' || s === '1' || s === 'OPENED') return 'Aguardando Resposta';
    if (s === 'AGURADANDO' || s === '3' || s === 'IN_WAITING') return 'Em Andamento';
    if (s === 'FECHADO' || s === '0' || s === 'CLOSED') return 'Concluída';
    if (s === 'REJEITADO' || s === '2' || s === 'REJECTED') return 'Recusada';
    return s;
  };

  const enviarAvaliacaoSistema = async (e) => {
    e.preventDefault();
    if (!pedidoParaAvaliar) return;

    const professionalId = pedidoParaAvaliar.professional?.id || pedidoParaAvaliar.professionalId?.id || pedidoParaAvaliar.professionalId;

    if (!professionalId) {
      toast.error("Não foi possível identificar o profissional associado a este serviço.");
      return;
    }

    try {
      setEnviandoAvaliacao(true);

      // Passo 1: Criar a avaliação pendente vinculando as partes
      const payloadCriar = {
        service: Number(pedidoParaAvaliar.id),
        evaluatingPerson: Number(clienteId),
        personEvaluated: Number(professionalId)
      };

      const resRating = await api.post("/api/rating", payloadCriar);
      const ratingIdGerado = resRating.data.id;

      // Passo 2: Enviar a nota (points) e consolidar
      const payloadConcluir = {
        approved: true,
        points: Number(estrelas),
        description: comentario.trim(),
        anonymous: Boolean(anonimo)
      };

      await api.put(`/api/rating/${ratingIdGerado}`, payloadConcluir);

      // Adiciona o ID do chamado na lista de avaliados para sumir com o botão visualmente
      setDemandasAvaliadas(prev => [...prev, Number(pedidoParaAvaliar.id)]);

      toast.success("Avaliação enviada com sucesso! Obrigado pelo seu feedback.");
      
      // Resetar os campos do formulário e fechar modal
      setPedidoParaAvaliar(null);
      setComentario('');
      setEstrelas(5);
      setAnonimo(false);
      
      // Atualiza a lista do dashboard
      buscarMeusPedidos();
    } catch (err) {
      console.error("Erro ao processar avaliação:", err);
      toast.error("Ocorreu uma falha ao registrar sua avaliação no banco.");
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    const status = String(p.demandStatus || '').toUpperCase();
    const matchesTexto = p.title.toLowerCase().includes(buscaTexto.toLowerCase());
    
    if (!matchesTexto) return false;

    if (abaAtiva === 'ATIVAS') {
      return status === 'ABERTO' || status === '1' || status === 'OPENED' || 
             status === 'AGURADANDO' || status === '3' || status === 'IN_WAITING';
    }
    if (abaAtiva === 'HISTORICO') {
      return status === 'FECHADO' || status === '0' || status === 'CLOSED' || 
             status === 'REJEITADO' || status === '2' || status === 'REJECTED';
    }
    return true;
  });

  const emAndamento = pedidos.filter(p => {
    const s = String(p.demandStatus || '').toUpperCase();
    return s === 'AGURADANDO' || s === '3' || s === 'IN_WAITING';
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
    <div className="container-dashboard">
      
      <section className="secao-topo-branco">
        <div className="conteudo-introducao">
          <div className="lado-esquerdo-texto">
            <h1 className="titulo-principal-destaque">
              Olá, <span className="sublinhado-azul-transparente">{usuarioLogado?.name || 'Cliente'}</span>
            </h1>
            <p className="subtitulo-detalhado">
              Acompanhe cada etapa com total segurança, integridade e transparência.
            </p>
          </div>
          <div className="lado-direito-imagem">
            <button 
              className="btn-cancelar" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '50px' }}
              onClick={() => navigate('/editar-perfil')}
            >
              <i className="bi bi-person-gear" style={{ color: '#0066ff', fontSize: '18px' }}></i>
              Editar Meu Perfil
            </button>
          </div>
        </div>
      </section>

      <section className="secao-servicos-cinza">
        <div className="cabecalho-servicos">
          <h2>Como estão seus serviços?</h2>
        </div>

        <button className="btn-azul-solicitar" onClick={() => navigate('/lista-profissionais')}>
          <i className="bi bi-plus-circle"></i> Solicitar Novo Serviço
        </button>

        <div className="layout-dashboard-baixo">
          
          <aside className="coluna-status">
            <div className="cartao-contador-status" onClick={() => setAbaAtiva('ATIVAS')}>
              <span className="numero-status">{emAndamento}</span>
              <div>
                <strong style={{ display: 'block', color: '#111' }}>Em Andamento</strong>
                <span style={{ fontSize: '13px', color: '#666' }}>Serviços ativos em execução</span>
              </div>
              <i className="bi bi-play-circle-fill icone-status-azul"></i>
            </div>

            <div className="cartao-contador-status" onClick={() => setAbaAtiva('ATIVAS')}>
              <span className="numero-status">{aguardando}</span>
              <div>
                <strong style={{ display: 'block', color: '#111' }}>Aguardando Aceitação</strong>
                <span style={{ fontSize: '13px', color: '#666' }}>Aguardando retorno do profissional</span>
              </div>
              <i className="bi bi-clock-fill icone-status-amarelo"></i>
            </div>

            <div className="cartao-contador-status" onClick={() => setAbaAtiva('HISTORICO')}>
              <span className="numero-status">{concluidos}</span>
              <div>
                <strong style={{ display: 'block', color: '#111' }}>Serviços Finalizados</strong>
                <span style={{ fontSize: '13px', color: '#666' }}>Histórico de chamados encerrados</span>
              </div>
              <i className="bi bi-check-circle-fill icone-status-verde"></i>
            </div>
          </aside>

          <main className="coluna-pedidos-recentes">
            <div className="cartao-pedidos-painel">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Listagem de Pedidos</h3>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, maxWidth: '350px', marginLeft: 'auto' }}>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}></i>
                    <input 
                      type="text" 
                      placeholder="Filtrar por título..." 
                      value={buscaTexto}
                      onChange={(e) => setBuscaTexto(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px 8px 35px', borderRadius: '50px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <button 
                    className="btn-cancelar" 
                    style={{ padding: '8px 14px', fontSize: '13px', whiteSpace: 'nowrap' }} 
                    onClick={buscarMeusPedidos} 
                    disabled={loading}
                  >
                    <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i>
                  </button>
                </div>
              </div>

              <div className="tabs-container-dashboard">
                <button className={`tab-btn-dash ${abaAtiva === 'ATIVAS' ? 'active' : ''}`} onClick={() => setAbaAtiva('ATIVAS')}>
                  Chamados Ativos
                </button>
                <button className={`tab-btn-dash ${abaAtiva === 'HISTORICO' ? 'active' : ''}`} onClick={() => setAbaAtiva('HISTORICO')}>
                  Histórico e Rejeitados
                </button>
              </div>

              {loading ? (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Buscando solicitações...</p>
              ) : pedidosFiltrados.length === 0 ? (
                <div className="conteudo-vazio-pedidos">
                  <i className="bi bi-inbox" style={{ fontSize: '40px', marginBottom: '10px' }}></i>
                  <p>Nenhum chamado encontrado.</p>
                </div>
              ) : (
                <div className="lista-real">
                  {pedidosFiltrados.map(pedido => {
                    const statusAtual = String(pedido.demandStatus || '').toUpperCase();
                    const jaAvaliado = demandasAvaliadas.includes(Number(pedido.id));
                    
                    return (
                      <div 
                        key={pedido.id} 
                        className="card-item-demanda-real" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setPedidoDetalhado(pedido)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <h4 style={{ margin: 0, fontSize: '18px', color: '#111', fontWeight: '700' }}>{pedido.title}</h4>
                          <span className={`status-badge-real ${statusAtual === '1' || statusAtual === 'ABERTO' || statusAtual === 'OPENED' ? 'opened' : statusAtual === '3' || statusAtual === 'AGURADANDO' || statusAtual === 'IN_WAITING' ? 'in_waiting' : statusAtual === '0' || statusAtual === 'FECHADO' || statusAtual === 'CLOSED' ? 'closed' : 'rejected'}`}>
                            {traduzirStatus(pedido.demandStatus)}
                          </span>
                        </div>

                        {pedido.professional?.name && (
                          <p className="texto-card-profissional">
                            <i className="bi bi-person-badge"></i> Profissional: <strong>{pedido.professional.name}</strong>
                          </p>
                        )}

                        <p style={{ fontSize: '14px', color: '#555', margin: '10px 0', lineHeight: '1.4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pedido.description}
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
                          <span style={{ fontSize: '12px', color: '#0066ff', fontWeight: '600' }} onClick={() => setPedidoDetalhado(pedido)}>
                            <i className="bi bi-eye"></i> Ver mais detalhes
                          </span>

                          {/* LOGICA DO BOTÃO SUMIR APÓS AVALIAR */}
                          {(statusAtual === '0' || statusAtual === 'FECHADO' || statusAtual === 'CLOSED') && (
                            jaAvaliado ? (
                              <span style={{ fontSize: '13px', color: '#28a745', fontWeight: '700' }}>
                                <i className="bi bi-check-circle-fill"></i> Avaliado
                              </span>
                            ) : (
                              <button 
                                className="btn-azul-solicitar"
                                style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '50px', background: '#ffc107', borderColor: '#ffc107', color: '#000', fontWeight: '700' }}
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
      </section>

      {pedidoDetalhado && (
        <div className="modal-overlay" onClick={() => setPedidoDetalhado(null)}>
          <div className="modal-container" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h3 className="modal-title" style={{ margin: 0 }}>Detalhes da Solicitação</h3>
              <button className="btn-cancelar" style={{ padding: '5px 10px', borderRadius: '50%' }} onClick={() => setPedidoDetalhado(null)}>X</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Título do Chamado</label>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#111', margin: '4px 0 0 0' }}>{pedidoDetalhado.title}</p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Status Atual</label>
                <div style={{ marginTop: '5px' }}>
                  <span className={`status-badge-real ${String(pedidoDetalhado.demandStatus).toUpperCase() === '1' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'ABERTO' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'OPENED' ? 'opened' : String(pedidoDetalhado.demandStatus).toUpperCase() === '3' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'AGURADANDO' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'IN_WAITING' ? 'in_waiting' : String(pedidoDetalhado.demandStatus).toUpperCase() === '0' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'FECHADO' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'CLOSED' ? 'closed' : 'rejected'}`}>
                    {traduzirStatus(pedidoDetalhado.demandStatus)}
                  </span>
                </div>
              </div>

              {pedidoDetalhado.professional?.name && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Profissional Designado</label>
                  <p style={{ fontSize: '14px', color: '#111', margin: '4px 0 0 0' }}><strong>{pedidoDetalhado.professional.name}</strong> ({pedidoDetalhado.professional.phone || 'Sem telefone'})</p>
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Descrição Detalhada do Problema</label>
                <div style={{ fontSize: '14px', color: '#333', background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginTop: '4px', lineHeight: '1.6', whiteSpace: 'pre-wrap', border: '1px solid #eee' }}>
                  {pedidoDetalhado.description}
                </div>
              </div>

              <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                {(String(pedidoDetalhado.demandStatus).toUpperCase() === 'OPENED' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'ABERTO' || String(pedidoDetalhado.demandStatus).toUpperCase() === '1') && (
                  <button 
                    className="btn-confirmar" 
                    style={{ width: '100%', padding: '12px' }}
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
                    className="btn-confirmar" 
                    style={{ width: '100%', padding: '12px', background: '#28a745', border: '1px solid #28a745' }}
                    onClick={() => {
                      setPedidoDetalhado(null);
                      navigate('/lista-profissionais', { state: { reassignDemandId: pedidoDetalhado.id } });
                    }}
                  >
                    <i className="bi bi-arrow-left-right"></i> Solicitar a Outro Profissional
                  </button>
                )}

                {(String(pedidoDetalhado.demandStatus).toUpperCase() === 'IN_WAITING' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'AGURADANDO' || String(pedidoDetalhado.demandStatus).toUpperCase() === '3') && (
                  <DetalhesSolicitacao demanda={pedidoDetalhado} modo="CLIENTE" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DE FORMULÁRIO DE AVALIAÇÃO ================= */}
      {pedidoParaAvaliar && (
        <div className="modal-overlay" onClick={() => setPedidoParaAvaliar(null)}>
          <div className="modal-container" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '18px' }}>Avaliar Prestador de Serviço</h3>
              <button className="btn-cancelar" style={{ padding: '5px 10px', borderRadius: '50%' }} onClick={() => setPedidoParaAvaliar(null)}>X</button>
            </div>

            <form onSubmit={enviarAvaliacaoSistema} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
                Conte-nos como foi a sua experiência com o profissional <strong>{pedidoParaAvaliar.professional?.name || 'parceiro'}</strong> no serviço <em>"{pedidoParaAvaliar.title}"</em>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', padding: '10px', background: '#f8f9fa', borderRadius: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#666' }}>SUA NOTA</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <i 
                      key={num}
                      className={num <= estrelas ? "bi bi-star-fill" : "bi bi-star"}
                      style={{ fontSize: '28px', color: '#ffc107', cursor: 'pointer', transition: 'transform 0.1s' }}
                      onClick={() => setEstrelas(num)}
                    ></i>
                  ))}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#333', marginTop: '4px' }}>
                  {estrelas === 5 ? 'Excelente!' : estrelas === 4 ? 'Muito Bom' : estrelas === 3 ? 'Regular' : estrelas === 2 ? 'Ruim' : 'Muito Ruim'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#666' }}>COMENTÁRIO / CRÍTICA</label>
                <textarea
                  rows="4"
                  placeholder="Deixe o seu feedback detalhado aqui..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  id="chkAnonimo" 
                  checked={anonimo} 
                  onChange={(e) => setAnonimo(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
                <label htmlFor="chkAnonimo" style={{ fontSize: '13px', color: '#444', cursor: 'pointer', userSelect: 'none' }}>
                  Enviar esta avaliação de forma anônima
                </label>
              </div>

              <button 
                type="submit" 
                className="btn-confirmar" 
                style={{ width: '100%', padding: '12px', background: '#ffc107', borderColor: '#ffc107', color: '#000', fontWeight: '700' }}
                disabled={enviandoAvaliacao}
              >
                {enviandoAvaliacao ? "Registrando Nota..." : "Submeter Avaliação"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardCliente;