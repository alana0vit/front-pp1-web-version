import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./SolicServico.css";

function SolicServico() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [enderecos, setEnderecos] = useState([]);
  const [profissional, setProfissional] = useState(null);

  // Captura o ID do profissional de forma flexível vindo da navegação
  const profesionalIdSelecionado =
    location.state?.professionalIdSelecionado || location.state?.profId;

  // Recupera dados do cliente logado no LocalStorage
  const userStorage = localStorage.getItem("@ConectaPro:user");
  const usuarioLogado =
    userStorage && userStorage !== "undefined" ? JSON.parse(userStorage) : null;
  const clienteId = usuarioLogado?.id;

  useEffect(() => {
    if (!clienteId) {
      toast.error("Sessão expirada. Por favor, refaça o login.");
      navigate("/login");
      return;
    }

    // 1. Carrega os endereços cadastrados do Cliente logado
    const carregarEnderecos = async () => {
      try {
        const res = await api.get(`/api/user/${clienteId}/addresses`);
        setEnderecos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erro ao carregar endereços do cliente:", err);
      }
    };

    // 2. Carrega os dados do Profissional selecionado para capturar a Categoria dele automaticamente
    const carregarDadosProfissional = async () => {
      if (!profesionalIdSelecionado) {
        toast.warn("Nenhum profissional foi selecionado.");
        navigate("/lista-profissionais");
        return;
      }
      try {
        const res = await api.get(`/api/user/${profesionalIdSelecionado}`);
        setProfissional(res.data);
      } catch (err) {
        console.error("Erro ao carregar dados do profissional:", err);
        toast.error("Não foi possível identificar o especialista selecionado.");
      }
    };

    carregarEnderecos();
    carregarDadosProfissional();
  }, [clienteId, profesionalIdSelecionado, navigate]);

  const onSubmit = async (data) => {
    if (!data.addressId) {
      toast.warning("Por favor, selecione um endereço cadastrado para o local do serviço.");
      return;
    }

    // Captura de forma segura a categoria associada ao profissional
    const categoriaId =
      profissional?.categories?.length > 0
        ? profissional.categories[0].id
        : null;

    if (!categoriaId) {
      toast.error("Este profissional não possui uma categoria válida vinculada no banco.");
      return;
    }

    try {
      setLoading(true);

      // MONTAGEM DO PAYLOAD ENXUTO E TOTALMENTE COMPATÍVEL COM O DEMANDREQUEST.JAVA
      const demandPayload = {
        title: data.title.trim(),
        description: data.description.trim(),
        addressId: Number(data.addressId),
        categoryId: Number(categoriaId),
        clientId: Number(clienteId),
        professionalId: Number(profesionalIdSelecionado),
        imgUrl: null // 🌟 REMOVIDO: Campo de imagem anulado por padrão para evitar quebra no backend
        // 🌟 REMOVIDO: demandStatus omitido. O DemandService.java injetará o valor nativo direto por código!
      };

      console.log("📤 Enviando payload limpo para o Servidor:", demandPayload);

      // Dispara a requisição HTTP POST para salvar a demanda
      await api.post("/api/demand", demandPayload);

      toast.success("Solicitação de serviço enviada com sucesso!");
      navigate("/dashboard-cliente"); 
    } catch (error) {
      console.error("Erro completo ao criar demanda:", error);
      
      const msgBackend =
        error.response?.data?.message ||
        error.response?.data ||
        "Verifique se preencheu todos os campos obrigatórios corretamente.";
        
      toast.error(`Falha no envio: ${msgBackend}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solic-container">
      <div className="solic-card">
        <button
          type="button"
          className="btn-voltar-solic"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i> Voltar
        </button>

        <h2>Solicitar Serviço</h2>
        {profissional && (
          <p className="prof-destaque-solic">
            Você está enviando esta solicitação para:{" "}
            <strong>{profissional.name}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="solic-form">
          <div className="input-group">
            <label>Título do Chamado *</label>
            <input
              type="text"
              placeholder="Ex: Reparo em infiltração no banheiro"
              {...register("title", { required: true })}
            />
          </div>

          <div className="input-group">
            <label>Descrição Detalhada *</label>
            <textarea
              rows="5"
              placeholder="Descreva o que precisa ser feito com o máximo de detalhes possível..."
              {...register("description", { required: true })}
            ></textarea>
          </div>

          <div className="input-group">
            <label>Selecione o Local do Serviço *</label>
            <select {...register("addressId", { required: true })}>
              <option value="">Selecione um endereço cadastrado...</option>
              {enderecos.map((end) => (
                <option key={end.id} value={end.id}>
                  {end.street}, {end.number} - {end.neighborhood} ({end.city})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-enviar-solic" disabled={loading}>
            {loading ? "Enviando Chamado..." : "Confirmar e Enviar Solicitação"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SolicServico;