import { useState } from "react";
import { supabase } from "./supabase";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function entrar(event) {
    event.preventDefault();

    if (!email.trim() || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    setCarregando(true);
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });

    if (error) {
      console.error("Erro no login:", error);

      setErro("E-mail ou senha incorretos.");
      setCarregando(false);

      return;
    }

    // Login realizado
    window.location.href = "/admin/painel";
  }

  return (
    <div className="pagina-login">

      <div className="login-card">

        <div className="login-coracao">
          ♡
        </div>

        <p className="login-pequeno">
          Área exclusiva
        </p>

        <h1>
          Gabriel & Karoline
        </h1>

        <p className="login-subtitulo">
          Painel do casal
        </p>

        <form onSubmit={entrar}>

          <div className="login-campo">

            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={carregando}
            />

          </div>

          <div className="login-campo">

            <label htmlFor="senha">
              Senha
            </label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) =>
                setSenha(event.target.value)
              }
              disabled={carregando}
            />

          </div>

          {erro && (
            <p className="login-erro">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="login-botao"
            disabled={carregando}
          >
            {carregando
              ? "Entrando..."
              : "Entrar no painel"}

            <span>
              →
            </span>
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;