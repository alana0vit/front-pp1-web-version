import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    try {
      // TODO: Alinhar com o time de backend se a rota de auth será /login ou /auth
      // FIXME: Por enquanto, vamos simular o POST enviando email e password
      await api.post("/login", data);
      // TODO: Salvar o Token JWT no localStorage ou Cookies aqui
      // localStorage.setItem('token', response.data.token);

      toast.success("Bem-vindo de volta!");
      navigate("/"); // Joga o user pra Home após logar
    } catch (error) {
      console.error("Erro na autenticação:", error);
      // TODO: Tratar erro 401 (Credenciais inválidas) especificamente
      toast.error("E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <p>Acesse sua conta para gerenciar seus serviços.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              {...register("email", { required: true })}
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="********"
              {...register("password", { required: true })}
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" /> Lembrar de mim
            </label>
            <Link to="/recuperar-senha">Esqueceu a senha?</Link>
          </div>

          <button type="submit" className="btn-login-submit">
            Entrar
          </button>
        </form>

        <div className="login-footer">
          <span>
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
