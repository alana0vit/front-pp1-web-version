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

  const { register, handleSubmit, reset } = useForm();

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
        
        <button type="button" className="btn-voltar-topo" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left-short"></i>
          <span>Voltar ao Painel</span>
        </button>

        <div className="editar-perfil-card">
          <header className="perfil-header-info">
            <h2 className="serif-font">Editar Perfil</h2>
            <p>Mantenha os seus dados atualizados para facilitar o contato.</p>
          </header>

          <form className="editar-perfil-form" onSubmit={handleSubmit(onSubmit)}>
            
            <section className="form-section">
              <h4 className="section-title">Dados Pessoais</h4>
              
              <div className="form-grid">
                <div className="input-group full-width">
                  <label>Nome Completo</label>
                  <input type="text" {...register("name", { required: true })} />
                </div>

                <div className="input-group">
                  <label>E-mail</label>
                  <input type="email" {...register("email", { required: true })} />
                </div>

                <div className="input-group">
                  <label>Telefone / WhatsApp</label>
                  <input type="text" {...register("phone", { required: true })} />
                </div>

                <div className="input-group">
                  <label>Data de Nascimento</label>
                  <input type="date" {...register("birthDate", { required: true })} />
                </div>
                
                {usuarioAtual?.userType === 'PROFESSIONAL' && (
                  <div className="input-group">
                    <label>Especialidade</label>
                    <select {...register("categoryId", { required: true })}>
                      <option value="">Selecione...</option>
                      {categoriasBanco.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </section>

            <section className="form-section">
              <h4 className="section-title">Endereço</h4>
              
              <div className="form-grid">
                <div className="input-group">
                  <label>CEP</label>
                  <input type="text" {...register("zipCode", { required: true })} />
                </div>
                <div className="input-group span-2">
                  <label>Rua</label>
                  <input type="text" {...register("street", { required: true })} />
                </div>

                <div className="input-group">
                  <label>Número</label>
                  <input type="text" {...register("number")} />
                </div>
                <div className="input-group span-2">
                  <label>Bairro</label>
                  <input type="text" {...register("neighborhood", { required: true })} />
                </div>

                <div className="input-group span-2">
                  <label>Cidade</label>
                  <input type="text" {...register("city", { required: true })} />
                </div>
                <div className="input-group">
                  <label>Estado (UF)</label>
                  <input type="text" {...register("state", { required: true, maxLength: 2 })} />
                </div>
              </div>
            </section>

            <section className="form-section confirm-section">
              <div className="input-group">
                <label className="label-confirm">* Digite a sua Senha para confirmar as alterações</label>
                <input type="password" placeholder="Sua senha atual" {...register("password", { required: true, minLength: 6 })} />
              </div>
            </section>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
                Cancelar
              </button>
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