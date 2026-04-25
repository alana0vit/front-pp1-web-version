import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      // Chamada para a rota de login configurada no AuthController do Backend
      const response = await api.post('/auth/login', data);
      
      // Extraindo os dados conforme definidos no LoginResponseDTO.java
      const { token, id, name, userType } = response.data;

      // Salvando no LocalStorage com os nomes padrão do projeto
      localStorage.setItem('@ConectaPro:token', token);
      localStorage.setItem('@ConectaPro:user', JSON.stringify({ id, name, userType }));
      
      toast.success(`Bem-vindo(a) de volta, ${name}!`);

      // Redirecionamento dinâmico baseado no UserType.java (CLIENT ou PROFESSIONAL)
      if (userType === 'CLIENT') {
        navigate('/dashboard-cliente'); 
      } else if (userType === 'PROFESSIONAL') {
        navigate('/dashboard-profissional'); 
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error("Erro na autenticação:", error);
      
      // Captura a mensagem de erro vinda do AuthController.java se disponível
      const mensagemErro = error.response?.data || "E-mail ou senha incorretos.";
      toast.error(mensagemErro);
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
              {...register("email", { required: "O e-mail é obrigatório" })}
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="********"
              {...register("password", { required: "A senha é obrigatória" })}
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