import { useNavigate } from 'react-router-dom';
import './EsqueceuSenha.css';

function EsqueceuSenha() {
  const navigate = useNavigate();

  return (
    <div className="esqueceu-senha-container">
      <div className="esqueceu-senha-card">
        <button className="btn-voltar" onClick={() => navigate('/login')}>
          <i className="bi bi-arrow-left"></i> Voltar
        </button>
        <h2 className="serif-font">Recuperar Senha</h2>
        <p className="subtitle">Digite seu e-mail abaixo. Enviaremos um link para você definir uma nova senha.</p>

        <form className="esqueceu-senha-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label>E-mail cadastrado</label>
            <input type="email" placeholder="exemplo@email.com" required />
          </div>

          <div className="botoes-acao">
            <button type="button" className="btn-cancelar" onClick={() => navigate('/login')}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              Enviar Link de Recuperação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EsqueceuSenha;