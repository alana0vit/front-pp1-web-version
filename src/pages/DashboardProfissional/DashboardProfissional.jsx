import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import DetalhesSolicitacao from "../DetalhesSolicitacao/DetalhesSolicitacao";
import "./DashboardProfissional.css";

function DashboardProfissional() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("ATIVAS");
  const [pedidoDetalhado, setPedidoDetalhado] = useState(null);
  const [buscaTexto, setBuscaTexto] = useState('');
  const [statusFiltro, setStatusFiltro] = useState("TODOS");
  const [dadosPerfil, setDadosPerfil] = useState(null);

  const [confirmacao, setConfirmacao] = useState({
    visivel: false,
    pedidoId: null,
    novoStatus: null,
    tituloAcao: ""
  });

  const userStorage = localStorage.getItem("@ConectaPro:user");
  const usuarioLogado =
    userStorage && userStorage !== "undefined" ? JSON.parse(userStorage) : null;
  const profesionalId = usuarioLogado?.id;

  const buscarPedidos = async () => {
    if (!profesionalId) return null;

    try {
      setLoading(true);
      const response = await api.get("/api/demand/user");

      const meusPedidos = response.data
        .filter((d) => {
          const idProf = d.professional?.id || d.professionalId?.id || d.professionalId;
          return Number(idProf) === Number(profesionalId);
        })
        .sort((a, b) => b.id - a.id);

      setPedidos(meusPedidos);

      const resPerfil = await api.get(`/api/user/${profesionalId}`);
      setDadosPerfil(resPerfil.data);

      return meusPedidos;
    } catch (err) {
      console.error("Erro ao carregar demandas ou reputação:", err);
      toast.error("Erro ao carregar as solicitações.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, [profesionalId]);

  const processarAtualizacaoStatus = async (pedidoId, novoStatus) => {
    try {
      const payload = { status: novoStatus };
      
      console.log(`📤 Enviando PATCH para o id ${pedidoId} com payload:`, payload);
      await api.patch(`/api/demand/${pedidoId}/status`, payload);

      if (novoStatus === "AGUARDANDO" || novoStatus === "AGURADANDO" || novoStatus === "3")
        toast.success("Serviço aceito! Dados de contato liberados.");
      else if (novoStatus === "FECHADO" || novoStatus === "0" || novoStatus === "CLOSED") 
        toast.info("Serviço finalizado.");
      else if (novoStatus === "REJEITADO" || novoStatus === "2" || novoStatus === "REJECTED")
        toast.warn("Serviço recusado.");

      const listaAtualizada = await buscarPedidos();
      
      if (pedidoDetalhado && listaAtualizada) {
        const pedidoFresquinho = listaAtualizada.find(p => p.id === pedidoId);
        if (pedidoFresquinho) {
          setPedidoDetalhado({ ...pedidoFresquinho });
        } else {
          setPedidoDetalhado(null);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
      const msgErro = error.response?.data?.message || error.response?.data || "Falha ao atualizar o status do pedido.";
      toast.error(`Erro: ${msgErro}`);
    }
  };

  const solicitarConfirmacao = (e, pedidoId, novoStatus, acaoTexto) => {
    e.stopPropagation(); 
    setConfirmacao({
      visivel: true,
      pedidoId,
      novoStatus,
      tituloAcao: acaoTexto
    });
  };

  const executarAcaoConfirmada = () => {
    processarAtualizacaoStatus(confirmacao.pedidoId, confirmacao.novoStatus);
    setConfirmacao({ visivel: false, pedidoId: null, novoStatus: null, tituloAcao: "" });
  };

  const traduzirStatus = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === "OPENED" || s === "ABERTO" || s === "1") return "Novo";
    if (s === "IN_WAITING" || s === "AGURADANDO" || s === "AGUARDANDO" || s === "3") return "Em Andamento";
    if (s === "CLOSED" || s === "FECHADO" || s === "0") return "Finalizado";
    if (s === "REJECTED" || s === "REJEITADO" || s === "2") return "Recusado";
    return status;
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const s = String(p.demandStatus || '').toUpperCase();
    const matchesTexto = p.title.toLowerCase().includes(buscaTexto.toLowerCase());

    if (!matchesTexto) return false;

    if (statusFiltro !== "TODOS") {
      if (statusFiltro === "NOVO" && !(s === "OPENED" || s === "ABERTO" || s === "1")) return false;
      if (statusFiltro === "ANDAMENTO" && !(s === "IN_WAITING" || s === "AGURADANDO" || s === "AGUARDANDO" || s === "3")) return false;
      if (statusFiltro === "FINALIZADO" && !(s === "CLOSED" || s === "FECHADO" || s === "0")) return false;
      if (statusFiltro === "RECUSADO" && !(s === "REJECTED" || s === "REJEITADO" || s === "2")) return false;
    }

    if (abaAtiva === "ATIVAS") {
      return s === "OPENED" || s === "ABERTO" || s === "1" || 
             s === "IN_WAITING" || s === "AGURADANDO" || s === "AGUARDANDO" || s === "3";
    }
    if (abaAtiva === "HISTORICO") {
      return s === "CLOSED" || s === "FECHADO" || s === "0" || 
             s === "REJECTED" || s === "REJEITADO" || s === "2";
    }
    return true;
  });

  const contagem = (statusAlvo) => {
    return pedidos.filter((p) => {
      const s = String(p.demandStatus || '').toUpperCase();
      if (statusAlvo === "OPENED") return s === "OPENED" || s === "ABERTO" || s === "1";
      if (statusAlvo === "IN_WAITING") return s === "IN_WAITING" || s === "AGURADANDO" || s === "AGUARDANDO" || s === "3";
      if (statusAlvo === "HISTORICO") {
        return s === "CLOSED" || s === "FECHADO" || s === "0" || 
               s === "REJECTED" || s === "REJEITADO" || s === "2";
      }
      return s === String(statusAlvo).toUpperCase();
    }).length;
  };

  return (
    <div className="dash-prof-bg">
      <div className="dash-prof-container">
        <header className="dash-prof-header">
          <div className="welcome-box">
            <h1>Painel de Controle</h1>
            <p>Olá, <strong>{usuarioLogado?.name}</strong>. Veja como está sua agenda.</p>
            
            {dadosPerfil && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', background: '#fff', padding: '6px 14px', borderRadius: '50px', width: 'fit-content', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <i className="bi bi-star-fill" style={{ color: dadosPerfil.rating ? '#ffc107' : '#ccc' }}></i>
                <span style={{ fontSize: '14px', color: '#333', fontWeight: '700' }}>
                  Sua Reputação: {dadosPerfil.rating !== null && dadosPerfil.rating !== undefined ? dadosPerfil.rating.toFixed(1) : "Sem avaliação"}
                </span>
              </div>
            )}
          </div>
          <button className="btn-config" onClick={() => navigate("/editar-perfil")}>
            <i className="bi bi-gear-wide-connected"></i> Ajustes
          </button>
        </header>

        <section className="stats-cards">
          <div className="stat-card new">
            <h3>{contagem("OPENED")}</h3>
            <span>Novas Solicitações</span>
          </div>
          <div className="stat-card active">
            <h3>{contagem("IN_WAITING")}</h3>
            <span>Em Andamento</span>
          </div>
          <div className="stat-card total">
            <h3>{contagem("HISTORICO")}</h3>
            <span>No Histórico</span>
          </div>
        </section>

        <section className="list-section">
          <div className="list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <h2>Fluxo de Demandas</h2>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, maxWidth: '550px', marginLeft: 'auto' }}>
              <select 
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '50px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', background: '#fff', cursor: 'pointer', color: '#333', fontWeight: '600' }}
              >
                <option value="TODOS">🎯 Todos os Status</option>
                {abaAtiva === "ATIVAS" ? (
                  <>
                    <option value="NOVO">🔵 Novos</option>
                    <option value="ANDAMENTO">🟠 Em Andamento</option>
                  </>
                ) : (
                  <>
                    <option value="FINALIZADO">🟢 Finalizados</option>
                    <option value="RECUSADO">🔴 Recusados</option>
                  </>
                )}
              </select>

              <div style={{ position: 'relative', width: '100%' }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}></i>
                <input 
                  type="text" 
                  placeholder="Filtrar por título..." 
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 35px', borderRadius: '50px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', background: '#fff' }}
                />
              </div>

              <button className="btn-refresh" style={{ height: '38px', width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={buscarPedidos} disabled={loading}>
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>

          <div className="tabs-container">
            <button className={`tab-btn ${abaAtiva === "ATIVAS" ? "active" : ""}`} onClick={() => { setAbaAtiva("ATIVAS"); setStatusFiltro("TODOS"); }}>
              Solicitações Ativas
            </button>
            <button className={`tab-btn ${abaAtiva === "HISTORICO" ? "active" : ""}`} onClick={() => { setAbaAtiva("HISTORICO"); setStatusFiltro("TODOS"); }}>
              Histórico
            </button>
          </div>

          {loading ? (
            <p className="msg-info">Buscando serviços...</p>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>Nenhuma demanda encontrada.</p>
            </div>
          ) : (
            <div className="requests-grid">
              {pedidosFiltrados.map((p) => {
                const sAtual = String(p.demandStatus || '').toUpperCase();
                const estiloStatus = sAtual === '1' || sAtual === 'ABERTO' || sAtual === 'OPENED' ? 'opened' : sAtual === '3' || sAtual === 'AGURADANDO' || sAtual === 'AGUARDANDO' || sAtual === 'IN_WAITING' ? 'in_waiting' : sAtual === '0' || sAtual === 'FECHADO' || sAtual === 'CLOSED' ? 'closed' : 'rejected';

                return (
                  <div
                    key={p.id}
                    className={`request-card status-${estiloStatus}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPedidoDetalhado(p)} 
                  >
                    <div className="card-body">
                      <span className={`status-badge-real ${estiloStatus}`}>
                        {traduzirStatus(p.demandStatus)}
                      </span>
                      <h4 style={{ marginTop: '15px' }}>{p.title}</h4>
                      <p className="client-name"><i className="bi bi-person"></i> {p.client?.name || "Cliente"}</p>
                      
                      {p.address && (
                        <p className="client-address"><i className="bi bi-geo-alt"></i> {p.address.neighborhood}, {p.address.city}</p>
                      )}
                    </div>

                    <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                      {(sAtual === "OPENED" || sAtual === "ABERTO" || sAtual === "1") && (
                        <>
                          <button className="btn-action accept" onClick={(e) => solicitarConfirmacao(e, p.id, "AGUARDANDO", "aceitar esta solicitação de serviço")}>Aceitar</button>
                          <button className="btn-action decline" onClick={(e) => solicitarConfirmacao(e, p.id, "REJEITADO", "recusar esta solicitação de serviço")}>Recusar</button>
                        </>
                      )}
                      {(sAtual === "IN_WAITING" || sAtual === "AGURADANDO" || sAtual === "AGUARDANDO" || sAtual === "3") && (
                        <>
                          <DetalhesSolicitacao demanda={p} modo="PROFISSIONAL" />
                          <button className="btn-action finish" onClick={(e) => solicitarConfirmacao(e, p.id, "FECHADO", "finalizar este serviço de vez")} style={{ width: "100%", marginTop: "10px" }}>Finalizar Serviço</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {pedidoDetalhado && (
        <div className="modal-overlay" onClick={() => setPedidoDetalhado(null)}>
          <div className="modal-container" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h3 className="modal-title" style={{ margin: 0, color: '#111' }}>Descrição Completa da Demanda</h3>
              <button className="btn-cancelar" style={{ padding: '5px 10px', borderRadius: '50%' }} onClick={() => setPedidoDetalhado(null)}>X</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#888' }}>SERVIÇO SOLICITADO</label>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#111', margin: '2px 0 0 0' }}>{pedidoDetalhado.title}</p>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#888' }}>DESCRIÇÃO COMPLETA DO PROBLEMA</label>
                <div style={{ fontSize: '14px', color: '#222', background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginTop: '4px', lineHeight: '1.6' }}>
                  {pedidoDetalhado.description}
                </div>
              </div>

              <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                {(String(pedidoDetalhado.demandStatus).toUpperCase() === 'ABERTO' || String(pedidoDetalhado.demandStatus).toUpperCase() === 'OPENED' || String(pedidoDetalhado.demandStatus).toUpperCase() === '1') && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-action accept" style={{ flex: 1 }} onClick={(e) => { setPedidoDetalhado(null); solicitarConfirmacao(e, pedidoDetalhado.id, "AGUARDANDO", "aceitar esta solicitação de serviço"); }}>Aceitar Serviço</button>
                    <button className="btn-action decline" style={{ flex: 1 }} onClick={(e) => { setPedidoDetalhado(null); solicitarConfirmacao(e, pedidoDetalhado.id, "REJEITADO", "recusar esta solicitação de serviço"); }}>Recusar</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmacao.visivel && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-container" style={{ maxWidth: '400px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', color: '#ffc107', marginBottom: '10px' }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#111', fontWeight: '700' }}>Confirmar Ação</h3>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              Você tem certeza de que deseja <strong>{confirmacao.tituloAcao}</strong>? Essa operação alterará o andamento do chamado.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                className="btn-cancelar" 
                style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: '600', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                onClick={() => setConfirmacao({ visivel: false, pedidoId: null, novoStatus: null, tituloAcao: "" })}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirmar" 
                style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: '700', background: '#0066ff', color: '#fff', border: 'none', cursor: 'pointer' }}
                onClick={executarAcaoConfirmada}
              >
                Sim, Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardProfissional;