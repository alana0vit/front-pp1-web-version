import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import imagemBusca from '../../assets/ImgLista1.jpg';
import DashboardProfissional from "../DashboardProfissional/DashboardProfissional";
import "../ListaProf/ListaProf.css";

function ListaProf() {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  // Carrega os profissionais assim que a página abre
  useEffect(() => {
    buscarProfissionais();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buscarProfissionais = async (nome = '') => {
    try {
      // Bate na nova rota de search do backend
      const response = await api.get('/api/user/search', {
        params: { name: nome || null } // Se houver nome, envia como query param
      });
      
      // Filtra para garantir que só mostra quem é PROFISSIONAL
      const apenasProfissionais = response.data.filter(u => u.userType === 'PROFESSIONAL');
      setProfissionais(apenasProfissionais);
    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
    }
  };

  const lidarComBusca = (e) => {
    e.preventDefault();
    buscarProfissionais(termoBusca);
  };

  // Função auxiliar para gerar uma cor de topo aleatória para os cartões
  const gerarCorTopo = () => {
    const cores = ["#e6f0ff", "#e6ffe6", "#fff0e6", "#f0e6ff"];
    return cores[Math.floor(Math.random() * cores.length)];
  };

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
            <p style={{textAlign: 'center', marginTop: '2rem'}}>Nenhum profissional encontrado com este nome.</p>
          ) : (
            <div className="grade-profissionais">
              {profissionais.map(prof => (
                <div key={prof.id} className="cartao-profissional-moderno">
                  <div className="topo-colorido-cartao" style={{ backgroundColor: gerarCorTopo() }}></div>
                  
                  <div className="corpo-cartao">
                    <div className="avatar-profissional-sobreposto">
                      <span>{prof.name.charAt(0).toUpperCase()}</span>
                    </div>
                    
                    <h3 className="nome-profissional">{prof.name}</h3>
                    {/* O backend não devolve 'especialidade' diretamente, mas podes mostrar a cidade ou telefone aqui */}
                    <p className="especialidade-cartao">{prof.phone}</p>
                    
                    <div className="avaliacao-profissional">
                      <i className="bi bi-star-fill"></i>
                      <strong>5.0</strong> {/* Fixo por agora, até o backend ter sistema de notas */}
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