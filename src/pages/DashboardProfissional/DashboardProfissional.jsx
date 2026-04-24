import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './DashboardProfissional.css';

function DashboardProfissional() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuarioLogado = JSON.parse(localStorage.getItem('@ConectaPro:user'));
  const profissionalId = usuarioLogado?.id;

  const buscarPedidos = async () => {
    if (!profissionalId) return;
    try {
      setLoading(true);
      const response = await api.get('/api/demand/user');
      const meusPedidos = response.data.filter(d => d.professional?.id === profissionalId);
      setPedidos(meusPedidos);
    } catch (err) {
      console.error("Erro ao carregar demandas:", err);
      toast.error("Erro ao carregar as solicitações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, [profissionalId]);

  const novosPedidos = pedidos.filter(p => p.demandStatus === 'OPENED').length;
  const emAndamento = pedidos.filter(p => p.demandStatus === 'IN_WAITING').length;
  const concluidos = pedidos.filter(p => p.demandStatus === 'CLOSED').length;

  return (
    <main className="dashboard-prof-main">
      <div className="dashboard-prof-container">
        
        {/* Cabeçalho de Boas-vindas */}
        <header className="prof-header-top">
          <div className="prof-welcome">
            <h1>Painel de Controle</h1>
            <p>Bem-vindo de volta, <strong>{usuarioLogado?.name}</strong></p>
          </div>
          <button className="prof-btn-edit" onClick={() => navigate('/editar-perfil')}>
            <i className="bi bi-gear-fill"></i> Configurações
          </button>
        </header>

        {/* Grade de Estatísticas */}
        <section className="prof-stats-grid">
          <div className="prof-stat-card card-new">
            <div className="stat-icon"><i className="bi bi-stars"></i></div>
            <div className="stat-info">
              <h3>{novosPedidos}</h3>
              <span>Novas Demandas</span>
            </div>
          </div>
          <div className="prof-stat-card card-waiting">
            <div className="stat-icon"><i className="bi bi-clock-history"></i></div>
            <div className="stat-info">
              <h3>{emAndamento}</h3>
              <span>Em Atendimento</span>
            </div>
          </div>
          <div className="prof-stat-card card-done">
            <div className="stat-icon"><i className="bi bi-check-all"></i></div>
            <div className="stat-info">
              <h3>{concluidos}</h3>
              <span>Concluídos</span>
            </div>
          </div>
        </section>

        {/* Seção Principal de Pedidos */}
        <section className="prof-work-section">
          <div className="section-title-bar">
            <h2><i className="bi bi-list-task"></i> Fluxo de Trabalho</h2>
            <button className="prof-btn-refresh" onClick={buscarPedidos} disabled={loading}>
              <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i> Atualizar
            </button>
          </div>

          {loading ? (
            <div className="prof-loading-state">Carregando seus serviços...</div>
          ) : pedidos.length === 0 ? (
            <div className="prof-empty-state">
              <i className="bi bi-clipboard2-x"></i>
              <p>Você ainda não recebeu pedidos. Garanta que seu perfil esteja completo!</p>
            </div>
          ) : (
            <div className="prof-requests-list">
              {pedidos.map(p => (
                <div key={p.id} className="prof-request-item">
                  <div className="request-main-info">
                    <span className={`status-badge ${p.demandStatus.toLowerCase()}`}>
                      {p.demandStatus === 'OPENED' ? 'Novo' : p.demandStatus}
                    </span>
                    <h4>{p.title}</h4>
                    <p><i className="bi bi-person-circle"></i> {p.client?.name || "Cliente ConectaPro"}</p>
                  </div>
                  
                  <div className="request-actions">
                    <button className="btn-view-details" onClick={() => toast.info("Detalhes em breve")}>
                      Gerenciar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default DashboardProfissional;