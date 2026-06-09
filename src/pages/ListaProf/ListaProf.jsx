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

  const [filtroEstrelas, setFiltroEstrelas] = useState("TODOS");

  const reassignDemandId = location.state?.reassignDemandId || null;

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

  const lidarComSelecaoProfissional = async (professionalId) => {
    if (reassignDemandId) {
      try {
        await api.patch(`/api/demand/${reassignDemandId}/reassign`, {
          professionalId: professionalId
        });
        
        toast.success("Demanda reatribuída com sucesso para o novo profissional!");
        navigate("/dashboard-cliente");
      } catch (error) {
        console.error("Erro ao reatribuir demanda:", error);
        toast.error("Erro ao reatribuir este chamado. Tente novamente.");
      }
    } else {
      navigate("/solicitar-servico", {
        state: { professionalIdSelecionado: professionalId },
      });
    }
  };

  const profissionaisFiltrados = profissionais.filter((prof) => {
    const notaProf = prof.rating !== undefined && prof.rating !== null ? prof.rating : 5.0;

    if (filtroEstrelas === "4PLUS") return notaProf >= 4.0;
    if (filtroEstrelas === "3PLUS") return notaProf >= 3.0;
    if (filtroEstrelas === "NEW") return prof.rating === null || prof.rating === undefined;

    return true;
  });

  const coresTopo = ["#e6f0ff", "#e6ffe6", "#fff0e6", "#f0e6ff"];

  return (
    <div className="pagina-lista-profissionais">
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

              <div className="filtros-linha">
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
                
                <select
                  className="select-categoria"
                  value={filtroEstrelas}
                  onChange={(e) => setFiltroEstrelas(e.target.value)}
                  style={{ border: "1px solid #0066ff", color: "#0066ff", fontWeight: "600" }}
                >
                  <option value="TODOS">⭐ Todas as Notas</option>
                  <option value="4PLUS">⭐ 4.0 estrelas ou mais</option>
                  <option value="3PLUS">⭐ 3.0 estrelas ou mais</option>
                  <option value="NEW">⭐ Apenas Novos (Sem Nota)</option>
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

          {profissionaisFiltrados.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>
              Nenhum profissional encontrado para os filtros selecionados.
            </p>
          ) : (
            <div className="grade-profissionais">
              {profissionaisFiltrados.map((prof, index) => {
                const notaExibida = prof.rating !== undefined && prof.rating !== null ? prof.rating.toFixed(1) : "5.0";
                
                return (
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
                        <strong>{notaExibida}</strong>
                        <span className="total-avaliacoes">
                          ({prof.rating !== null && prof.rating !== undefined ? "Avaliado" : "Novo"})
                        </span>
                      </div>

                      <button
                        className="btn-ponto-cartao"
                        style={{ backgroundColor: reassignDemandId ? '#28a745' : '', borderColor: reassignDemandId ? '#28a745' : '' }}
                        onClick={() => lidarComSelecaoProfissional(prof.id)}
                      >
                        {reassignDemandId ? 'Reatribuir a Este' : 'Solicitar Serviço'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ListaProf;