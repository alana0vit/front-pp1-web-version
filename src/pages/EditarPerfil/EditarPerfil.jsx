import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './EditarPerfil.css';

function EditarPerfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categoriasBanco, setCategoriasBanco] = useState([]);
  const [enderecoId, setEnderecoId] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  const userStorage = JSON.parse(localStorage.getItem('@ConectaPro:user'));
  const userId = userStorage?.id;

  useEffect(() => {
    const carregarDadosDoPerfil = async () => {
      try {
        const resUser = await api.get(`/api/user/${userId}`);
        const userData = resUser.data;
        setUsuarioAtual(userData);

        const resAddress = await api.get(`/api/user/${userId}/addresses`);
        let addressData = {};
        if (resAddress.data.length > 0) {
          const end = resAddress.data[0];
          setEnderecoId(end.id);
          addressData = end;
        }

        if (userData.userType === 'PROFESSIONAL') {
          const resCat = await api.get('/api/category');
          setCategoriasBanco(resCat.data);
        }

        let birthDateFormated = userData.birthDate;
        if (birthDateFormated && birthDateFormated.includes('/')) {
          const [dia, mes, ano] = birthDateFormated.split('/');
          birthDateFormated = `${ano}-${mes}-${dia}`;
        }

        reset({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          birthDate: birthDateFormated,
          categoryId: userData.categories?.length > 0 ? userData.categories[0].id : '',
          zipCode: addressData.zipCode || '',
          street: addressData.street || '',
          number: addressData.number || '',
          neighborhood: addressData.neighborhood || '',
          city: addressData.city || '',
          state: addressData.state || ''
        });

      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Não foi possível carregar os seus dados.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) carregarDadosDoPerfil();
  }, [userId, reset]);

  const alternarVisibilidadeSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const onSubmit = async (data) => {
    try {
      const [ano, mes, dia] = data.birthDate.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;

      const usuarioPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        birthDate: dataFormatada,
        phone: data.phone,
        userType: usuarioAtual.userType, 
        registryId: usuarioAtual.registryId,
        categoriesIds: usuarioAtual.userType === 'PROFESSIONAL' && data.categoryId ? [Number(data.categoryId)] : [],
        address: {
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        }
      };

      await api.put(`/api/user/${userId}`, usuarioPayload);
      
      if (data.name !== userStorage.name) {
        const novoUserStorage = { ...userStorage, name: data.name };
        localStorage.setItem('@ConectaPro:user', JSON.stringify(novoUserStorage));
      }

      toast.success("Perfil atualizado com sucesso!");
      
      setValue('password', '');
      
      navigate(-1);

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar dados.");
    }
  };

  if (loading) {
    return <div className="editar-perfil-loading"><p>Carregando seus dados...</p></div>;
  }

  return (
    <div className="editar-perfil-page">
      <div className="editar-perfil-wrapper">
        <div className="editar-perfil-card">
          <header className="perfil-header-info">
            <h2 className="serif-font">Editar Perfil</h2>
            <p>Mantenha seus dados atualizados.</p>
          </header>

          <form className="editar-perfil-form" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="form-split-layout">
              
              <div className="form-layout-column">
                <section className="form-section">
                  <div className="form-vertical-stack">
                    <div className="input-group">
                      <label>Nome Completo</label>
                      <div className="input-wrapper">
                        <input type="text" {...register("name", { required: true })} />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>E-mail</label>
                      <div className="input-wrapper">
                        <input type="email" {...register("email", { required: true })} />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Telefone / WhatsApp</label>
                      <div className="input-wrapper">
                        <input type="text" {...register("phone", { required: true })} />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Data de Nascimento</label>
                      <div className="input-wrapper">
                        <input type="date" {...register("birthDate", { required: true })} />
                      </div>
                    </div>
                    
                    {usuarioAtual?.userType === 'PROFESSIONAL' && (
                      <div className="input-group">
                        <label>Especialidade</label>
                        <div className="input-wrapper">
                          <select {...register("categoryId", { required: true })}>
                            <option value="">Selecione...</option>
                            {categoriasBanco.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="form-vertical-divider"></div>

              <div className="form-layout-column">
                <section className="form-section">
                  <div className="form-vertical-stack">
                    
                    <div className="input-group">
                      <label>CEP</label>
                      <div className="input-wrapper">
                        <input type="text" {...register("zipCode", { required: true })} />
                      </div>
                    </div>

                    <div className="form-inline-row">
                      <div className="input-group text-grow">
                        <label>Rua</label>
                        <div className="input-wrapper">
                          <input type="text" {...register("street", { required: true })} />
                        </div>
                      </div>
                      <div className="input-group text-short">
                        <label>Número</label>
                        <div className="input-wrapper">
                          <input type="text" {...register("number")} />
                        </div>
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Bairro</label>
                      <div className="input-wrapper">
                        <input type="text" {...register("neighborhood", { required: true })} />
                      </div>
                    </div>

                    <div className="form-inline-row">
                      <div className="input-group text-grow">
                        <label>Cidade</label>
                        <div className="input-wrapper">
                          <input type="text" {...register("city", { required: true })} />
                        </div>
                      </div>
                      <div className="input-group text-short">
                        <label>Estado (UF)</label>
                        <div className="input-wrapper">
                          <input type="text" {...register("state", { required: true, maxLength: 2 })} />
                        </div>
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="label-confirm-danger">Confirme sua senha para salvar</label>
                      <div className="input-wrapper">
                        <input 
                          type={mostrarSenha ? "text" : "password"}
                          className="password-input-field"
                          placeholder="Sua senha atual" 
                          autoComplete="new-password" 
                          {...register("password", { required: true, minLength: 6 })} 
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={alternarVisibilidadeSenha}
                          title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                          aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                        >
                          {mostrarSenha ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                              <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                              <line x1="2" y1="2" x2="22" y2="22"></line>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                </section>
              </div>

            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;