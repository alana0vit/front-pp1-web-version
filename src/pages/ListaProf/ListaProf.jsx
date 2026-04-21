import { useNavigate } from 'react-router-dom';
import imagemBusca from '../../assets/imgLista1.jpg';
import './ListaProf.css';

function ListaProf() {
  const navigate = useNavigate();

  const profissionais = [
    { id: 1, nome: "Carlos Almeida", categoria: "Manutenção", especialidade: "Eletricista Residencial", nota: 4.9, avaliacoes: 128, corTopo: "#e6f0ff" },
    { id: 2, nome: "Fernanda Souza", categoria: "Tecnologia", especialidade: "Desenvolvedora Frontend", nota: 5.0, avaliacoes: 85, corTopo: "#e6ffe6" },
    { id: 3, nome: "Roberto Dias", categoria: "Serviços Domésticos", especialidade: "Montador de Móveis", nota: 4.7, avaliacoes: 210, corTopo: "#fff0e6" },
    { id: 4, nome: "Aline Santos", categoria: "Design", especialidade: "Designer Gráfico & UI", nota: 4.8, avaliacoes: 94, corTopo: "#f0e6ff" },
    { id: 5, nome: "Márcio Lima", categoria: "Manutenção", especialidade: "Encanador Profissional", nota: 4.6, avaliacoes: 156, corTopo: "#e6f0ff" },
    { id: 6, nome: "Juliana Costa", categoria: "Tecnologia", especialidade: "Suporte Técnico em TI", nota: 4.9, avaliacoes: 62, corTopo: "#e6ffe6" },
  ];

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
              <form className="barra-pesquisa-lista" onSubmit={(e) => e.preventDefault()}>
                <i className="bi bi-search"></i>
                <input type="text" placeholder="Ex: Eletricista, Desenvolvedor..." />
                <button type="submit" className="btn-buscar-lista">Buscar</button>
              </form>
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
          
          <div className="grade-profissionais">
            {profissionais.map(prof => (
              <div key={prof.id} className="cartao-profissional-moderno">
                <div className="topo-colorido-cartao" style={{ backgroundColor: prof.corTopo }}></div>
                
                <div className="corpo-cartao">
                  <div className="avatar-profissional-sobreposto">
                    <span>{prof.nome.charAt(0)}</span>
                  </div>
                  
                  <h3 className="nome-profissional">{prof.nome}</h3>
                  <p className="especialidade-cartao">{prof.especialidade}</p>
                  
                  <div className="avaliacao-profissional">
                    <i className="bi bi-star-fill"></i>
                    <strong>{prof.nota}</strong>
                    <span className="total-avaliacoes">({prof.avaliacoes})</span>
                  </div>

                  <button 
                    className="btn-ponto-cartao" 
                    onClick={() => navigate('/perfil-profissional')}
                  >
                    Ver Perfil Completo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ListaProf;