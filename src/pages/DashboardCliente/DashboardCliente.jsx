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
        .sort((a, b) => (b.id || 0) - (a.id || 0)); // Trava a ordenação para evitar pulos
      
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

  // CAMADA DE TRADUÇÃO COMPATÍVEL: Traduz qualquer padrão retornado pelo banco (String, Texto-BR ou Ordinal)
  const traduzirStatus = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'ABERTO' || s === '1' || s === 'OPENED') return 'Aguardando Resposta';
    if (s === 'AGURADANDO' || s === '3' || s === 'IN_WAITING') return 'Em Andamento';
    if (s === 'FECHADO' || s === '0' || s === 'CLOSED') return 'Concluída';
    if (s === 'REJEITADO' || s === '2' || s === 'REJECTED') return 'Recusada';
    return s;
  };

  // NAVEGAÇÃO ENTRE ABAS BLINDADA (Captura Texto, Texto-BR ou Ordinal)
  const pedidosFiltrados = pedidos.filter(p => {
    const status = String(p.demandStatus || '').toUpperCase();
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

  // Mapeamento dinâmico dos contadores superiores
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
      
      {/* SEÇÃO DO TOPO BRANCO */}
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

      {/* SEÇÃO CINZA DE SERVIÇOS */}
      <section className="secao-servicos-cinza">
        <div className="cabecalho-servicos">
          <h2>Como estão seus serviços?</h2>
        </div>

        <button className="btn-azul-solicitar" onClick={() => navigate('/lista-profissionais')}>
          <i className="bi bi-plus-circle"></i> Solicitar Novo Serviço
        </button>

        {/* LAYOUT PRINCIPAL DO CONTEÚDO */}
        <div className="layout-dashboard-baixo">
          
          {/* COLUNA ESQUERDA: CONTADORES DE STATUS */}
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

          {/* COLUNA DIREITA: ABAS E LISTAGEM DOS CARDS */}
          <main className="coluna-pedidos-recentes">
            <div className="cartao-pedidos-painel">
              
              {/* HEADER INTERNO COM REFRESH */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Listagem de Pedidos</h3>
                <button 
                  className="btn-cancelar" 
                  style={{ padding: '6px 12px', fontSize: '13px' }} 
                  onClick={buscarMeusPedidos} 
                  disabled={loading}
                >
                  <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i> Atualizar
                </button>
              </div>

              {/* NAVEGAÇÃO POR ABAS (TABS) */}
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
                  <p>Nenhum chamado encontrado para esta aba.</p>
                </div>
              ) : (
                <div className="lista-real">
                  {pedidosFiltrados.map(pedido => {
                    const statusAtual = String(pedido.demandStatus || '').toUpperCase();
                    
                    return (
                      <div key={pedido.id} className="card-item-demanda-real">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <h4 style={{ margin: 0, fontSize: '18px', color: '#111', fontWeight: '700' }}>{pedido.title}</h4>
                          {/* Adiciona estilo baseado no status de maneira segura e higienizada */}
                          <span className={`status-badge-real ${statusAtual === '1' || statusAtual === 'ABERTO' || statusAtual === 'OPENED' ? 'opened' : statusAtual === '3' || statusAtual === 'AGURADANDO' || statusAtual === 'IN_WAITING' ? 'in_waiting' : statusAtual === '0' || statusAtual === 'FECHADO' || statusAtual === 'CLOSED' ? 'closed' : 'rejected'}`}>
                            {traduzirStatus(pedido.demandStatus)}
                          </span>
                        </div>

                        {/* Nome do Profissional caso já esteja vinculado */}
                        {pedido.professional?.name && (
                          <p className="texto-card-profissional">
                            <i className="bi bi-person-badge"></i> Profissional: <strong>{pedido.professional.name}</strong>
                          </p>
                        )}

                        <p style={{ fontSize: '14px', color: '#555', margin: '10px 0', lineHeight: '1.4' }}>
                          {pedido.description}
                        </p>

                        {/* Botão para Editar Solicitação (Apenas se o chamado estiver Aberto) */}
                        {(statusAtual === 'OPENED' || statusAtual === 'ABERTO' || statusAtual === '1') && (
                          <button 
                            className="btn-cancelar" 
                            style={{ marginTop: '5px', fontSize: '13px', border: '1px solid #ddd', color: '#333' }}
                            onClick={() => navigate(`/editar-demanda/${pedido.id}`)}
                          >
                            <i className="bi bi-pencil-square" style={{ marginRight: '5px', color: '#0066ff' }}></i>
                            Editar Solicitação
                          </button>
                        )}

                        {/* Componente dinâmico de contato se estiver em andamento */}
                        {(statusAtual === 'IN_WAITING' || statusAtual === 'AGURADANDO' || statusAtual === '3') && (
                          <DetalhesSolicitacao demanda={pedido} modo="CLIENTE" />
                        )}

                        {/* Notificação visível caso o chamado tenha sido rejeitado */}
                        {(statusAtual === 'REJECTED' || statusAtual === 'REJEITADO' || statusAtual === '2') && (
                          <div style={{ marginTop: '15px', background: '#fff5f5', color: '#c53030', padding: '12px', borderRadius: '10px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', border: '1px solid #fed7d7' }}>
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <span>Este profissional recusou o chamado. Você pode excluí-lo ou solicitar a outro especialista.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </main>

        </div>
      </section>
    </div>
  );
}

export default DashboardCliente;