import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imagemDash from '../../assets/imgdash.png';
import api from '../../services/api';
import './DashboardCliente.css';

function DashboardCliente() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const usuarioLogado = JSON.parse(localStorage.getItem('@ConectaPro:user'));
  const clienteId = usuarioLogado?.id;

  const [profissionais, setProfissionais] = useState([]);
  const [profSelecionado, setProfSelecionado] = useState('');
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  useEffect(() => {
    const buscarPedidos = async () => {
      if (!clienteId) return;
      try {
        const response = await api.get('/api/demand/user');
        const meusPedidos = response.data.filter(d => d.clientId?.id === clienteId);
        setPedidos(meusPedidos);
      } catch (err) {
        console.error("Erro ao carregar demandas:", err);
      } finally {
        setLoading(false);
      }
    };
    buscarPedidos();
    buscarProfissionais();
  }, [clienteId]);

  const buscarProfissionais = async () => {
    try {
      const response = await api.get('/api/user');
      const apenasProfissionais = response.data.filter(
        u => u.userType === 'PROFESSIONAL'
      );
      setProfissionais(apenasProfissionais);
    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
    }
  };

  const reatribuirProfissional = async () => {
    if (!pedidoSelecionado || !profSelecionado) return;

    try {
      console.log("Reatribuindo:", pedidoSelecionado, profSelecionado);
      await api.patch(`/api/demand/${pedidoSelecionado}/reassign`, {
        professionalId: Number(profSelecionado)
      });

      alert("Profissional reatribuído com sucesso!");

      setPedidoSelecionado(null);
      setProfSelecionado('');

      // Atualiza lista
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert("Erro ao reatribuir profissional");
    }
  };

  const emAndamento = pedidos.filter(p => p.demandStatus === 'IN_WAITING').length;
  const aguardandoOrcamento = pedidos.filter(p => p.demandStatus === 'OPENED').length;
  const concluidos = pedidos.filter(p => p.demandStatus === 'CLOSED').length;
  const realizarBusca = () => {
    if (termoBusca.trim()) {
      navigate(`/listaprof?busca=${termoBusca}`);
    } else {
      navigate('/listaprof');
    }
  };

  const filtrarPorCategoria = (categoria) => {
    navigate(`/listaprof?categoria=${categoria}`);
  };

  return (
    <div className="container-dashboard">
      

      <section className="secao-servicos-cinza">
        <div className="cabecalho-servicos">
          <h2>Como estão seus serviços?</h2>
          <p>Acompanhe cada etapa com total segurança e transparência.</p>
        </div>

        <div className="acao-solicitar">
          <button className="btn-azul-solicitar" onClick={() => navigate('/solicitar-servico')}>
            <i className="bi bi-plus-circle"></i> Solicitar Novo Serviço
          </button>
        </div>

        <div className="layout-dashboard-baixo">
          <div className="coluna-status">
            <div className="cartao-contador-status">
              <div className="numero-status">{emAndamento}</div>
              <p>Pedidos em Andamento</p>
              <i className="bi bi-play-circle-fill icone-status-azul"></i>
            </div>

            <div className="cartao-contador-status">
              <div className="numero-status">{aguardandoOrcamento}</div>
              <p>Aguardando Orçamento</p>
              <i className="bi bi-clock-fill icone-status-amarelo"></i>
            </div>

            <div className="cartao-contador-status">
              <div className="numero-status">{concluidos}</div>
              <p>Serviços Finalizados</p>
              <i className="bi bi-check-circle-fill icone-status-verde"></i>
            </div>
          </div>

          <div className="coluna-pedidos-recentes">
            <div className="cartao-pedidos-painel">
              <h3>Pedidos Recentes</h3>
              {loading ? (
                <p style={{ marginTop: '20px' }}>Carregando...</p>
              ) : pedidos.length === 0 ? (
                <div className="conteudo-vazio-pedidos">
                  <i className="bi bi-clipboard-x"></i>
                  <p>Você ainda não realizou nenhum pedido.</p>
                </div>
              ) : (
                <div className="lista-real">
                  {pedidos.map(p => (
                    <div key={p.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                      <div>
                        <strong>{p.title}</strong><br />
                        <small>{p.demandStatus}</small>
                      </div>

                      {p.demandStatus === 'REJECTED' && (
                        <button
                          onClick={() => setPedidoSelecionado(p.id)}
                          style={{
                            background: '#ff9800',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          Reatribuir
                        </button>
                      )}

                      {p.demandStatus === 'IN_WAITING' && (
                        <button
                          onClick={() => navigate('/detalhes-solicitacao', { state: { pedidoId: p.id } })}
                          style={{
                            background: '#1e66f5',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          Ver detalhes
                        </button>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {pedidoSelecionado && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className="modal-title">Reatribuir profissional</h3>

            <p className="modal-subtitle">
              Escolha um novo profissional para este serviço
            </p>

            <select
              value={profSelecionado}
              onChange={(e) => setProfSelecionado(e.target.value)}
              className="modal-select"
            >
              <option value="">Selecione um profissional</option>
              {profissionais.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setPedidoSelecionado(null)}>
                Cancelar
              </button>

              <button className="btn-confirmar" onClick={reatribuirProfissional}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardCliente;