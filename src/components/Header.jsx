import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    
    // Verifica se existe alguém logado
    const userStorage = localStorage.getItem('@ConectaPro:user');
    const user = userStorage ? JSON.parse(userStorage) : null;

    const fazerLogout = () => {
        // Limpa a sessão do navegador
        localStorage.removeItem('@ConectaPro:token');
        localStorage.removeItem('@ConectaPro:user');
        
        // Redireciona para a Home pública
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/">
                    <img src={logo} alt="ConectaPro Logo" className="logo-img" />
                </Link>

                <nav className="header-nav">
                    {/* Link público sempre visível */}
                    <Link to="/faq" className="nav-link">FAQ</Link>

                    {/* Renderização Condicional: Logado vs Deslogado */}
                    {user ? (
                        <div className="user-menu">
                            {/* Link de Serviços exclusivo para Clientes */}
                            {user.userType === 'CLIENT' && (
                                <Link to="/lista-profissionais" className="nav-link">
                                    Serviços
                                </Link>
                            )}

                            {/* Atalho para o Dashboard dependendo do tipo de usuário */}
                            <Link 
                                to={user.userType === 'CLIENT' ? "/dashboard-cliente" : "/dashboard-profissional"} 
                                className="nav-link"
                            >
                                Meu Painel
                            </Link>

                            <span className="user-greeting">Olá, {user.name.split(' ')[0]}</span>
                            <button onClick={fazerLogout} className="btn-logout">Sair</button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login">Entrar</Link>
                            <Link to="/cadastro" className="btn-cadastro">Cadastre-se</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;