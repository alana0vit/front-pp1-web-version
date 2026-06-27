import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import './HistoricoAvaliacoes.css';

function HistoricoAvaliacoes({ profissionalId, profissionalNome, onClose }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!profissionalId) return;

    const buscar = async () => {
      try {
        const res = await api.get(`/api/rating/user/${profissionalId}`);
        setAvaliacoes(Array.isArray(res.data) ? res.data : []);
      } catch {
        toast.error('Não foi possível carregar as avaliações.');
      } finally {
        setCarregando(false);
      }
    };

    buscar();
  }, [profissionalId]);

  const media = avaliacoes.length > 0
    ? (avaliacoes.reduce((sum, a) => sum + (a.points || 0), 0) / avaliacoes.length).toFixed(1)
    : null;

  return (
    <div className="historico-overlay" onClick={onClose}>
      <div className="historico-modal" onClick={(e) => e.stopPropagation()}>

        <div className="historico-modal-header">
          <h3>Avaliações — {profissionalNome}</h3>
          <button onClick={onClose}><i className="bi bi-x-lg"></i></button>
        </div>

        {media && (
          <div className="historico-resumo">
            <span className="historico-nota-grande">{media}</span>
            <div>
              <div className="historico-estrelas-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <i key={s} className={`bi ${s <= Math.round(Number(media)) ? 'bi-star-fill' : 'bi-star'}`}></i>
                ))}
              </div>
              <div className="historico-total-label">{avaliacoes.length} avaliação{avaliacoes.length !== 1 ? 'ões' : ''}</div>
            </div>
          </div>
        )}

        <div className="historico-lista">
          {carregando ? (
            <div className="historico-estado">
              <i className="bi bi-hourglass-split"></i>
              <p>Carregando avaliações...</p>
            </div>
          ) : avaliacoes.length === 0 ? (
            <div className="historico-estado">
              <i className="bi bi-chat-square"></i>
              <p>Este profissional ainda não recebeu avaliações.</p>
            </div>
          ) : (
            avaliacoes.map((av, i) => (
              <div key={av.id ?? i} className="historico-item">
                <div className="historico-item-header">
                  <span>
                    {av.anonymous
                      ? <span className="historico-anonimo">Avaliador anônimo</span>
                      : <span className="historico-avaliador">{av.evaluatingPerson?.name || 'Cliente'}</span>
                    }
                  </span>
                  <div className="historico-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <i key={s} className={`bi bi-star-fill ${s > av.points ? 'vazia' : ''}`}></i>
                    ))}
                  </div>
                </div>

                {av.description && (
                  <p className="historico-comentario">{av.description}</p>
                )}

                {av.photos && av.photos.length > 0 && (
                  <div className="historico-fotos">
                    {av.photos.map((foto, j) => (
                      <img key={j} src={foto} alt={`Foto ${j + 1}`} />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default HistoricoAvaliacoes;
