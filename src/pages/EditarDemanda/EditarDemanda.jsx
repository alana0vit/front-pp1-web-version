import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./EditarDemanda.css";

function EditarDemanda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const buscarDadosDemanda = async () => {
      try {
        setCarregando(true);
        const response = await api.get(`/api/demand/user`);
        const todasDemandas = Array.isArray(response.data) ? response.data : [];
        const demandaAlvo = todasDemandas.find((d) => Number(d.id) === Number(id));

        if (demandaAlvo) {
          setTitle(demandaAlvo.title || "");
          setDescription(demandaAlvo.description || "");
        } else {
          toast.error("Solicitação não encontrada.");
          navigate("/dashboard-cliente");
        }
      } catch (error) {
        console.error("Erro ao carregar dados da demanda:", error);
        toast.error("Falha ao carregar os dados para edição.");
      } finally {
        setCarregando(false);
      }
    };

    if (id) buscarDadosDemanda();
  }, [id, navigate]);

  const lidarComSubmissao = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.warning("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setSalvando(true);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());

      await api.patch(`/api/demand/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success("Solicitação atualizada com sucesso!");
      navigate("/dashboard-cliente");
    } catch (error) {
      console.error("Erro ao atualizar demanda:", error);
      toast.error("Ocorreu um erro ao salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
        <p>A carregar dados da solicitação...</p>
      </div>
    );
  }

  return (
    <div className="secao-servicos-cinza" style={{ minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", background: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
        
        <div style={{ marginBottom: "25px" }}>
          <h2 style={{ margin: 0, fontSize: "24px", color: "#111", fontWeight: "700" }}>Editar Solicitação</h2>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>
            Altere os detalhes abaixo para atualizar o escopo do seu chamado.
          </p>
        </div>

        <form onSubmit={lidarComSubmissao} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Título do Serviço</label>
            <input
              type="text"
              placeholder="Ex: Troca de fiação do chuveiro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px", outline: "none" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>Descrição Detalhada do Problema</label>
            <textarea
              rows="6"
              placeholder="Descreva aqui o que precisa ser feito de forma clara..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px", outline: "none", resize: "none", fontFamily: "inherit", lineHeight: "1.5" }}
            ></textarea>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button
              type="button"
              className="btn-cancelar"
              style={{ flex: 1, padding: "12px", borderRadius: "10px", fontWeight: "600" }}
              onClick={() => navigate("/dashboard-cliente")}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-confirmar"
              style={{ flex: 2, padding: "12px", borderRadius: "10px", fontWeight: "700" }}
              disabled={salvando}
            >
              {salvando ? "A salvar alterações..." : "Salvar Alterações"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditarDemanda;