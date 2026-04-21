import { useNavigate } from 'react-router-dom';
import './PerfilProfissional.css';

function PerfilProfissional() {
  const navigate = useNavigate();

  return (
    <div className="perfil-dashboard-bg">
      <div className="perfil-dashboard-container">
        
        <header className="perfil-header-status">
          <div className="perfil-avatar-wrapper">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop" alt="Ricardo Silva" />
          </div>
          <div className="perfil-identidade">
            <h1>Ricardo Silva</h1>
            <p>Membro desde: Março de 2024</p>
            <div className="perfil-badges">
              <span className="badge-azul">Desenvolvedor Full Stack</span>
              <span className="badge-azul">⭐ 4.9</span>
            </div>
          </div>
        </header>

        <div className="perfil-conteudo-grid">
          
          <section className="coluna-perfil-v4">
            <h2>Para você</h2>
            <div className="card-dashboard-v4">
              <div className="icon-apresentacao">
                <i className="bi bi-patch-check"></i>
              </div>
              <h3>Apresentação Profissional</h3>
              <p>
                Especialista em transformar ideias em soluções digitais robustas. 
                Com vasta experiência em desenvolvimento web, entrego projetos 
                focados em performance, segurança e uma experiência de usuário impecável.
              </p>
              
              <div className="tags-container-azul">
                <span className="tag-azul-claro">React.js</span>
                <span className="tag-azul-claro">Node.js</span>
                <span className="tag-azul-claro">Spring Boot</span>
                <span className="tag-azul-claro">MySQL</span>
              </div>
            </div>
          </section>

          <section className="coluna-perfil-v4">
            <h2>Configurações do Serviço</h2>
            <div className="card-dashboard-v4">
              <div className="lista-opcoes-v4">
                <div className="opcao-item-v4">
                  <div className="icon-circulo-azul"><i className="bi bi-calendar3"></i></div>
                  <div className="opcao-texto">
                    <strong>Disponibilidade</strong>
                    <span>Segunda a Sexta, 08h às 18h</span>
                  </div>
                  <i className="bi bi-chevron-right seta"></i>
                </div>

                <div className="opcao-item-v4">
                  <div className="icon-circulo-azul"><i className="bi bi-geo-alt"></i></div>
                  <div className="opcao-texto">
                    <strong>Localização</strong>
                    <span>Atendimento Remoto e Presencial (Recife)</span>
                  </div>
                  <i className="bi bi-chevron-right seta"></i>
                </div>
              </div>

              <div className="espacador"></div>

              <button 
                className="btn-solicitar-v4" 
                onClick={() => navigate('/solicitar-servico')}
              >
                Solicitar Serviço
              </button>
              
              <p className="aviso-v4">Negociação direta com o profissional.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default PerfilProfissional;