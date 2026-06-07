import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import imagemBusca from "../../assets/ImgLista1.jpg";
import api from "../../services/api";
import "./ListaProf.css";

function ListaProf() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profissionais, setProfissionais] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  // Captura o id da demanda rejeitada caso o cliente queira reatribuir
  const reassignDemandId = location.state?.reassignDemandId || null;

  // Estado para controlar a exibição do pop-up informativo "Perto de mim"
  const [mostrarPopUpLocalizacao, setMostrarPopUpLocalizacao] = useState(false);

  const buscarProfissionais = async (filtros = {}) => {
    try {
      let response;
      const temFiltros = Object.values(filtros).some(
        (v) => v !== undefined && v !== "",
      );

      if (temFiltros) {
        response = await api.get("/api/user/search", {
          params: filtros,
        });
      } else {
        response = await api.get("/api/user");
      }

      const apenasProfissionais = response.data.filter(
        (u) => u.userType === "PROFESSIONAL",
      );

      setProfissionais(apenasProfissionais);
    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
    }
  };

  useEffect(() => {
    buscarProfissionais();

    api
      .get("/api/category")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error(err));
  }, []);

  const lidarComBusca = (e) => {
    e.preventDefault();
    buscarProfissionais({
      name: termoBusca,
      categoryId: categoriaSelecionada || undefined,
    });
  };

  const pegarLocalizacao = () => {
    if (!navigator.geolocation) {
      alert("A geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        buscarProfissionais({
          name: termoBusca,
          categoryId: categoriaSelecionada || undefined,
          latitude: lat,
          longitude: lng,
          radiusKm: 20,
        });
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        alert(
          "Não foi possível obter sua localização. Verifique as permissões do navegador.",
        );
      },
    );
  };

  // Executa a reatribuição chamando o PATCH do backend
  const lidarComSelecaoProfissional = async (professionalId) => {
    if (reassignDemandId) {
      try {
        // Dispara a rota exatamente como mapeada no DemandController.java do backend
        await api.patch(`/api/demand/${reassignDemandId}/reassign`, {
          professionalId: professionalId
        });
        
        toast.success("Demanda reatribuída com sucesso para o novo profissional!");
        navigate("/dashboard-cliente"); // Retorna ao painel principal
      } catch (error) {
        console.error("Erro ao reatribuir demanda:", error);
        toast.error("Erro ao reatribuir este chamado. Tente novamente.");
      }
    } else {
      // Fluxo normal: Envia para o formulário criar uma do zero
      navigate("/solicitar-servico", {
        state: { professionalIdSelecionado: professionalId },
      });
    }
  };

  const coresTopo = ["#e6f0ff", "#e6ffe6", "#fff0e6", "#f0e6ff"];

  return (
    <div className="pagina-lista-profissionais">
      {/* Alerta visual caso esteja em modo de reatribuição */}
      {reassignDemandId && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '12px', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #c3e6cb' }}>
          <i className="bi bi-info-circle-fill"></i> Modo de Reatribuição Ativo: Escolha um novo profissional abaixo para assumir o seu chamado recusado.
        </div>
      )}

      <section className="topo-busca-dividido">
        <div className="conteudo-topo-busca">
          <div className="lado-esquerdo-busca">
            <h1 className="titulo-principal-lista">
              Encontre o<br />
              <span className="sublinhado-azul-transparente">
                talento certo!
              </span>
            </h1>
            <p className="subtitulo-lista-detalhado">
              Explore nossa rede de profissionais qualificados prontos para
              realizar o seu projeto.
            </p>

            <div className="bloco-busca-e-filtros">
              <form className="barra-pesquisa-lista" onSubmit={lidarComBusca}>
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Ex: Carlos, Eletricista..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
                <button type="submit" className="btn-buscar-lista">
                  Buscar
                </button>
              </form>

              <div className="filtros-linha" style={{ position: "relative" }}>
                <select
                  className="select-categoria"
                  value={categoriaSelecionada}
                  onChange={(e) => setCategoriaSelecionada(e.target.value)}
                >
                  <option value="">Todas categorias</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <div
                  className="container-btn-localizacao"
                  style={{ position: "relative", display: "inline-block" }}
                  onMouseEnter={() => setMostrarPopUpLocalizacao(true)}
                  onMouseLeave={() => setMostrarPopUpLocalizacao(false)}
                >
                  <button
                    type="button"
                    className="btn-localizacao"
                    onClick={pegarLocalizacao}
                  >
                    📍 Perto de mim
                  </button>

                  {/* POP-UP INFORMATIVO DO FILTRO PERTO DE MIM */}
                  {mostrarPopUpLocalizacao && (
                    <div className="pop-up-informativo-localizacao">
                      <div className="seta-pop-up"></div>
                      <p>
                        <strong>Busca por Geolocalização:</strong> Filtra
                        automaticamente os prestadores parceiros localizados num
                        raio máximo de <strong>20km</strong> com base nas
                        coordenadas GPS do seu dispositivo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lado-direito-imagem">
            <img
              src={imagemBusca}
              alt="Busca Profissionais"
              className="imagem-hero-lista"
            />
          </div>
        </div>
      </section>

      <section className="conteudo-grade-profissionais">
        <div className="container-alinhado">
          <h2 className="titulo-sessao">Profissionais Disponíveis</h2>

          {profissionais.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>
              Nenhum profissional encontrado.
            </p>
          ) : (
            <div className="grade-profissionais">
              {profissionais.map((prof, index) => (
                <div key={prof.id} className="cartao-profissional-moderno">
                  <div
                    className="topo-colorido-cartao"
                    style={{
                      backgroundColor: coresTopo[index % coresTopo.length],
                    }}
                  ></div>

                  <div className="corpo-cartao">
                    <div className="avatar-profissional-sobreposto">
                      <span>
                        {prof.name ? prof.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>

                    <h3 className="nome-profissional">{prof.name}</h3>
                    <p className="especialidade-cartao">
                      {prof.phone || "Telefone não informado"}
                    </p>

                    <div className="avaliacao-profissional">
                      <i className="bi bi-star-fill"></i>
                      <strong>
                        {prof.rating ? prof.rating.toFixed(1) : "5.0"}
                      </strong>
                      <span className="total-avaliacoes">
                        ({prof.rating ? "Avaliado" : "Novo"})
                      </span>
                    </div>

                    {/* CLIQUE MODIFICADO: Avalia dinamicamente se o intuito é criar ou reatribuir */}
                    <button
                      className="btn-ponto-cartao"
                      style={{ backgroundColor: reassignDemandId ? '#28a745' : '', borderColor: reassignDemandId ? '#28a745' : '' }}
                      onClick={() => lidarComSelecaoProfissional(prof.id)}
                    >
                      {reassignDemandId ? 'Reatribuir a Este' : 'Solicitar Serviço'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ListaProf;