import React from "react";
import "./Cadastro.css";

function Cadastro() {
  const handleEnviar = (event) => {
    event.preventDefault();

    const senha = event.target.senha.value;
    const confirmar = event.target.confirmarSenha.value;

    if (senha !== confirmar) {
      alert("As senhas não coincidem. Verifique e tente novamente!");
      return;
    }

    alert("Cadastro enviado com sucesso!");
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <div className="card-header-internal">
          <h1>Crie sua conta</h1>
          <p>Preencha os dados abaixo para criar sua conta.</p>
        </div>

        <form className="cadastro-form" onSubmit={handleEnviar}>
          <div className="input-group">
            <i className="bi bi-person"></i>
            <input name="nome" type="text" required placeholder="Nome completo" />
          </div>

          <div className="input-group">
            <i className="bi bi-house"></i>
            <input name="endereco" type="text" required placeholder="Endereço" />
          </div>

          <div className="input-row">
            <div className="input-group">
              <i className="bi bi-calendar"></i>
              <input name="data_nascimento" type="date" required />
            </div>
            <div className="input-group">
              <i className="bi bi-telephone"></i>
              <input name="celular" type="tel" required placeholder="Celular" />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <i className="bi bi-envelope"></i>
              <input name="email" type="email" required placeholder="E-mail" />
            </div>
            <div className="input-group">
              <i className="bi bi-person-vcard"></i>
              <input name="cpf_cnpj" type="text" required placeholder="CPF ou CNPJ" />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <i className="bi bi-people"></i>
              <select name="genero" defaultValue="" required>
                <option value="" disabled>Gênero</option>
                <option value="m">Masculino</option>
                <option value="f">Feminino</option>
                <option value="o">Outro</option>
              </select>
            </div>
            <div className="input-group">
              <i className="bi bi-telephone"></i>
              <input name="telefone_residencial" type="tel" placeholder="Telefone Residencial" />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <i className="bi bi-lock"></i>
              <input name="senha" type="password" required placeholder="Senha" />
            </div>
            <div className="input-group">
              <i className="bi bi-lock"></i>
              <input name="confirmarSenha" type="password" required placeholder="Confirmar senha" />
            </div>
          </div>

          <div className="terms-container">
            <input type="checkbox" id="terms" name="aceite_termos" required />
            <label htmlFor="terms">
              Declaro que as informações fornecidas são verdadeiras e concordo com os <strong>Termos de Uso</strong>.
            </label>
          </div>

          <button type="submit" className="btn-cadastrar">Cadastrar</button>
        </form>

        <div className="card-footer-internal">
          <p>Já tem uma conta? <a href="/login">Faça login</a></p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;