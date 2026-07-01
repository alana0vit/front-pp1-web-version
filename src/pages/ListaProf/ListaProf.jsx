import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import imagemBusca from "../../assets/ImgLista1.jpg";
import api from "../../services/api";
import HistoricoAvaliacoes from "../../components/HistoricoAvaliacoes";
import "./ListaProf.css";
import { getImageUrl } from "../../utils/imageUtils";

const INTERVALO_REFRESH = 30_000;

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
  const [raioKm, setRaioKm] = useState(20);
  const [modalAvaliacoes, setModalAvaliacoes] = useState(null);

  // Guarda os últimos filtros usados para o refresh automático repetir a mesma busca,
  // em vez de resetar para a listagem completa sem filtro.
  const ultimosFiltrosRef = useRef({});

  const buscarProfissionais = async (filtros = {}) => {
    ultimosFiltrosRef.current = filtros;

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

  // Atualiza a lista periodicamente (em background) para refletir notas e
  // avaliações novas, repetindo o último filtro usado pelo usuário.
  useEffect(() => {
    const id = setInterval(() => {
      buscarProfissionais(ultimosFiltrosRef.current);
    }, INTERVALO_REFRESH);
    return () => clearInterval(id);
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
      toast.error("A geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        buscarProfissionais({
          name: termoBusca,
          categoryId: categoriaSelecionada || undefined,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          radiusKm: raioKm,
        });
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        toast.error("Não foi possível obter sua localização. Verifique as permissões do navegador.");
      },
    );
  };

  const lidarComSelecaoProfissional = async (professionalId) => {
    if (reassignDemandId) {
      try {
        await api.patch(`/api/demand/${reassignDemandId}/reassign`, {
          professionalId: professionalId,
        });

        toast.success(
          "Demanda reatribuída com sucesso para o novo profissional!",
        );
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

  const profissionaisFiltrados = profissionais
    .filter((prof) => {
      const matchesTexto = prof.name.toLowerCase().includes(termoBusca.toLowerCase());
      
      if (!matchesTexto) return false;

      if (filtroEstrelas === "4PLUS") {
        return prof.rating !== null && prof.rating !== undefined && prof.rating >= 4.0;
      }
      if (filtroEstrelas === "3PLUS") {
        return prof.rating !== null && prof.rating !== undefined && prof.rating >= 3.0;
      }
      if (filtroEstrelas === "NEW") {
        return prof.rating === null || prof.rating === undefined;
      }

      return true;
    })
    .sort((a, b) => {
      const notaA = a.rating !== null && a.rating !== undefined ? a.rating : -1;
      const notaB = b.rating !== null && b.rating !== undefined ? b.rating : -1;
      
      return notaB - notaA; 
    });

  const coresTopo = ["#e6f0ff", "#e6ffe6", "#fff0e6", "#f0e6ff"];

  return (
    <div className="pagina-lista-profissionais">
      {reassignDemandId && (
        <div
          style={{
            background: "#d4edda",
            color: "#155724",
            padding: "12px",
            textAlign: "center",
            fontWeight: "600",
            borderBottom: "1px solid #c3e6cb",
          }}
        >
          <i className="bi bi-info-circle-fill"></i> Modo de Reatribuição Ativo:
          Escolha um novo profissional abaixo para assumir o seu chamado
          recusado.
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
                  style={{
                    border: "1px solid #0066ff",
                    color: "#0066ff",
                    fontWeight: "600",
                  }}
                >
                  <option value="TODOS">⭐ Todas as Notas</option>
                  <option value="4PLUS">⭐ 4.0 estrelas ou mais</option>
                  <option value="3PLUS">⭐ 3.0 estrelas ou mais</option>
                  <option value="NEW">⭐ Apenas Novos (Sem Nota)</option>
                </select>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <select
                    className="select-categoria"
                    value={raioKm}
                    onChange={(e) => setRaioKm(Number(e.target.value))}
                    title="Raio de busca"
                    style={{ minWidth: "90px" }}
                  >
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={20}>20 km</option>
                    <option value={50}>50 km</option>
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
                          raio máximo de <strong>{raioKm} km</strong> com base nas
                          coordenadas GPS do seu dispositivo.
                        </p>
                      </div>
                    )}
                  </div>
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
  {getImageUrl(prof.photo) ? (
    <img
      src={getImageUrl(prof.photo)}
      alt={prof.name}
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  ) : null}
  <span style={{ display: getImageUrl(prof.photo) ? 'none' : 'flex' }}>
    {prof.name ? prof.name.charAt(0).toUpperCase() : "U"}
  </span>
</div>

                      <h3 className="nome-profissional">{prof.name}</h3>
                      {prof.categories && prof.categories.length > 0 ? (
                        <p className="especialidade-cartao">
                          {prof.categories.map((c) => c.name).join(" • ")}
                        </p>
                      ) : (
                        <p className="especialidade-cartao especialidade-vazia">
                          Especialidade não informada
                        </p>
                      )}

                      <div className="avaliacao-profissional">
                        <i
                          className="bi bi-star-fill"
                          style={{ color: prof.rating ? "#ffc107" : "#ccc" }}
                        ></i>
                        {prof.rating !== null && prof.rating !== undefined ? (
                          <strong>{prof.rating.toFixed(1)}</strong>
                        ) : (
                          <span className="total-avaliacoes" style={{ fontWeight: "600", color: "#888" }}>
                            Sem avaliação
                          </span>
                        )}
                      </div>

                      <button
                        className="btn-ver-avaliacoes"
                        onClick={() => setModalAvaliacoes({ id: prof.id, nome: prof.name })}
                      >
                        <i className="bi bi-chat-square-text"></i> Ver avaliações
                      </button>

                      <button
                        className="btn-ponto-cartao"
                        style={{
                          backgroundColor: reassignDemandId ? "#28a745" : "",
                          borderColor: reassignDemandId ? "#28a745" : "",
                        }}
                        onClick={() => lidarComSelecaoProfissional(prof.id)}
                      >
                        {reassignDemandId ? "Reatribuir a Este" : "Solicitar Serviço"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      {modalAvaliacoes && (
        <HistoricoAvaliacoes
          profissionalId={modalAvaliacoes.id}
          profissionalNome={modalAvaliacoes.nome}
          onClose={() => {
            setModalAvaliacoes(null);
            buscarProfissionais(ultimosFiltrosRef.current);
          }}
        />
      )}
    </div>
  );
}

export default ListaProf;