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
            // Chamada para a rota de login (verifique se o backend já ativou a rota /login ou /api/auth)
            const response = await api.post('/login', data);
            
            // Extraindo exatamente o que o DTO do backend devolve
            const { tooken, id, name, userType } = response.data;

            // Salvando no LocalStorage para usarmos nas outras telas
            localStorage.setItem('@ConectaPro:token', tooken);
            localStorage.setItem('@ConectaPro:user', JSON.stringify({ id, name, userType }));
            
            toast.success(`Bem-vindo(a) de volta, ${name}!`);

            // Redirecionamento dinâmico baseado no tipo de conta
            if (userType === 'CLIENT') {
                navigate('/cliente/catalogo'); // Manda o cliente pras compras
            } else if (userType === 'PROFESSIONAL') {
                navigate('/dashboard-profissional'); // Manda o profissional pro trabalho
            } else {
                navigate('/');
            }

        } catch (error) {
            console.error("Erro na autenticação:", error);
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
            <Link to="/esqueceu-senha">Esqueceu a senha?</Link>
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
