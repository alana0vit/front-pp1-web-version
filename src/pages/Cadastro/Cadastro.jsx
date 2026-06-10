import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./Cadastro.css";

const Cadastro = () => {
  const [tipoPerfil, setTipoPerfil] = useState(null);
  const [categoriasBanco, setCategoriasBanco] = useState([]);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  
  const navigate = useNavigate();

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm({
    mode: "onChange"
  });

  const senhaAtual = watch("password");

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
      const documentoLimpo = data.documento.replace(/\D/g, "");
      const telefoneLimpo = data.phone.replace(/\D/g, "");
      const cepLimpo = data.zipCode.replace(/\D/g, "");

      let dataFormatada = data.birthDate;
      if (data.birthDate && data.birthDate.includes('-')) {
        const [ano, mes, dia] = data.birthDate.split('-');
        dataFormatada = `${dia}/${mes}/${ano}`;
      }

      const usuarioPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        birthDate: dataFormatada,
        phone: telefoneLimpo,
        userType: tipoPerfil,
        registryId: documentoLimpo,
        companyName: tipoPerfil === "PROFESSIONAL" ? data.companyName?.trim() : null,
        categoriesIds: tipoPerfil === "PROFESSIONAL" && data.categoryId ? [Number(data.categoryId)] : [],
        address: {
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: cepLimpo,
        }
      };

      console.log("Enviando payload de cadastro:", usuarioPayload);
      await api.post("/api/user", usuarioPayload);
      
      toast.success("Usuário cadastrado com sucesso! Você será direcionado para o login.");

      setMostrarModalSucesso(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
      reset();
    } catch (error) {
      const mensagemErro = error.response?.data?.message || "Erro no cadastro. Verifique os dados.";
      toast.error(mensagemErro);
    }
  };

  if (!tipoPerfil) {
    return (
      <div className="cadastro-container">
        <div className="escolha-perfil-card">
          <h2>Como deseja usar o ConectaPro?</h2>
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
            
            {tipoPerfil === "PROFESSIONAL" ? (
              <div className="row">
                <div className="input-group w-50">
                  <label>Nome Completo</label>
                  <input {...register("name", { required: true })} placeholder="Ex: Marian Lopes" />
                </div>
                <div className="input-group w-50">
                  <label>Nome da Empresa (opcional)</label>
                  <input {...register("companyName")} placeholder="Ex: Conecta Reparos LTDA" />
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label>Nome Completo</label>
                <input {...register("name", { required: true })} placeholder="Ex: Marian Lopes" />
              </div>
            )}

            <div className="row">
              <div className="input-group w-50">
                <label>{tipoPerfil === "CLIENT" ? "CPF" : "CNPJ"}</label>
                <Controller
                  name="documento"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <IMaskInput
                      {...field}
                      mask={tipoPerfil === "CLIENT" ? "000.000.000-00" : "00.000.000/0000-00"}
                      onAccept={(value) => field.onChange(value)}
                      placeholder={tipoPerfil === "CLIENT" ? "000.000.000-00" : "00.000.000/0000-00"}
                    />
                  )}
                />
              </div>

              {tipoPerfil === "PROFESSIONAL" && (
                <div className="input-group w-50">
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

            <div className="row">
              <div className="input-group w-50">
                <label>E-mail</label>
                <input type="email" {...register("email", { required: true })} placeholder="email@exemplo.com" />
              </div>
              <div className="input-group w-50">
                <label>Telefone</label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <IMaskInput
                      {...field}
                      mask="(00) 00000-0000"
                      onAccept={(value) => field.onChange(value)}
                      placeholder="(00) 00000-0000"
                    />
                  )}
                />
              </div>
            </div>

            <div className="row">
              <div className="input-group w-50">
                <label>Data de Nascimento</label>
                <input type="date" {...register("birthDate", { required: true })} />
              </div>
            </div>

            <div className="row">
              <div className="input-group w-50">
                <label>Senha</label>
                <input 
                  type="password" 
                  className={errors.password ? "input-error" : ""}
                  {...register("password", { 
                    required: "A senha é obrigatória", 
                    minLength: { value: 6, message: "Mínimo 6 dígitos" } 
                  })} 
                  placeholder="Mínimo 6 dígitos" 
                />
                {errors.password && (
                  <span className="error-message">
                    <i className="bi bi-exclamation-circle"></i> {errors.password.message}
                  </span>
                )}
              </div>

              <div className="input-group w-50">
                <label>Confirme sua Senha</label>
                <input 
                  type="password" 
                  className={errors.confirmarPassword ? "input-error" : ""}
                  placeholder="Repita a senha digitada"
                  {...register("confirmarPassword", { 
                    required: "A confirmação é obrigatória",
                    validate: (value) => value === senhaAtual || "As senhas não conferem"
                  })} 
                />
                {errors.confirmarPassword && (
                  <span className="error-message">
                    <i className="bi bi-exclamation-circle"></i> {errors.confirmarPassword.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Endereço</h4>
            <div className="row">
              <div className="input-group w-30">
                <label>CEP *</label>
                <Controller
                  name="zipCode"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <IMaskInput
                      {...field}
                      mask="00000-000"
                      onAccept={(value) => field.onChange(value)}
                      placeholder="00000-000"
                    />
                  )}
                />
              </div>
              <div className="input-group w-70">
                <label>Rua</label>
                <input {...register("street", { required: true })} placeholder="Nome da rua ou avenida" />
              </div>
            </div>

            <div className="row">
              <div className="input-group w-30">
                <label>Número</label>
                <input {...register("number")} placeholder="123" />
              </div>
              <div className="input-group w-70">
                <label>Bairro</label>
                <input {...register("neighborhood", { required: true })} placeholder="Bairro do local" />
              </div>
            </div>

            <div className="row">
              <div className="input-group w-70">
                <label>Cidade</label>
                <input {...register("city", { required: true })} />
              </div>
              <div className="input-group w-30">
                <label>Estado (UF)</label>
                <select {...register("state", { required: true })}>
                  <option value="">UF</option>
                  <option value="PE">PE</option>
                  <option value="SP">SP</option>
                </select>
              </div>
            </div>
          </div>

          <div className="terms-container">
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="termos" 
                {...register("aceitouTermos", { required: "Você precisa aceitar os termos de uso" })} 
              />
              <label htmlFor="termos">
                Eu li e aceito os <Link to="/termos-de-uso" target="_blank">Termos de Uso</Link>
              </label>
            </div>
            {errors.aceitouTermos && (
              <span className="error-message">
                <i className="bi bi-exclamation-circle"></i> {errors.aceitouTermos.message}
              </span>
            )}
          </div>

          <button type="submit" className="btn-submit">Finalizar Cadastro</button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;