import React from 'react';
import './AppPromo.css';

const AppPromo = () => {
  return (
    <section className="app-promo">
      <div className="promo-image">
         {/* Substitua a div abaixo pela tag <img> */}
         <div className="mobile-placeholder">
           📱 Mockup do App
         </div>
      </div>
      
      <div className="promo-content">
        <h2>Estamos disponíveis também na versão mobile</h2>
        <p>Baixe agora e se conecte com milhares de clientes e profissionais.</p>
        
        <div className="store-buttons">
          <button className="store-btn">Google Play</button>
          <button className="store-btn">App Store</button>
        </div>
      </div>
    </section>
  );
};

export default AppPromo;