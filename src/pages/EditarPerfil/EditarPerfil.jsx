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
          setEnderecoId(end.id); // Guardamos o ID do endereço para fazer o PUT depois
          addressData = end;
        }

        // Se for profissional, busca a lista de categorias do banco
        if (userData.userType === 'PROFESSIONAL') {
          const resCat = await api.get('/api/category');
          setCategoriasBanco(resCat.data);
        }

        // Converte a data que vem do banco (dd/MM/yyyy) para o formato do input HTML (yyyy-MM-dd)
        let birthDateFormated = userData.birthDate;
        if (birthDateFormated && birthDateFormated.includes('/')) {
          const [dia, mes, ano] = birthDateFormated.split('/');
          birthDateFormated = `${ano}-${mes}-${dia}`;
        }

        // Preenche os campos do formulário automaticamente
        reset({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          birthDate: birthDateFormated,
          categoryId: userData.categories?.length > 0 ? userData.categories[0].id : '',
          // Endereço
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

    if (userId) {
      carregarDadosDoPerfil();
    }
  }, [userId, reset]);

  const onSubmit = async (data) => {
    try {
      // Formata a data de volta para o padrão exigido pelo Backend (dd/MM/yyyy)
      const [ano, mes, dia] = data.birthDate.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;

      // Monta o payload do Usuário COM o endereço embutido (exigência do UserRequest.java)
      const usuarioPayload = {
        name: data.name,
        email: data.email,
        password: data.password, // O usuário precisa digitar a senha para confirmar a edição
        birthDate: dataFormatada,
        phone: data.phone,
        userType: usuarioAtual.userType, 
        registryId: usuarioAtual.registryId, // Mantém o CPF/CNPJ original
        categoriesIds: usuarioAtual.userType === 'PROFESSIONAL' && data.categoryId ? [Number(data.categoryId)] : [],
        
        // NOVO: Endereço agora viaja embutido no PUT também, igual no cadastro
        address: {
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        }
      };

      // Dispara a requisição PUT principal do usuário
      await api.put(`/api/user/${userId}`, usuarioPayload);
      
      // Mantemos o PUT do endereço separado apenas como garantia extra
      if (enderecoId) {
        const enderecoPayload = {
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        };
        await api.put(`/api/user/address/${enderecoId}`, enderecoPayload);
      }

      // Se o nome tiver sido alterado, atualizamos no LocalStorage para o Header não ficar desatualizado
      if (data.name !== userStorage.name) {
        const novoUserStorage = { ...userStorage, name: data.name };
        localStorage.setItem('@ConectaPro:user', JSON.stringify(novoUserStorage));
      }

      toast.success("Perfil atualizado com sucesso!");
      navigate(-1); // Volta para a tela anterior (dashboard) após salvar

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar. Verifique se a sua senha está correta ou se os dados são válidos.");
    }
  };

  if (loading) {
    return <div className="editar-perfil-container"><p style={{textAlign:'center', marginTop:'50px'}}>Carregando seus dados...</p></div>;
  }

  return (
    <div className="editar-perfil-container">
      <div className="editar-perfil-card">
        <button type="button" className="btn-voltar" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Voltar
        </button>
        
        <h2 className="serif-font">Editar Perfil</h2>
        <p className="subtitle">Mantenha os seus dados atualizados para facilitar o contato.</p>

        <form className="editar-perfil-form" onSubmit={handleSubmit(onSubmit)}>
          
          <h4 style={{marginTop: '20px', marginBottom: '10px', color: '#1a365d'}}>Dados Pessoais</h4>
          
          <div className="input-group">
            <label>Nome Completo</label>
            <input type="text" {...register("name", { required: true })} />
          </div>

          <div style={{display: 'flex', gap: '15px'}}>
            <div className="input-group" style={{flex: 1}}>
              <label>E-mail</label>
              <input type="email" {...register("email", { required: true })} />
            </div>
            <div className="input-group" style={{flex: 1}}>
              <label>Telefone / WhatsApp</label>
              <input type="text" {...register("phone", { required: true })} />
            </div>
          </div>

          <div style={{display: 'flex', gap: '15px'}}>
            <div className="input-group" style={{flex: 1}}>
              <label>Data de Nascimento</label>
              <input type="date" {...register("birthDate", { required: true })} />
            </div>
            
            {/* Se for profissional, pode editar a categoria */}
            {usuarioAtual?.userType === 'PROFESSIONAL' && (
              <div className="input-group" style={{flex: 1}}>
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

          <h4 style={{marginTop: '20px', marginBottom: '10px', color: '#1a365d'}}>Endereço</h4>
          
          <div style={{display: 'flex', gap: '15px'}}>
             <div className="input-group" style={{flex: 1}}>
              <label>CEP</label>
              <input type="text" {...register("zipCode", { required: true })} />
            </div>
            <div className="input-group" style={{flex: 2}}>
              <label>Rua</label>
              <input type="text" {...register("street", { required: true })} />
            </div>
          </div>

          <div style={{display: 'flex', gap: '15px'}}>
            <div className="input-group" style={{flex: 1}}>
              <label>Número</label>
              <input type="text" {...register("number")} />
            </div>
            <div className="input-group" style={{flex: 2}}>
              <label>Bairro</label>
              <input type="text" {...register("neighborhood", { required: true })} />
            </div>
          </div>

          <div style={{display: 'flex', gap: '15px'}}>
            <div className="input-group" style={{flex: 2}}>
              <label>Cidade</label>
              <input type="text" {...register("city", { required: true })} />
            </div>
            <div className="input-group" style={{flex: 1}}>
              <label>Estado (UF)</label>
              <input type="text" {...register("state", { required: true, maxLength: 2 })} />
            </div>
          </div>

          {/* Campo obrigatório para validar o PUT no backend */}
          <div className="input-group" style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
            <label style={{color: '#d93025'}}>* Digite a sua Senha para confirmar as alterações</label>
            <input type="password" placeholder="Sua senha atual" {...register("password", { required: true, minLength: 6 })} />
          </div>

          <div className="botoes-acao" style={{marginTop: '30px'}}>
            <button type="button" className="btn-cancelar" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarPerfil;