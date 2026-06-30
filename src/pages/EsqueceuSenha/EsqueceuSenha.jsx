import { useState } from 'react'; // 1. Adicione o useState
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // 2. Adicione o toast
import api from '../../services/api'; // 3. Importe sua instância da api
import './EsqueceuSenha.css';

const EsqueceuSenha = () => {
  const [email, setEmail] = useState(''); // 4. Estado para o e-mail
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 5. Chamada para o seu back-end
      await api.post('/auth/forgot-password', { email });
      
      toast.success('Link de recuperação enviado para seu e-mail!');
    } catch (error) {
      toast.error('Erro ao enviar e-mail. Verifique se o e-mail está cadastrado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="esqueceu-senha-container">
      <div className="esqueceu-senha-card">
        <h2>Recuperar Senha</h2>
        <p>Digite seu e-mail abaixo. Enviaremos um link para você definir uma nova senha.</p>

        {/* 6. Chame a função handleSubmit aqui */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-esqueceu-submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
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