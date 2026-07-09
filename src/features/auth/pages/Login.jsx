import { useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Heart, ArrowRight, Shield, Users, Calendar } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="auth-page-pro">
      <div className="auth-container-pro">
        {/* Lado izquierdo - Branding */}
        <div className="auth-brand-pro">
          <div className="auth-brand-content">
            <div className="auth-logo-pro">
              <Heart size={40} strokeWidth={2} />
            </div>
            <h1 className="auth-brand-title">SENA Bienestar</h1>
            <p className="auth-brand-subtitle">
              Sistema de Gestión de Citas para Servicios de Bienestar
            </p>

            <div className="auth-features-pro">
              <div className="auth-feature-pro">
                <div className="auth-feature-icon-pro">
                  <Calendar size={20} />
                </div>
                <div className="auth-feature-text-pro">
                  <span className="auth-feature-title-pro">Agenda Fácil</span>
                  <span className="auth-feature-desc-pro">Citas en línea 24/7</span>
                </div>
              </div>

              <div className="auth-feature-pro">
                <div className="auth-feature-icon-pro">
                  <Users size={20} />
                </div>
                <div className="auth-feature-text-pro">
                  <span className="auth-feature-title-pro">Profesionales</span>
                  <span className="auth-feature-desc-pro">Psicología, Enfermería y más</span>
                </div>
              </div>

              <div className="auth-feature-pro">
                <div className="auth-feature-icon-pro">
                  <Shield size={20} />
                </div>
                <div className="auth-feature-text-pro">
                  <span className="auth-feature-title-pro">Seguro</span>
                  <span className="auth-feature-desc-pro">Tus datos protegidos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="auth-form-side-pro">
          <div className="auth-card-pro">
            <div className="auth-card-header">
              <h2>Iniciar Sesión</h2>
              <p>Ingresa tus credenciales para acceder</p>
            </div>

            {error && (
              <div className="auth-error-pro">
                <span className="error-icon-pro">!</span>
                {error}
              </div>
            )}

            <form className="auth-form-pro" onSubmit={handleSubmit}>
              <div className="field-pro">
                <label htmlFor="login-email">Correo electrónico</label>
                <div className="input-wrapper-pro">
                  <Mail size={18} className="input-icon-pro" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field-pro">
                <div className="label-row-pro">
                  <label htmlFor="login-password">Contraseña</label>
                  <Link to="/forgot-password" className="forgot-link-pro">
                    ¿Olvidaste?
                  </Link>
                </div>
                <div className="input-wrapper-pro">
                  <Lock size={18} className="input-icon-pro" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-pro"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit-pro"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading-text-pro">
                    <span className="spinner-pro" />
                    Ingresando...
                  </span>
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider-pro">
              <span>o</span>
            </div>

            <div className="auth-footer-pro">
              <p>¿No tienes cuenta?</p>
              <div className="auth-links-pro">
                <Link to="/register" className="auth-link-pro secondary">
                  <Users size={16} />
                  Registro de Aprendiz
                </Link>
                <Link to="/register-professional" className="auth-link-pro primary">
                  <Shield size={16} />
                  Registro Profesional
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
