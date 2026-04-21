import './TermosDeUso.css';

function TermosDeUso() {
  return (
    <div className="pagina-termos">
      <div className="cartao-termos">
        
        <div className="cabecalho-cartao" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1>Termos de Uso</h1>
          <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="conteudo-texto-termos">
          <h3>1. Aceitação dos Termos</h3>
          <p>
            Ao acessar e utilizar esta plataforma, você concorda em cumprir e ficar vinculado 
            aos seguintes termos e condições de uso. Se você não concordar com qualquer parte 
            destes termos, não deverá utilizar nossos serviços.
          </p>

          <h3>2. Cadastro e Segurança</h3>
          <p>
            Você é responsável por manter a confidencialidade das suas credenciais de login e 
            por todas as atividades que ocorrerem sob a sua conta. Notifique-nos imediatamente 
            sobre qualquer uso não autorizado.
          </p>

          <h3>3. Natureza do Serviço</h3>
          <p>
            A plataforma atua exclusivamente como uma ferramenta de aproximação e intermediação 
            entre usuários e prestadores de serviço. Não fazemos parte da relação contratual 
            direta estabelecida entre as partes, não possuímos vínculo empregatício com os 
            prestadores e não garantimos a qualidade ou a idoneidade de qualquer usuário.
          </p>

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
            Recomendamos cautela e a verificação prévia de referências ao agendar encontros presenciais.
          </p>

          <h3>5. Privacidade dos Dados</h3>
          <p>
            O uso de suas informações pessoais é regido por nossa Política de Privacidade. 
            Nós nos comprometemos a proteger seus dados e não compartilhá-los com terceiros 
            sem o seu consentimento explícito.
          </p>

          <h3>6. Conduta do Usuário</h3>
          <p>
            Você concorda em usar a plataforma apenas para fins legais e de maneira que não infrinja 
            os direitos de, restrinja ou iniba o uso e o aproveitamento da plataforma por qualquer 
            terceiro.
          </p>
        </div>

        <div className="container-botao-termos">
          <button onClick={() => window.history.back()} className="btn-voltar-termos">
            Voltar
          </button>
        </div>

      </div>
    </div>
  );
}

export default TermosDeUso;