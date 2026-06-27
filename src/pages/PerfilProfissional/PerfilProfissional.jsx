import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import HistoricoAvaliacoes from '../../components/HistoricoAvaliacoes';
import './PerfilProfissional.css';

function PerfilProfissional() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [mostrarAvaliacoes, setMostrarAvaliacoes] = useState(false);

  const userStorage = localStorage.getItem('@ConectaPro:user');
  const usuarioLogado = userStorage ? JSON.parse(userStorage) : null;

  useEffect(() => {
    if (!usuarioLogado?.id) return;
    api.get(`/api/user/${usuarioLogado.id}`)
      .then((res) => setUsuario(res.data))
      .catch(() => toast.error('Não foi possível carregar os dados do perfil.'));
  }, []);

  const inicial = usuario?.name ? usuario.name.charAt(0).toUpperCase() : '?';
  const categorias = usuario?.categories || [];

  return (
    <div className="perfil-dashboard-bg">
      <div className="perfil-dashboard-container">

        <header className="perfil-header-status">
          <div className="perfil-avatar-wrapper">
            <div className="perfil-avatar-inicial">{inicial}</div>
          </div>
          <div className="perfil-identidade">
            <h1>{usuario?.name || usuarioLogado?.name || '—'}</h1>
            {usuario?.email && <p>{usuario.email}</p>}
            <div className="perfil-badges">
              {categorias.map((cat) => (
                <span key={cat.id} className="badge-azul">{cat.name}</span>
              ))}
              {usuario?.rating != null ? (
                <span className="badge-azul">⭐ {usuario.rating.toFixed(1)}</span>
              ) : (
                <span className="badge-azul">⭐ Sem avaliação</span>
              )}
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
              <h3>Sua Apresentação</h3>
              <p>
                {categorias.length > 0
                  ? `Especialista em ${categorias.map((c) => c.name).join(', ')}.`
                  : 'Acesse Editar Perfil para definir suas especialidades.'}
              </p>

              {categorias.length > 0 && (
                <div className="tags-container-azul">
                  {categorias.map((cat) => (
                    <span key={cat.id} className="tag-azul-claro">{cat.name}</span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="coluna-perfil-v4">
            <h2>Minha Conta</h2>
            <div className="card-dashboard-v4">
              <div className="lista-opcoes-v4">
                <div className="opcao-item-v4">
                  <div className="icon-circulo-azul"><i className="bi bi-telephone"></i></div>
                  <div className="opcao-texto">
                    <strong>Telefone</strong>
                    <span>{usuario?.phone || 'Não informado'}</span>
                  </div>
                </div>

                <div className="opcao-item-v4">
                  <div className="icon-circulo-azul"><i className="bi bi-envelope"></i></div>
                  <div className="opcao-texto">
                    <strong>E-mail</strong>
                    <span>{usuario?.email || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="espacador"></div>

              <button
                className="btn-solicitar-v4"
                style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}
                onClick={() => setMostrarAvaliacoes(true)}
              >
                <i className="bi bi-star-fill" style={{ color: '#ffc107', marginRight: '6px' }}></i>
                Ver Minhas Avaliações
              </button>

              <button
                className="btn-solicitar-v4"
                style={{ marginTop: '10px' }}
                onClick={() => navigate('/editar-perfil')}
              >
                <i className="bi bi-pencil-square" style={{ marginRight: '6px' }}></i>
                Editar Perfil
              </button>
            </div>
          </section>

        </div>
      </div>

      {mostrarAvaliacoes && usuario && (
        <HistoricoAvaliacoes
          profissionalId={usuario.id}
          profissionalNome={usuario.name}
          onClose={() => setMostrarAvaliacoes(false)}
        />
      )}
    </div>
  );
}

export default PerfilProfissional;
