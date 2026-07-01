import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-conecta">
      <div className="footer-container">

        <div className="footer-brand">
          <img
            src={logo}
            alt="ConectaPRO"
            style={{ height: "90px", marginBottom: "15px" }}
          />
          <p className="footer-description">
            Conectando talentos a oportunidades
          </p>
          <div className="footer-socials">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Plataforma</h3>
          <ul>
            <li><Link to="/lista-profissionais">Serviços</Link></li>
            <li><Link to="/dashboard-cliente">Meu Painel</Link></li>
            <li><Link to="/faq">Central de Ajuda (FAQ)</Link></li>
            <li><Link to="/fale-conosco">Fale Conosco</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contato Direto</h3>
          <ul>
            <li>
              <a href="mailto:conectapro@conectapro.com" style={{ textDecoration: 'none', color: 'inherit' }}>
                <i className="bi bi-envelope"></i> conectapro@conectapro.com
              </a>
            </li>
            <li>
              <a href="https://wa.me/5581955550000" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <i className="bi bi-whatsapp"></i> (81) 95555-0000
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 ConectaPro LLC - Todos os direitos reservados.</p>
        <div className="footer-bottom-links">
          <Link to="#">Termos de serviço</Link>
          <Link to="#">Política de privacidade</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;