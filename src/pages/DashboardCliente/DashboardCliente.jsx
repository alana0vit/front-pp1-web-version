import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './DashboardCliente.css';

const DashboardCliente = () => {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pegando o usuário logado dinamicamente do LocalStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('@ConectaPro:user'));
    const clienteId = usuarioLogado ? usuarioLogado.id : null;

    useEffect(() => {
        const buscarPedidos = async () => {
            if (!clienteId) return; // Se não tiver logado, nem busca
            
            try {
                // A rota que o backend criou para buscar as demandas
                const response = await api.get('/api/demand/user');
                
                // Filtramos para garantir que o cliente só veja os pedidos dele
                const meusPedidos = response.data.filter(d => d.clientId?.id === clienteId);
                setPedidos(meusPedidos);
            } catch (err) {
                console.error("Erro ao buscar demandas:", err);
            } finally {
                setLoading(false);
            }
        };
        buscarPedidos();
    }, [clienteId]);

    // Função atualizada para os novos ENUMS do backend
    const renderStatusBadge = (statusEnum) => {
        switch(statusEnum) {
            case 'OPENED':
                return <span className="badge-status pendente">Aguardando Profissional</span>;
            case 'IN_WAITING':
                return <span className="badge-status aceito">Serviço Aceito</span>;
            case 'REJECTED':
                return <span className="badge-status negado">Pedido Recusado</span>;
            case 'CLOSED':
                return <span className="badge-status concluido" style={{backgroundColor: '#e2e3e5', color: '#383d41'}}>Concluído</span>;
            default:
                return <span className="badge-status pendente">Enviado</span>;
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dash-header">
                <div>
                    <h1>Meus Pedidos</h1>
                    <p>Acompanhe o status das suas solicitações, {usuarioLogado?.name}.</p>
                </div>
                <button className="btn-novo-pedido" onClick={() => navigate('/cliente/catalogo')}>
                    <i className="bi bi-search"></i> Buscar Profissionais
                </button>
            </header>

            <section className="pedidos-section">
                {loading ? <p>Carregando seus pedidos...</p> : pedidos.length === 0 ? (
                    <div className="empty-dash">
                        <p>Você ainda não tem serviços solicitados.</p>
                    </div>
                ) : (
                    <div className="pedidos-grid">
                        {pedidos.map(pedido => (
                            <div key={pedido.id} className={`card-pedido ${(pedido.demandStatus || 'OPENED').toLowerCase()}`}>
                                <div className="pedido-info">
                                    {/* ATENÇÃO: Agora chamamos demandStatus */}
                                    {renderStatusBadge(pedido.demandStatus)}
                                    <h4>{pedido.title}</h4>
                                    <p>{pedido.description}</p>
                                </div>
                                
                                <div className="pedido-footer">
                                    <div className="pro-match">
                                        <span>
                                            Profissional: <strong>{pedido.professionalId?.name || 'Não identificado'}</strong>
                                        </span>
                                        
                                        {/* Mostra o WhatsApp apenas se IN_WAITING (Aceito) */}
                                        {pedido.demandStatus === 'IN_WAITING' && (
                                            <a 
                                                href={`https://wa.me/55${pedido.professionalId?.phone}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="btn-whatsapp"
                                            >
                                                <i className="bi bi-whatsapp"></i> Falar no WhatsApp
                                            </a>
                                        )}

                                        {pedido.demandStatus === 'REJECTED' && (
                                            <button 
                                                className="btn-tentar-outro"
                                                onClick={() => navigate('/cliente/catalogo')}
                                            >
                                                <i className="bi bi-arrow-clockwise"></i> Procurar Outro
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardCliente;