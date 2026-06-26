import { useNavigate, Link } from 'react-router-dom';
import './EsqueceuSenha.css';

const EsqueceuSenha = () => {
  const navigate = useNavigate();

  return (
    <div className="esqueceu-senha-container">
      <div className="esqueceu-senha-card">
        <h2>Recuperar Senha</h2>
        <p>Digite seu e-mail abaixo. Enviaremos um link para você definir uma nova senha.</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <button type="submit" className="btn-esqueceu-submit">
            Enviar Link de Recuperação
          </button>
        </form>

        <div className="esqueceu-senha-footer">
          <span>
            Lembrou da senha? <Link to="/login">Voltar para o login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EsqueceuSenha;