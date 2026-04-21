import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api'; // Certifique-se de que o caminho do Axios está correto
import imgSolic from '../../assets/imgsolic.jpg';
import './SolicServico.css';

function SolicServico() {
  const navegar = useNavigate();
  const location = useLocation();
  
  // Recupera o ID do profissional passado na tela de ListaProf (ex: onClick={() => navegar('/solicitar', { state: { profId: pro.id } })})
  // Se não vier nada (para testes diretos na URL), usamos um fallback (null)
  const professionalId = location.state?.profId || 1; // Mude 1 para null quando estiver 100% integrado

  const [dadosFormulario, setDadosFormulario] = useState({
    categoria: 'Manutenção',
    titulo: '',
    descricao: '',
    urgencia: 'Normal'
  });

  const lidarComMudanca = (e) => {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  };

  const enviarSolicitacao = async (e) => {
    e.preventDefault();

    try {
      // 1. Pega os dados do cliente logado no LocalStorage
      const userStorage = localStorage.getItem('@ConectaPro:user');
      if (!userStorage) {
        toast.error("Você precisa estar logado para solicitar um serviço.");
        navegar('/login');
        return;
      }
      
      const usuarioLogado = JSON.parse(userStorage);

      // 2. Monta o Payload (JSON) exatamente como o DemandRequest.java exige
      const payload = {
        code: `REQ-${Math.floor(Math.random() * 10000)}`, // Gerador simples de código único
        title: dadosFormulario.titulo,
        description: dadosFormulario.descricao,
        imgUrl: "", // Vazio por enquanto, se implementar upload real precisa hospedar a imagem (ex: AWS S3 ou Firebase)
        addressId: 1, // TODO: Substituir pelo ID real do endereço do cliente (pode buscar da API de perfil antes)
        categoryId: 1, // TODO: Substituir pelo ID real da categoria (pode vir de um <select> puxando do banco)
        clientId: usuarioLogado.id, // O ID de quem está logado
        professionalId: professionalId, // O ID do profissional escolhido
        demandStatus: "OPENED" // Sempre nasce como OPENED, conforme o Enum do backend
      };

      // 3. Dispara para a API
      await api.post('/api/demand', payload);

      // 4. Sucesso!
      toast.success("Solicitação enviada com sucesso!");
      navegar('/dashboard-cliente'); // Ajuste para o nome correto da rota do seu dashboard

    } catch (error) {
      console.error("Erro ao enviar demanda:", error);
      toast.error("Ocorreu um erro ao enviar a solicitação. Tente novamente.");
    }
  };

  return (
    <div className="pagina-solicitar-servico">
      <div className="container-solicitacao">
        
        <div className="lado-informativo">
          <p className="tag-ajuda">ESTAMOS AQUI PARA TE AJUDAR!</p>
          <h1 className="titulo-solicitacao">Tudo pronto para começar seu projeto?</h1>
          <p className="texto-apoio">
            Descreva o que você precisa abaixo. Assim que receber sua solicitação, 
            o profissional analisará seu pedido e entrará em contato com você o 
            mais rápido possível para conversar sobre os detalhes.
          </p>
          <div className="wrapper-imagem">
            <img src={imgSolic} alt="Ilustração Suporte" />
          </div>
        </div>

        <div className="lado-formulario">
          {/* Atualizamos o onSubmit para chamar a nossa nova função */}
          <form className="card-formulario" onSubmit={enviarSolicitacao}>

            <div className="campo-formulario">
              <label>O que você precisa?</label>
              <input 
                type="text" 
                name="titulo" 
                placeholder="Ex: Conserto de ar condicionado" 
                onChange={lidarComMudanca} 
                required 
              />
            </div>

            <div className="campo-formulario">
              <label>Detalhes do Serviço</label>
              <textarea 
                name="descricao" 
                placeholder="Digite sua mensagem detalhando o serviço..." 
                onChange={lidarComMudanca} 
                required 
              />
            </div>

            <div className="campo-formulario">
              <label>Urgência</label>
              <select name="urgencia" onChange={lidarComMudanca}>
                <option value="Normal">Normal</option>
                <option value="Urgente">Urgente</option>
                <option value="Planejado">Planejado</option>
              </select>
            </div>

            <div className="campo-formulario">
              <label>Adicionar foto (opcional)</label>
              <div className="upload-foto">
                <input type="file" id="foto-servico" hidden />
                <label htmlFor="foto-servico" className="label-upload">
                  <i className="bi bi-camera"></i> Clique para anexar
                </label>
              </div>
            </div>

            <button type="submit" className="btn-enviar">Enviar Solicitação</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default SolicServico;