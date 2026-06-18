import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './SolicServico.css';

function SolicServico() {
  const navigate = useNavigate();
  const location = useLocation();

  const professionalId = location.state?.professionalIdSelecionado;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [addressId, setAddressId] = useState('');
  const [categoryId, setCategoryId] = useState('');       
  const [suggestedValue, setSuggestedValue] = useState('');
  const [suggestedDate, setSuggestedDate] = useState('');
  const [imagem, setImagem] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [profName, setProfName] = useState('');

  const userStorage = localStorage.getItem('@ConectaPro:user');
  const usuarioLogado = userStorage ? JSON.parse(userStorage) : null;
  const clientId = usuarioLogado?.id;

  const hoje = new Date().toISOString().split('T')[0];                
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  useEffect(() => {
    const carregarDados = async () => {
      if (!clientId) return;
      try {
        const [addrRes, catRes, profRes] = await Promise.all([
          api.get(`/api/user/${clientId}/addresses`),
          api.get('/api/category'),
          professionalId
            ? api.get(`/api/user/${professionalId}`)
            : Promise.resolve({ data: { name: '', categories: [] } }),
        ]);
        setAddresses(addrRes.data);
        if (addrRes.data.length > 0) setAddressId(addrRes.data[0].id);
        setCategorias(catRes.data);
        setProfName(profRes.data.name);

        const primeiraCategoria = profRes.data.categories?.[0];
        if (primeiraCategoria) {
          setCategoryId(primeiraCategoria.id);
        } else if (catRes.data.length > 0) {
          setCategoryId(catRes.data[0].id);   
        }
      } catch (error) {
        console.error('Erro ao carregar dados', error);
      }
    };
    carregarDados();
  }, [clientId, professionalId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !addressId || !categoryId) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    if (suggestedDate) {
      const dataSelecionada = new Date(suggestedDate + 'T00:00:00');
      const hojeDate = new Date(hoje + 'T00:00:00');
      const maxDateObj = new Date(maxDateStr + 'T00:00:00');

      if (dataSelecionada <= hojeDate) {
        toast.error('A data sugerida deve ser futura.');
        return;
      }
      if (dataSelecionada > maxDateObj) {
        toast.error('A data sugerida não pode ultrapassar 1 ano a partir de hoje.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('addressId', addressId);
    formData.append('categoryId', categoryId);
    formData.append('clientId', clientId);
    formData.append('professionalId', professionalId);
    if (suggestedValue) formData.append('suggestedValue', suggestedValue);
    if (suggestedDate) formData.append('suggestedDate', suggestedDate);
    if (imagem) formData.append('imagem', imagem);

    try {
      await api.post('/api/demand', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Solicitação enviada com sucesso!');
      navigate('/dashboard-cliente');
    } catch (error) {
      console.error('Erro ao criar demanda:', error);
      toast.error('Erro ao enviar solicitação.');
    }
  };

  if (!professionalId) {
    return <p>Nenhum profissional selecionado.</p>;
  }

  return (
    <div className="solic-container">
      <div className="solic-card">
        <button className="btn-voltar-solic" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Voltar
        </button>

        <h2>Solicitar Serviço</h2>
        {profName && (
          <p className="prof-destaque-solic">
            Profissional: <strong>{profName}</strong>
          </p>
        )}

        <form onSubmit={onSubmit} className="solic-form">
          <div className="input-group">
            <label>Título do Chamado *</label>
            <input
              type="text"
              placeholder="Ex: Conserto de torneira"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Descrição *</label>
            <textarea
              rows="5"
              placeholder="Descreva o serviço detalhadamente..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Endereço *</label>
            <select value={addressId} onChange={(e) => setAddressId(e.target.value)}>
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.street}, {a.number} - {a.neighborhood}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Categoria (definida pelo profissional)</label>
            <select value={categoryId} disabled>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Valor sugerido (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="Opcional"
              value={suggestedValue}
              onChange={(e) => setSuggestedValue(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Data sugerida</label>
            <input
              type="date"
              value={suggestedDate}
              min={hoje}             
              max={maxDateStr}       
              onChange={(e) => setSuggestedDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Imagem (opcional)</label>
            <input
              type="file"
              id="imagemDemanda"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn-enviar-solic">
            Enviar Solicitação
          </button>
        </form>
      </div>
    </div>
  );
}

export default SolicServico;
