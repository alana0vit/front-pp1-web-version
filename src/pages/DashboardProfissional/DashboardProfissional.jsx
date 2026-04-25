import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './DashboardProfissional.css';

function DashboardProfissional() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const userStorage = localStorage.getItem('@ConectaPro:user');
  const usuarioLogado = userStorage && userStorage !== "undefined" ? JSON.parse(userStorage) : null;
  const profissionalId = usuarioLogado?.id;

  const buscarPedidos = async () => {
    if (!profissionalId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/api/demand/user');

      const meusPedidos = response.data.filter(d => {
        const idProf = d.professional?.id || d.professionalId?.id || d.professionalId;
        return Number(idProf) === Number(profissionalId);
      });

      setPedidos(meusPedidos);
    } catch (err) {
      console.error("❌ Erro ao carregar demandas:", err);
      toast.error("Erro ao carregar as solicitações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, [profissionalId]);

  // FUNÇÃO CORRIGIDA: Extração profunda de IDs para evitar NaN
  const atualizarStatus = async (pedido, novoStatus) => {
    try {
      // Tenta pegar o ID de qualquer lugar possível dentro do objeto retornado pelo backend
      const idEndereco = pedido.address?.id || pedido.addressId;
      const idCategoria = pedido.category?.id || pedido.categoryId;
      const idCliente = pedido.client?.id || pedido.clientId;

      // Montagem do payload garantindo números válidos (fallback para 1 se for nulo ou NaN)
      const payload = {
        code: pedido.code || null,
        title: pedido.title,
        description: pedido.description,
        imgUrl: pedido.imgUrl || null,
        addressId: idEndereco ? Number(idEndereco) : 1,
        categoryId: idCategoria ? Number(idCategoria) : 1,
        clientId: idCliente ? Number(idCliente) : 1,
        professionalId: Number(profissionalId),
        demandStatus: novoStatus
      };

      console.log("📦 Payload Final Enviado:", payload);

      await api.patch(`/api/demand/${pedido.id}/status`, {
        status: novoStatus
      });

      if (novoStatus === 'IN_WAITING') toast.success('Serviço aceito com sucesso!');
      else if (novoStatus === 'CLOSED') toast.info('Status atualizado.');
      else if (novoStatus === 'REJECTED') toast.warn('Serviço recusado.');

      buscarPedidos();

    } catch (error) {
      console.error("❌ Erro detalhado:", error);
      const msg = error.response?.data?.message || "Erro na comunicação com o servidor.";
      toast.error(`Falha ao atualizar: ${msg}`);
    }
  };

  const mostrarDetalhes = (p) => {
    alert(`📋 DETALHES DO SERVIÇO\n\n👤 Solicitante: ${p.clientId?.name || 'Cliente'}\n🛠️ Título: ${p.title}\n📝 Descrição: ${p.description}`);
  };

  const contagem = (status) => pedidos.filter(p => p.demandStatus === status).length;

  return (
    <div className="dash-prof-bg">
      <div className="dash-prof-container">

        <header className="dash-prof-header">
          <div className="welcome-box">
            <h1>Painel de Controle</h1>
            <p>Olá, <strong>{usuarioLogado?.name}</strong>. Veja como está sua agenda.</p>
          </div>
          <button className="btn-config" onClick={() => navigate('/editar-perfil')}>
            <i className="bi bi-gear-wide-connected"></i> Ajustes
          </button>
        </header>

        <section className="stats-cards">
          <div className="stat-card new">
            <h3>{contagem('OPENED')}</h3>
            <span>Novas</span>
          </div>
          <div className="stat-card active">
            <h3>{contagem('IN_WAITING')}</h3>
            <span>Em Aberto</span>
          </div>
          <div className="stat-card total">
            <h3>{contagem('CLOSED')}</h3>
            <span>Finalizadas</span>
          </div>
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>Fluxo de Demandas</h2>
            <button className="btn-refresh" onClick={buscarPedidos} disabled={loading}>
              <i className="bi bi-arrow-clockwise"></i> Atualizar
            </button>
          </div>

          {loading ? (
            <p className="msg-info">Buscando serviços...</p>
          ) : pedidos.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>Nenhuma solicitação encontrada no momento.</p>
            </div>
          ) : (
            <div className="requests-grid">
              {pedidos.map(p => (
                <div key={p.id} className={`request-card status-${p.demandStatus.toLowerCase()}`}>
                  <div className="card-body">
                    <span className="badge-status">
                      {p.demandStatus === 'OPENED' ? 'NOVO' : p.demandStatus === 'IN_WAITING' ? 'EM ANDAMENTO' : p.demandStatus}
                    </span>
                    <h4>{p.title}</h4>
                    <p className="client-name">
                      <i className="bi bi-person"></i> {p.clientId?.name || 'Cliente ConectaPro'}
                    </p>
                  </div>

                  <div className="card-footer">
                    <button className="btn-action info" onClick={() => mostrarDetalhes(p)}>
                      <i className="bi bi-info-circle"></i>
                    </button>

                    {p.demandStatus === 'OPENED' && (
                      <>
                        <button className="btn-action accept" onClick={() => atualizarStatus(p, 'IN_WAITING')}>
                          Aceitar
                        </button>
                        <button className="btn-action decline" onClick={() => atualizarStatus(p, 'REJECTED')}>
                          Recusar
                        </button>
                      </>
                    )}

                    {p.demandStatus === 'IN_WAITING' && (
                      <button className="btn-action finish" onClick={() => atualizarStatus(p, 'CLOSED')}>
                        Finalizar Serviço
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardProfissional;