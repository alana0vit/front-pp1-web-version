import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./Cadastro.css";

const Cadastro = () => {
  const [tipoPerfil, setTipoPerfil] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      // TODO: Criar um helper no futuro para formatar a data caso o input do HTML5 mande diferente de dd/MM/yyyy
      const usuarioPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        birthDate: data.birthDate,
        phone: data.phone,
        userType: tipoPerfil,
        registryId: data.documento, // FIXME: Validar a máscara de CPF/CNPJ antes de bater na API
      };

      // Fluxo: cria user -> pega ID -> vincula endereço
      const response = await api.post("/user", usuarioPayload);
      const userId = response.data.id;

      await api.post(`/user/address/${userId}`, {
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      });

      toast.success("Conta criada com sucesso!");
      reset();
      setTipoPerfil(null);

    } catch (error) {
      console.error("Falha no POST /user:", error);
      toast.error("Erro no cadastro. Valide os dados e tente novamente.");
    }
  };

  if (!tipoPerfil) {
    return (
      <div className="cadastro-container">
        <div className="escolha-perfil-card">
          <h2>Como você deseja usar o ConectaPro?</h2>
          <p>Selecione seu perfil para continuarmos</p>

          <div className="cards-container">
            <button
              className="perfil-card"
              onClick={() => setTipoPerfil("CLIENT")}
            >
              <i className="bi bi-person-badge"></i>
              <h3>Quero Contratar</h3>
              <span>Busco profissionais para serviços</span>
            </button>

            <button
              className="perfil-card profissional"
              onClick={() => setTipoPerfil("PROFESSIONAL")}
            >
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
          <button
            type="button"
            className="btn-voltar"
            onClick={() => setTipoPerfil(null)}
          >
            <i className="bi bi-arrow-left"></i> Voltar
          </button>
          <h2>
            {tipoPerfil === "CLIENT"
              ? "Cadastro de Cliente"
              : "Cadastro de Profissional"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <h4>Dados Pessoais</h4>

            <div className="input-group">
              <label>Nome Completo</label>
              <input {...register("name", { required: true })} />
            </div>

            <div className="input-group">
              {/* Renderização condicional da label com base no state */}
              <label>{tipoPerfil === "CLIENT" ? "CPF" : "CNPJ"}</label>
              <input
                {...register("documento", { required: true })}
                placeholder={
                  tipoPerfil === "CLIENT"
                    ? "000.000.000-00"
                    : "00.000.000/0000-00"
                }
              />
            </div>

            <div className="row">
              <div className="input-group">
                <label>E-mail</label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="input-group">
                <label>Telefone</label>
                <input
                  {...register("phone", { required: true })}
                  placeholder="DDD + Número"
                />
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label>Data de Nascimento</label>
                {/* TODO: Trocar para type="date" e tratar o parse pro Spring Boot depois */}
                <input
                  placeholder="dd/mm/aaaa"
                  {...register("birthDate", { required: true })}
                />
              </div>
              <div className="input-group">
                <label>Senha</label>
                <input
                  type="password"
                  {...register("password", { required: true, minLength: 6 })}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Endereço</h4>
            {/* TODO: Componentizar bloco de endereço para reutilizar no painel de edição do perfil */}
            <div className="row">
              <div className="input-group">
                <label>CEP</label>
                <input
                  {...register("zipCode", { required: true })}
                  placeholder="00000-000"
                />
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
                <input
                  {...register("state", { required: true, maxLength: 2 })}
                  placeholder="EX: PE"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Finalizar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
