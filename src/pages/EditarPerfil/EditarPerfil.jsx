import { useNavigate } from 'react-router-dom';
import './EditarPerfil.css';

function EditarPerfil() {
  const navigate = useNavigate();

  return (
    <div className="editar-perfil-container">
      <div className="editar-perfil-card">
        {/* Botão de Voltar */}
        <button className="btn-voltar" onClick={() => navigate('/')}>
          <i className="bi bi-arrow-left"></i> Voltar
        </button>
        
        <h2 className="serif-font">Editar Perfil</h2>
        <p className="subtitle">Mantenha seus dados atualizados para facilitar o contato.</p>

        <form className="editar-perfil-form">
          <div className="input-group">
            <label>Nome Completo</label>
            <input type="text" placeholder="Marian Lopes" />
          </div>

          <div className="input-group">
            <label>E-mail</label>
            <input type="email" placeholder="marian.lopes@email.com" />
          </div>

          <div className="input-group">
            <label>Telefone / WhatsApp</label>
            <input type="text" placeholder="(81) 98888-7777" />
          </div>

          <div className="input-group">
            <label>Localização (Cidade/Estado)</label>
            <input type="text" placeholder="Jaboatão dos Guararapes, PE" />
          </div>

          <div className="botoes-acao">
            <button type="button" className="btn-cancelar" onClick={() => navigate('/')}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarPerfil;