import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./Cadastro.css";

const Cadastro = () => {
  const [tipoPerfil, setTipoPerfil] = useState(null);
  const [categoriasBanco, setCategoriasBanco] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  // Procura as categorias do backend quando o componente carrega
  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const response = await api.get("/api/category");
        setCategoriasBanco(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    buscarCategorias();
  }, []);

  const onSubmit = async (data) => {
    try {
      // 1. Converter data "YYYY-MM-DD" para "DD/MM/YYYY" conforme exigido pelo backend
      const [ano, mes, dia] = data.birthDate.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;

      // 2. Construir o payload unificado (Usuário + Endereço aninhado)
      const usuarioPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        birthDate: dataFormatada,
        phone: data.phone,
        userType: tipoPerfil,
        registryId: data.documento,
        // Envia a categoria apenas se for profissional
        categoriesIds: tipoPerfil === "PROFESSIONAL" && data.categoryId ? [Number(data.categoryId)] : [],
        
        // NOVO: O objeto 'address' agora faz parte do UserRequest no backend
        address: {
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        }
      };

      // 3. Faz apenas UMA requisição para criar tudo de uma vez
      await api.post("/api/user", usuarioPayload);

      toast.success("Conta criada com sucesso! Faça o login.");
      
      // Limpa o formulário e volta para a tela de seleção de perfil
      reset();
      setTipoPerfil(null);

    } catch (error) {
      console.error("Falha no cadastro:", error);
      // Exibe a mensagem de erro que vem do backend, se disponível
      const mensagemErro = error.response?.data?.message || "Erro no cadastro. Verifique se os dados estão corretos.";
      toast.error(mensagemErro);
    }
  };

  // Ecrã inicial de escolha de perfil
  if (!tipoPerfil) {
    return (
      <div className="cadastro-container">
        <div className="escolha-perfil-card">
          <h2>Como deseja usar o ConectaPro?</h2>
          <p>Selecione o seu perfil para continuarmos</p>

          <div className="cards-container">
            <button className="perfil-card" onClick={() => setTipoPerfil("CLIENT")}>
              <i className="bi bi-person-badge"></i>
              <h3>Quero Contratar</h3>
              <span>Procuro profissionais para serviços</span>
            </button>

            <button className="perfil-card profissional" onClick={() => setTipoPerfil("PROFESSIONAL")}>
              <i className="bi bi-tools"></i>
              <h3>Quero Trabalhar</h3>
              <span>Quero oferecer os meus serviços</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cadastro-container">
      <div className="form-card">
        <div className="form-header">
          <button type="button" className="btn-voltar" onClick={() => setTipoPerfil(null)}>
            <i className="bi bi-arrow-left"></i> Voltar
          </button>
          <h2>{tipoPerfil === "CLIENT" ? "Cadastro de Cliente" : "Cadastro de Profissional"}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <h4>Dados Pessoais</h4>

            <div className="input-group">
              <label>Nome Completo</label>
              <input {...register("name", { required: true })} />
            </div>

            <div className="row">
              <div className="input-group">
                <label>{tipoPerfil === "CLIENT" ? "CPF (Apenas números)" : "CNPJ (Apenas números)"}</label>
                <input {...register("documento", { required: true })} />
              </div>

              {tipoPerfil === "PROFESSIONAL" && (
                <div className="input-group">
                  <label>Especialidade</label>
                  <select {...register("categoryId", { required: true })}>
                    <option value="">Selecione uma especialidade...</option>
                    {categoriasBanco.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="row">
              <div className="input-group">
                <label>E-mail</label>
                <input type="email" {...register("email", { required: true })} />
              </div>
              <div className="input-group">
                <label>Telefone</label>
                <input {...register("phone", { required: true })} placeholder="11999999999" />
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label>Data de Nascimento</label>
                <input type="date" {...register("birthDate", { required: true })} />
              </div>
              <div className="input-group">
                <label>Senha</label>
                <input type="password" {...register("password", { required: true, minLength: 6 })} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Endereço</h4>
            <div className="row">
              <div className="input-group">
                <label>CEP</label>
                <input {...register("zipCode", { required: true })} placeholder="00000-000" />
              </div>
              <div className="input-group">
                <label>Rua</label>
                <input {...register("street", { required: true })} />
              </div>
            </div>
            <div className="row">
              <div className="input-group w-30">
                <label>Número</label>
                <input {...register("number")} />
              </div>
              <div className="input-group">
                <label>Bairro</label>
                <input {...register("neighborhood", { required: true })} />
              </div>
            </div>
            <div className="row">
              <div className="input-group">
                <label>Cidade</label>
                <input {...register("city", { required: true })} />
              </div>
              <div className="input-group">
                <label>Estado (UF)</label>
                <input {...register("state", { required: true, maxLength: 2 })} placeholder="EX: PE" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-submit">Finalizar Cadastro</button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;