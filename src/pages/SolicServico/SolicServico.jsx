import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import imgSolic from '../../assets/imgsolic.jpg';
import api from '../../services/api';
import './SolicServico.css';

function SolicServico() {
  const navegar = useNavigate();
  const location = useLocation();
  
  const professionalId = location.state?.profId;

  const [categorias, setCategorias] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dadosFormulario, setDadosFormulario] = useState({
    titulo: '',
    description: '',
    categoryId: '',
    addressId: ''
  });

  const userStorage = localStorage.getItem('@ConectaPro:user');
  const usuarioLogado = userStorage ? JSON.parse(userStorage) : null;

  useEffect(() => {
    if (!professionalId) {
      toast.warn("Selecione um profissional antes de solicitar um serviço.");
      navegar('/lista-profissionais');
      return;
    }

    const carregarDadosIniciais = async () => {
      try {
        setLoading(true);
        
        // Busca Categorias Reais da base de dados
        const resCat = await api.get('/api/category');
        setCategorias(resCat.data);

        // Busca Endereços do Utilizador Logado
        if (usuarioLogado?.id) {
          const resEnd = await api.get(`/api/user/${usuarioLogado.id}/addresses`);
          setEnderecos(resEnd.data);
          
          // Se o utilizador tiver apenas um endereço, já deixa selecionado
          if (resEnd.data.length === 1) {
            setDadosFormulario(prev => ({ ...prev, addressId: resEnd.data[0].id }));
          }
        }

      } catch (error) {
        console.error("Erro ao carregar dados para solicitação:", error);
        toast.error("Erro ao carregar categorias ou endereços.");
      } finally {
        setLoading(false);
      }
    };

    carregarDadosIniciais();
  }, [professionalId, navegar, usuarioLogado?.id]);

  const lidarComMudanca = (e) => {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  };

  const enviarSolicitacao = async (e) => {
    e.preventDefault();

    if (!dadosFormulario.addressId || !dadosFormulario.categoryId) {
      toast.error("Por favor, selecione uma categoria e um endereço.");
      return;
    }

    try {
      const payload = {
        title: dadosFormulario.titulo,
        description: dadosFormulario.description,
        
        imgUrl: null, 
        
        addressId: Number(dadosFormulario.addressId),
        categoryId: Number(dadosFormulario.categoryId),
        clientId: usuarioLogado.id, 
        professionalId: Number(professionalId),
        demandStatus: "OPENED" 
      };

      await api.post('/api/demand', payload);

      toast.success("Solicitação enviada com sucesso!");
      navegar('/dashboard-cliente');

    } catch (error) {
      console.error("Erro ao enviar demanda:", error);
      const msgErro = error.response?.data?.message || "Ocorreu um erro ao enviar a solicitação.";
      toast.error(msgErro);
    }
  };

  if (loading) {
    return <div className="pagina-solicitar-servico"><p>A carregar opções...</p></div>;
  }

  return (
    <div className="pagina-solicitar-servico">
      <div className="container-solicitacao">
        
        <div className="lado-informativo">
          <p className="tag-ajuda">ESTAMOS AQUI PARA AJUDAR!</p>
          <h1 className="titulo-solicitacao">Descreva o que precisa</h1>
          <p className="texto-apoio">
            O profissional escolhido receberá os detalhes abaixo e entrará em contacto 
            para conversar sobre o orçamento e prazos.
          </p>
          <div className="wrapper-imagem">
            <img src={imgSolic} alt="Ilustração Solicitação" />
          </div>
        </div>

        <div className="lado-formulario">
          <form className="card-formulario" onSubmit={enviarSolicitacao}>

            <div className="campo-formulario">
              <label>Título do Serviço</label>
              <input 
                type="text" 
                name="titulo" 
                placeholder="Ex: Instalação de chuveiro elétrico" 
                value={dadosFormulario.titulo}
                onChange={lidarComMudanca} 
                required 
              />
            </div>

            <div className="campo-formulario">
              <label>Categoria</label>
              <select 
                name="categoryId" 
                value={dadosFormulario.categoryId} 
                onChange={lidarComMudanca} 
                required
              >
                <option value="">Selecione a categoria...</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="campo-formulario">
              <label>Onde o serviço será realizado?</label>
              <select 
                name="addressId" 
                value={dadosFormulario.addressId} 
                onChange={lidarComMudanca} 
                required
              >
                <option value="">Selecione um dos seus endereços...</option>
                {enderecos.map(end => (
                  <option key={end.id} value={end.id}>
                    {end.street}, {end.number} - {end.city}
                  </option>
                ))}
              </select>
              {enderecos.length === 0 && (
                <p className="aviso-endereco">Nenhum endereço encontrado. Vá ao seu perfil para registar.</p>
              )}
            </div>

            <div className="campo-formulario">
              <label>Descrição Detalhada</label>
              <textarea 
                name="description" 
                placeholder="Explique o problema ou o que precisa ser feito..." 
                value={dadosFormulario.description}
                onChange={lidarComMudanca} 
                required 
              />
            </div>

            <button type="submit" className="btn-enviar">Enviar Pedido ao Profissional</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default SolicServico;