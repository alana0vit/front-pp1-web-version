import './TermosDeUso.css';

function TermosDeUso() {
  
  const handleVoltar = () => {
    window.close();
  };

  return (
    <div className="pagina-termos">
      <div className="cartao-termos">
        
        <div className="cabecalho-cartao">
          <h1>Termos de Uso</h1>
          <p className="atualizacao">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="conteudo-texto-termos">
          <section>
            <h3>1. Aceitação dos Termos</h3>
            <p>
              Ao acessar e utilizar a plataforma ConectaPro, você concorda em cumprir e ficar vinculado 
              aos seguintes termos e condições de uso. Se você não concordar com qualquer parte 
              destes termos, não deverá utilizar nossos serviços.
            </p>
          </section>

          <section>
            <h3>2. Cadastro e Segurança</h3>
            <p>
              O usuário é responsável por fornecer informações verídicas no ato do cadastro. 
              Você é o único responsável por manter a confidencialidade das suas credenciais de login e 
              por todas as atividades que ocorrerem sob a sua conta. Notifique-nos imediatamente 
              sobre qualquer uso não autorizado.
            </p>
          </section>

          <section>
            <h3>3. Natureza do Serviço</h3>
            <p>
              A ConectaPro atua exclusivamente como uma ferramenta de aproximação e intermediação 
              entre Clientes e Profissionais. Não fazemos parte da relação contratual 
              direta estabelecida entre as partes, não possuímos vínculo empregatício com os 
              prestadores e não garantimos a qualidade ou a idoneidade de qualquer usuário.
            </p>
          </section>

          <section className="alerta-box">
            <h3>4. Exclusão de Responsabilidade (IMPORTANTE)</h3>
            <p>
              A plataforma <strong>não se responsabiliza</strong> por quaisquer danos diretos, 
              indiretos, materiais ou morais decorrentes das negociações, encontros presenciais 
              ou serviços prestados. Toda e qualquer interação, seja no ambiente virtual ou 
              físico, ocorre por conta e risco exclusivo dos usuários. 
            </p>
            <p>
              Não nos responsabilizamos por condutas inadequadas, atos ilícitos, furtos, roubos 
              ou qualquer incidente ocorrido antes, durante ou após a prestação dos serviços. 
              Recomendamos cautela e a verificação prévia de referências ao agendar encontros.
            </p>
          </section>

          <section>
            <h3>5. Privacidade e Proteção de Dados</h3>
            <p>
              O tratamento de seus dados pessoais é regido por nossa Política de Privacidade, 
              em conformidade com a LGPD (Lei Geral de Proteção de Dados). Seus dados de contato 
              só serão exibidos para a outra parte após a aceitação mútua do serviço.
            </p>
          </section>

          <section>
            <h3>6. Conduta do Usuário</h3>
            <p>
              Você concorda em usar a plataforma apenas para fins legais. É estritamente proibido:
            </p>
            <ul>
              <li>Publicar conteúdo ofensivo ou discriminatório;</li>
              <li>Tentar burlar o sistema de segurança da plataforma;</li>
              <li>Utilizar dados de terceiros sem autorização.</li>
            </ul>
          </section>

          <section>
            <h3>7. Modificações nos Termos</h3>
            <p>
              Reservamo-nos o direito de alterar estes termos a qualquer momento. O uso continuado 
              da plataforma após tais alterações constitui sua aceitação dos novos Termos de Uso.
            </p>
          </section>
        </div>

        <div className="container-botao-termos">
          <button onClick={handleVoltar} className="btn-voltar-termos">
            <i className="bi bi-arrow-left"></i> Voltar
          </button>
        </div>

      </div>
    </div>
  );
}

export default TermosDeUso;