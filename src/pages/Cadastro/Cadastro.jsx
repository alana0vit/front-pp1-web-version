import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./Cadastro.css";

const Cadastro = () => {
  const [tipoPerfil, setTipoPerfil] = useState(null);
  const [categoriasBanco, setCategoriasBanco] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  // Busca as categorias do backend quando o componente carrega
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

      // 2. Construir o payload
      const usuarioPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        birthDate: dataFormatada,
        phone: data.phone,
        userType: tipoPerfil,
        registryId: data.documento,
        // Se for profissional, envia a categoria escolhida dentro de um Array. Se não, envia vazio.
        categoriesIds: tipoPerfil === "PROFESSIONAL" && data.categoryId ? [Number(data.categoryId)] : []
      };

      // 3. Criar utilizador
      const response = await api.post("/api/user", usuarioPayload);
      const userId = response.data.id;

      // 4. Vincular endereço
      await api.post(`/api/user/${userId}/addresses`, {
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      });

      toast.success("Conta criada com sucesso! Faça o login.");
      reset();
      setTipoPerfil(null);

    } catch (error) {
      console.error("Falha no cadastro:", error);
      toast.error("Erro no cadastro. Verifique se o E-mail ou CPF já existem.");
    }
  };

  if (!tipoPerfil) {
    return (
      <div className="cadastro-container">
        <div className="escolha-perfil-card">
          <h2>Como você deseja usar o ConectaPro?</h2>
          <p>Selecione seu perfil para continuarmos</p>

          <div className="cards-container">
            <button className="perfil-card" onClick={() => setTipoPerfil("CLIENT")}>
              <i className="bi bi-person-badge"></i>
              <h3>Quero Contratar</h3>
              <span>Busco profissionais para serviços</span>
            </button>

            <button className="perfil-card profissional" onClick={() => setTipoPerfil("PROFESSIONAL")}>
              <i className="bi bi-tools"></i>
              <h3>Quero Trabalhar</h3>
              <span>Quero oferecer meus serviços</span>
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

              {/* Novo Campo Dinâmico: Categoria (apenas para Profissionais) */}
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

          <button type="submit" className="btn-submit">Finalizar</button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
