import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import imagemBusca from '../../assets/ImgLista1.jpg'; // Verifique a capitalização correta do ficheiro
import './ListaProf.css';

function ListaProf() {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  // 1. CORREÇÃO: Declaramos a função ANTES do useEffect para evitar o erro de inicialização
  const buscarProfissionais = async (nome = '') => {
    try {
      const response = await api.get('/api/user/search', {
        params: { name: nome || null }
      });
      
      const apenasProfissionais = response.data.filter(u => u.userType === 'PROFESSIONAL');
      setProfissionais(apenasProfissionais);
    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
    }
  };

  // 2. Agora o useEffect pode chamar a função em segurança
  useEffect(() => {
    buscarProfissionais();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lidarComBusca = (e) => {
    e.preventDefault();
    buscarProfissionais(termoBusca);
  };

  // 3. CORREÇÃO: Array de cores fixo para usar de forma determinística ("pura")
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
              {/* Adicionamos o 'index' ao map para distribuir as cores de forma pura */}
              {profissionais.map((prof, index) => (
                <div key={prof.id} className="cartao-profissional-moderno">
                  {/* Usamos o resto da divisão para intercalar as cores perfeitamente */}
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