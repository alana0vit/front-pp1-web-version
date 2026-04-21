import imagemDash from '../../assets/imgdash.png';
import './DashboardCliente.css';

function DashboardCliente() {
  return (
    <div className="container-dashboard">
      <section className="secao-topo-branco">
        <div className="conteudo-introducao">
          
          <div className="lado-esquerdo-texto">
            <h1 className="titulo-principal-destaque">
              Olá!<br />
              O que você<br />
              <span className="sublinhado-azul-transparente">precisa hoje?</span>
            </h1>
            <p className="subtitulo-detalhado">
              Encontre os melhores profissionais para realizar seus projetos ou resolver problemas do dia a dia com agilidade, e transforme suas ideias em realidade com total segurança.
            </p>
            
            <div className="bloco-busca-e-categorias">
              <div className="container-busca">
                <i className="bi bi-search"></i>
                <input type="text" placeholder="Ex: Eletricista, Design, Limpeza..." />
                <button className="btn-buscar-dashboard">Buscar</button>
              </div>

              <div className="grade-categorias">
                <button><i className="bi bi-tools"></i> Manutenção</button>
                <button><i className="bi bi-laptop"></i> Tecnologia</button>
                <button><i className="bi bi-palette"></i> Design</button>
                <button><i className="bi bi-house-door"></i> Serviços Domésticos</button>
              </div>
            </div>
          </div>

          <div className="lado-direito-imagem">
            <img src={imagemDash} alt="Ilustração Dashboard ConectaPro" />
          </div>

        </div>
      </section>

      <section className="secao-servicos-cinza">
        <div className="cabecalho-servicos">
          <h2>Como estão seus serviços?</h2>
          <p>Acompanhe cada etapa com total segurança e transparência.</p>
        </div>

        <div className="acao-solicitar">
          <button className="btn-azul-solicitar">
            <i className="bi bi-plus-circle"></i> Solicitar Novo Serviço
          </button>
        </div>

        <div className="layout-dashboard-baixo">
          <div className="coluna-status">
            <div className="cartao-contador-status">
              <div className="numero-status">0</div>
              <p>Pedidos em Andamento</p>
              <i className="bi bi-play-circle-fill icone-status-azul"></i>
            </div>
            
            <div className="cartao-contador-status">
              <div className="numero-status">0</div>
              <p>Aguardando Orçamento</p>
              <i className="bi bi-clock-fill icone-status-amarelo"></i>
            </div>

            <div className="cartao-contador-status">
              <div className="numero-status">0</div>
              <p>Serviços Finalizados</p>
              <i className="bi bi-check-circle-fill icone-status-verde"></i>
            </div>
          </div>

          <div className="coluna-pedidos-recentes">
            <div className="cartao-pedidos-painel">
              <h3>Pedidos Recentes</h3>
              <div className="conteudo-vazio-pedidos">
                <i className="bi bi-clipboard-x"></i>
                <p>Você ainda não realizou nenhum pedido.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardCliente;