import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imgSolic from '../../assets/imgsolic.jpg';
import './SolicServico.css';

function SolicServico() {
  const navegar = useNavigate();
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
          <form className="card-formulario" onSubmit={(e) => { e.preventDefault(); navegar('/dashboard'); }}>


            <div className="campo-formulario">
              <label>O que você precisa?</label>
              <input type="text" name="titulo" placeholder="Ex: Conserto de ar condicionado" onChange={lidarComMudanca} required />
            </div>

            <div className="campo-formulario">
              <label>Detalhes do Serviço</label>
              <textarea name="descricao" placeholder="Digite sua mensagem detalhando o serviço..." onChange={lidarComMudanca} required />
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