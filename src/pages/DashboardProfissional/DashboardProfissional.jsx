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

  // Nova função simplificada usando o PATCH /status criado pela equipa de Backend!
  const atualizarStatus = async (pedidoId, novoStatus) => {
    try {
      const payload = { status: novoStatus };
      await api.patch(`/api/demand/${pedidoId}/status`, payload);

      if (novoStatus === "IN_WAITING")
        toast.success("Serviço aceite! Entre em contacto com o cliente.");
      else if (novoStatus === "CLOSED") toast.info("Serviço finalizado.");
      else if (novoStatus === "REJECTED")
        toast.warn("Serviço recusado. Ele foi movido para o histórico.");

      buscarPedidos();
    } catch (error) {
      console.error("Erro detalhado:", error);
      toast.error("Falha ao atualizar o status do pedido.");
    }
  };

  const traduzirStatus = (status) => {
    const traducoes = {
      OPENED: "Novo",
      IN_WAITING: "Em Andamento",
      CLOSED: "Finalizado",
      REJECTED: "Recusado",
    };
    return traducoes[status] || status;
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    if (abaAtiva === "ATIVAS")
      return p.demandStatus === "OPENED" || p.demandStatus === "IN_WAITING";
    if (abaAtiva === "HISTORICO")
      return p.demandStatus === "CLOSED" || p.demandStatus === "REJECTED";
    return true;
  });

  const contagem = (status) =>
    pedidos.filter((p) => p.demandStatus === status).length;

  return (
    <div className="dash-prof-bg">
      <div className="dash-prof-container">
        <header className="dash-prof-header">
          <div className="welcome-box">
            <h1>Painel de Controle</h1>
            <p>
              Olá, <strong>{usuarioLogado?.name}</strong>. Veja como está sua
              agenda.
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
            <h3>{contagem("CLOSED") + contagem("REJECTED")}</h3>
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
              {pedidosFiltrados.map((p) => (
                <div
                  key={p.id}
                  className={`request-card status-${p.demandStatus.toLowerCase()}`}
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

                    {/* NOVO: MOSTRAR ENDEREÇO DA DEMANDA */}
                    {p.address && (
                      <p className="client-address">
                        <i className="bi bi-geo-alt"></i>{" "}
                        {p.address.neighborhood}, {p.address.city}
                      </p>
                    )}
                  </div>

                  <div className="card-footer">
                    {p.demandStatus === "OPENED" && (
                      <>
                        <button
                          className="btn-action accept"
                          onClick={() => atualizarStatus(p.id, "IN_WAITING")}
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

                    {p.demandStatus === "IN_WAITING" && (
                      <>
                        <DetalhesSolicitacao demanda={p} modo="PROFISSIONAL" />
                        <button
                          className="btn-action finish"
                          onClick={() => atualizarStatus(p.id, "CLOSED")}
                          style={{ width: "100%", marginTop: "10px" }}
                        >
                          Finalizar Serviço
                        </button>
                      </>
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
