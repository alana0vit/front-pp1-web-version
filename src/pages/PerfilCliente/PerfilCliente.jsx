import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PerfilCliente.css';

function PerfilCliente() {
  const navegar = useNavigate();
  const fileInputRef = useRef(null);
  const [imagemPerfil, setImagemPerfil] = useState(null);

  const handleCliqueCamera = () => fileInputRef.current.click();
  
  const handleUploadImagem = (event) => {
    const arquivo = event.target.files[0];
    if (arquivo) {
      const urlImagem = URL.createObjectURL(arquivo);
      setImagemPerfil(urlImagem);
    }
  };

  return (
    <div className="perfil-cliente-v10">
      <header className="cabecalho-perfil">
        <div className="info-topo">
          <div className="foto-wrapper">
            <div className="circulo-avatar">
              {imagemPerfil ? <img src={imagemPerfil} alt="Perfil" /> : "M"}
            </div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleUploadImagem} />
            <button className="botao-camera" onClick={handleCliqueCamera}><i className="bi bi-camera-fill"></i></button>
          </div>
          <div className="dados-usuario">
            <span className="etiqueta-membro">Membro desde Março 2024</span>
            <h1>Marian Lopes</h1>
            <p>marian.lopes@email.com</p>
            <button className="botao-editar" onClick={() => navegar('/editar-perfil')}>Editar Perfil</button>
          </div>
        </div>
      </header>

      <div className="grade-conteudo">
        <div className="sessao-ajuda">
          <h2 className="titulo-sessao">Para você</h2>
          <div className="cartao-ajuda">
            <i className="bi bi-chat-dots-fill icone-faq"></i>
            <h3>Central de Ajuda</h3>
            <p>Precisa de suporte ou quer tirar dúvidas sobre a plataforma?</p>
            <button className="botao-faq" onClick={() => navegar('/faq')}>ACESSAR FAQ</button>
          </div>
        </div>

        <div className="sessao-config">
          <h2 className="titulo-sessao">Configurações</h2>
          <div className="cartao-config">
            <div className="lista-itens">
              <div className="item-linha" onClick={() => navegar('/editar-perfil')}>
                <i className="bi bi-person-lock"></i>
                <div className="texto-item">
                  <strong>Privacidade</strong>
                  <span>Meus dados e acessos</span>
                </div>
                <i className="bi bi-chevron-right"></i>
              </div>
              <div className="item-linha">
                <i className="bi bi-bell"></i>
                <div className="texto-item">
                  <strong>Notificações</strong>
                  <span>Alertas e mensagens</span>
                </div>
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
            <button className="botao-sair">Sair da conta</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilCliente;