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

  const userStorage = localStorage.getItem("@ConectaPro:user");
  const usuarioLogado =
    userStorage && userStorage !== "undefined" ? JSON.parse(userStorage) : null;
  const profissionalId = usuarioLogado?.id;

  const buscarPedidos = async () => {
    if (!profissionalId) return;

    try {
      setLoading(true);
      const response = await api.get("/api/demand/user");

      const meusPedidos = response.data
        .filter((d) => {
          const idProf =
            d.professional?.id || d.professionalId?.id || d.professionalId;
          return Number(idProf) === Number(profissionalId);
        })
        .sort((a, b) => b.id - a.id); // Ordem estável!

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

  // Função simplificada com mapeamento de status compatível para o PATCH do Backend
  const atualizarStatus = async (pedidoId, novoStatus) => {
    try {
      // Se o backend esperar strings em português/ordinais por causa do banco, mapeamos de forma segura aqui
      const payload = { status: novoStatus };
      await api.patch(`/api/demand/${pedidoId}/status`, payload);

      if (novoStatus === "IN_WAITING" || novoStatus === "AGURADANDO" || novoStatus === "3")
        toast.success("Serviço aceite! Entre em contacto com o cliente.");
      else if (novoStatus === "CLOSED" || novoStatus === "FECHADO" || novoStatus === "0") 
        toast.info("Serviço finalizado.");
      else if (novoStatus === "REJECTED" || novoStatus === "REJEITADO" || novoStatus === "2")
        toast.warn("Serviço recusado. Ele foi movido para o histórico.");

      buscarPedidos();
    } catch (error) {
      console.error("Erro detalhado:", error);
      toast.error("Falha ao atualizar o status do pedido.");
    }
  };

  // TRADUÇÃO UNIVERSAL: Mapeia qualquer variação (Texto, Texto-BR ou Ordinal)
  const traduzirStatus = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === "OPENED" || s === "ABERTO" || s === "1") return "Novo";
    if (s === "IN_WAITING" || s === "AGURADANDO" || s === "3") return "Em Andamento";
    if (s === "CLOSED" || s === "FECHADO" || s === "0") return "Finalizado";
    if (s === "REJECTED" || s === "REJEITADO" || s === "2") return "Recusado";
    return status;
  };

  // FILTRO DE NAVEGAÇÃO DE ABAS UNIVERSAL
  const pedidosFiltrados = pedidos.filter((p) => {
    const s = String(p.demandStatus || '').toUpperCase();
    if (abaAtiva === "ATIVAS") {
      return s === "OPENED" || s === "ABERTO" || s === "1" || 
             s === "IN_WAITING" || s === "AGURADANDO" || s === "3";
    }
    if (abaAtiva === "HISTORICO") {
      return s === "CLOSED" || s === "FECHADO" || s === "0" || 
             s === "REJECTED" || s === "REJEITADO" || s === "2";
    }
    return true;
  });

  // CONTADOR DE PROPRIEDADES BLINDADO
  const contagem = (statusAlvo) => {
    return pedidos.filter((p) => {
      const s = String(p.demandStatus || '').toUpperCase();
      if (statusAlvo === "OPENED") return s === "OPENED" || s === "ABERTO" || s === "1";
      if (statusAlvo === "IN_WAITING") return s === "IN_WAITING" || s === "AGURADANDO" || s === "3";
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
            <p>
              Olá, <strong>{usuarioLogado?.name}</strong>. Veja como está sua agenda.
            </p>
          </div>
          <button
            className="btn-config"
            onClick={() => navigate("/editar-perfil")}
          >
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
          <div className="list-header">
            <h2>Fluxo de Demandas</h2>
            <button
              className="btn-refresh"
              onClick={buscarPedidos}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise"></i> Atualizar
            </button>
          </div>

          <div className="tabs-container">
            <button
              className={`tab-btn ${abaAtiva === "ATIVAS" ? "active" : ""}`}
              onClick={() => setAbaAtiva("ATIVAS")}
            >
              Solicitações Ativas
            </button>
            <button
              className={`tab-btn ${abaAtiva === "HISTORICO" ? "active" : ""}`}
              onClick={() => setAbaAtiva("HISTORICO")}
            >
              Histórico
            </button>
          </div>

          {loading ? (
            <p className="msg-info">Buscando serviços...</p>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>Nenhuma demanda nesta aba.</p>
            </div>
          ) : (
            <div className="requests-grid">
              {pedidosFiltrados.map((p) => {
                const sAtual = String(p.demandStatus || '').toUpperCase();

                return (
                  <div
                    key={p.id}
                    className={`request-card status-${sAtual === '1' || sAtual === 'ABERTO' || sAtual === 'OPENED' ? 'opened' : sAtual === '3' || sAtual === 'AGURADANDO' || sAtual === 'IN_WAITING' ? 'in_waiting' : sAtual === '0' || sAtual === 'FECHADO' || sAtual === 'CLOSED' ? 'closed' : 'rejected'}`}
                  >
                    <div className="card-body">
                      <span className="badge-status">
                        {traduzirStatus(p.demandStatus)}
                      </span>
                      <h4>{p.title}</h4>
                      <p className="client-name">
                        <i className="bi bi-person"></i>{" "}
                        {p.client?.name || "Cliente"}
                      </p>

                      {/* MOSTRAR ENDEREÇO DA DEMANDA */}
                      {p.address && (
                        <p className="client-address">
                          <i className="bi bi-geo-alt"></i>{" "}
                          {p.address.neighborhood}, {p.address.city}
                        </p>
                      )}
                    </div>

                    <div className="card-footer">
                      {/* Se o chamado estiver em estado "Novo / Aberto" */}
                      {(sAtual === "OPENED" || sAtual === "ABERTO" || sAtual === "1") && (
                        <>
                          <button
                            className="btn-action accept"
                            onClick={() => atualizarStatus(p.id, "AGURADANDO")}
                          >
                            Aceitar
                          </button>
                          <button
                            className="btn-action decline"
                            onClick={() => atualizarStatus(p.id, "REJECTED")}
                          >
                            Recusar
                          </button>
                        </>
                      )}

                      {/* Se o chamado estiver em estado "Em Andamento" */}
                      {(sAtual === "IN_WAITING" || sAtual === "AGURADANDO" || sAtual === "3") && (
                        <>
                          <DetalhesSolicitacao demanda={p} modo="PROFISSIONAL" />
                          <button
                            className="btn-action finish"
                            onClick={() => atualizarStatus(p.id, "FECHADO")}
                            style={{ width: "100%", marginTop: "10px" }}
                          >
                            Finalizar Serviço
                          </button>
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
    </div>
  );
}

export default DashboardProfissional;