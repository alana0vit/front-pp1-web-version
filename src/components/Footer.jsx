import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Coluna 1: Redes Sociais */}
        <div className="footer-column">
          <h3>Nossas Redes</h3>
          <div className="footer-links">
            <a href="#"><i className="bi bi-instagram"></i> @ConectaPro</a>
            <a href="#"><i className="bi bi-whatsapp"></i> (81) 95555-0000</a>
            <a href="#"><i className="bi bi-linkedin"></i> ConectaPro_News</a>
          </div>
        </div>

        {/* Coluna 2: Contato Direto */}
        <div className="footer-column">
          <h3>Contato</h3>
          <div className="footer-links">
            <a href="mailto:conectaPro@conectapro.com">
              <i className="bi bi-envelope"></i> conectaPro@conectapro.com
            </a>
            <p><i className="bi bi-telephone"></i> 3333-3333</p>
            <a href="/faq"><i className="bi bi-question-circle"></i> Central de Ajuda (FAQ)</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 ConectaPro - Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;