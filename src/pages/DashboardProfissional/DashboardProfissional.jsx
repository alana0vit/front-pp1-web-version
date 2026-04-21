import React, { useState, useEffect } from "react";
// Removemos o useNavigate pois não estamos redirecionando o profissional nesta tela
import { toast } from "react-toastify";
import api from "../../services/api";
import "./DashboardProfissional.css";

const DashboardProfissional = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuarioLogado = JSON.parse(localStorage.getItem("@ConectaPro:user"));
  const profissionalId = usuarioLogado ? usuarioLogado.id : null;

  useEffect(() => {
    // Movemos a função para DENTRO do useEffect para resolver o aviso de dependência do React
    const carregarPedidos = async () => {
      if (!profissionalId) return;
      try {
        const response = await api.get("/api/demand/user");
        // Filtra para mostrar apenas os pedidos direcionados a este profissional
        const meusTrabalhos = response.data.filter(
          (d) => d.professionalId?.id === profissionalId,
        );

        // Ordena para que os "OPENED" (Novos) apareçam primeiro
        meusTrabalhos.sort((a, b) => {
          if (a.demandStatus === "OPENED" && b.demandStatus !== "OPENED")
            return -1;
          if (a.demandStatus !== "OPENED" && b.demandStatus === "OPENED")
            return 1;
          return 0;
        });
        setPedidos(meusTrabalhos);
      } catch (err) {
        console.error("Erro ao buscar demandas:", err);
        toast.error("Erro ao carregar seus serviços.");
      } finally {
        setLoading(false);
      }
    };

    carregarPedidos();
  }, [profissionalId]); // Agora o ESLint está feliz, pois a única dependência externa é o ID

  const atualizarStatusPedido = async (pedido, novoStatus) => {
    try {
      const payload = {
        code: pedido.code,
        title: pedido.title,
        description: pedido.description,
        imgUrl: pedido.imgUrl || "",
        addressId: pedido.addressId?.id || 1,
        categoryId: pedido.categoryId?.id || 1,
        clientId: pedido.clientId?.id,
        professionalId: pedido.professionalId?.id,
        demandStatus: novoStatus,
      };

      await api.put(`/api/demand/${pedido.id}`, payload);

      // Atualiza a tela instantaneamente
      setPedidos(
        pedidos.map((p) =>
          p.id === pedido.id ? { ...p, demandStatus: novoStatus } : p,
        ),
      );

      toast.success(
        novoStatus === "IN_WAITING"
          ? "Trabalho aceito com sucesso!"
          : "Pedido recusado.",
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Não foi possível atualizar o pedido.");
    }
  };

  const renderStatusBadge = (statusEnum) => {
    switch (statusEnum) {
      case "OPENED":
        return <span className="badge-status pendente">Novo Pedido</span>;
      case "IN_WAITING":
        return <span className="badge-status aceito">Em Andamento</span>;
      case "REJECTED":
        return <span className="badge-status negado">Recusado</span>;
      case "CLOSED":
        return (
          <span
            className="badge-status concluido"
            style={{ backgroundColor: "#e2e3e5", color: "#383d41" }}
          >
            Finalizado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dash-header">
        <div>
          <h1>Área do Profissional</h1>
          <p>Gerencie seus orçamentos e serviços, {usuarioLogado?.name}.</p>
        </div>
      </header>

      <section className="pedidos-section">
        {loading ? (
          <p>Carregando seus chamados...</p>
        ) : pedidos.length === 0 ? (
          <div className="empty-dash">
            <p>Nenhum pedido novo no momento. Fique de olho!</p>
          </div>
        ) : (
          <div className="pedidos-grid">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className={`card-pedido ${(pedido.demandStatus || "OPENED").toLowerCase()}`}
              >
                <div className="pedido-info">
                  {renderStatusBadge(pedido.demandStatus)}
                  <h4>{pedido.title}</h4>
                  <p>{pedido.description}</p>

                  <div className="cliente-info">
                    <i className="bi bi-person-circle"></i>
                    <span>
                      Cliente: <strong>{pedido.clientId?.name}</strong>
                    </span>
                    <br />
                    <i className="bi bi-geo-alt"></i>
                    <span>Local: {pedido.addressId?.city || "A combinar"}</span>
                  </div>
                </div>

                <div className="pedido-footer">
                  {pedido.demandStatus === "OPENED" && (
                    <div className="action-buttons">
                      <button
                        className="btn-aceitar"
                        onClick={() =>
                          atualizarStatusPedido(pedido, "IN_WAITING")
                        }
                      >
                        <i className="bi bi-check-lg"></i> Aceitar
                      </button>
                      <button
                        className="btn-recusar"
                        onClick={() =>
                          atualizarStatusPedido(pedido, "REJECTED")
                        }
                      >
                        <i className="bi bi-x-lg"></i> Recusar
                      </button>
                    </div>
                  )}

                  {pedido.demandStatus === "IN_WAITING" && (
                    <a
                      href={`https://wa.me/55${pedido.clientId?.phone}?text=Olá! Aceitei seu pedido no ConectaPro sobre: ${pedido.title}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-whatsapp"
                    >
                      <i className="bi bi-whatsapp"></i> Iniciar Conversa
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardProfissional;
