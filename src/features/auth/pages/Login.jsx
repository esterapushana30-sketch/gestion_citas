import { useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await signIn(email, password);
      if (result.success) {
        navigate("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Iniciar Sesión</h1>
        <p className="auth-subtitle">SENA Bienestar — Acceso institucional</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link to="/forgot-password" className="auth-link field-hint">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="auth-link">
            Regístrate aquí
          </Link>
        </p>

        <div className="auth-divider">
          <span>o</span>
        </div>

        <p className="auth-footer">
          ¿Eres profesional?{" "}
          <Link to="/register-professional" className="auth-link">
            Registra tu cuenta profesional
          </Link>
        </p>
      </div>
    </div>
  );
}
