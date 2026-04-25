import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imagemBusca from '../../assets/ImgLista1.jpg'; // Verifique a capitalização correta do ficheiro
import api from '../../services/api';
import './ListaProf.css';

function ListaProf() {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');

  const buscarProfissionais = async (filtros = {}) => {
    try {
      let response;

      const temFiltros = Object.values(filtros).some(v => v !== undefined && v !== '');

      if (temFiltros) {
        response = await api.get('/api/user/search', {
          params: filtros
        });
      } else {
        response = await api.get('/api/user');
      }

      const apenasProfissionais = response.data.filter(
        u => u.userType === 'PROFESSIONAL'
      );

      setProfissionais(apenasProfissionais);

    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
    }
  };

  useEffect(() => {
    buscarProfissionais();

    api.get('/api/category')
      .then(res => setCategorias(res.data))
      .catch(err => console.error(err));

  }, []);

  const lidarComBusca = (e) => {
    e.preventDefault();

    buscarProfissionais({
      name: termoBusca,
      categoryId: categoriaSelecionada || undefined
    });
  };

  const pegarLocalizacao = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      buscarProfissionais({
        name: termoBusca,
        categoryId: categoriaSelecionada || undefined,
        latitude: lat,
        longitude: lng,
        radiusKm: 20
      });
    });
  };

  const coresTopo = ["#e6f0ff", "#e6ffe6", "#fff0e6", "#f0e6ff"];

  return (
    <div className="pagina-lista-profissionais">
      <section className="topo-busca-dividido">
        <div className="conteudo-topo-busca">

          <div className="lado-esquerdo-busca">
            <h1 className="titulo-principal-lista">
              Encontre o<br />
              <span className="sublinhado-azul-transparente">talento certo!</span>
            </h1>
            <p className="subtitulo-lista-detalhado">
              Explore nossa rede de profissionais qualificados prontos para realizar o seu projeto.
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
                <button type="submit" className="btn-buscar-lista">Buscar</button>
              </form>

              <div className="filtros-linha">
                <select
                  className="select-categoria"
                  value={categoriaSelecionada}
                  onChange={(e) => setCategoriaSelecionada(e.target.value)}
                >
                  <option value="">Todas categorias</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="btn-localizacao"
                  onClick={pegarLocalizacao}
                >
                  📍 Perto de mim
                </button>
              </div>
            </div>
          </div>

          <div className="lado-direito-imagem">
            <img src={imagemBusca} alt="Busca Profissionais" className="imagem-hero-lista" />
          </div>

        </div>
      </section>

      <section className="conteudo-grade-profissionais">
        <div className="container-alinhado">
          <h2 className="titulo-sessao">Profissionais Disponíveis</h2>

          {profissionais.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>Nenhum profissional encontrado com este nome.</p>
          ) : (
            <div className="grade-profissionais">
              {profissionais.map((prof, index) => (
                <div key={prof.id} className="cartao-profissional-moderno">
                  <div
                    className="topo-colorido-cartao"
                    style={{ backgroundColor: coresTopo[index % coresTopo.length] }}
                  ></div>

                  <div className="corpo-cartao">
                    <div className="avatar-profissional-sobreposto">
                      <span>{prof.name.charAt(0).toUpperCase()}</span>
                    </div>

                    <h3 className="nome-profissional">{prof.name}</h3>
                    <p className="especialidade-cartao">{prof.phone}</p>

                    <div className="avaliacao-profissional">
                      <i className="bi bi-star-fill"></i>
                      <strong>5.0</strong>
                      <span className="total-avaliacoes">(Novo)</span>
                    </div>

                    <button
                      className="btn-ponto-cartao"
                      onClick={() => navigate('/solicitar-servico', { state: { profId: prof.id } })}
                    >
                      Solicitar Serviço
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