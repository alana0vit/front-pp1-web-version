import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header-container">
            <div className="logo">
                <Link to="/">
                    <img src={logo} alt="ConectaPro Logo" className="logo-img" />
                </Link>
            </div>

            {/* Agrupamos o Menu (FAQ) e os Botões (Login/Cadastro) na mesma div para ficarem lado a lado à direita */}
            <div className="header-actions">
                <nav className="nav-menu">
                    <Link to="/faq" className="nav-item">FAQ</Link>
                </nav>

                <div className="auth-buttons">
                    <button className="btn-login" onClick={() => navigate('/login')}>
                        Entrar
                    </button>
                    
                    <button className="btn-cadastro" onClick={() => navigate('/cadastro')}>
                        Cadastre-se
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;