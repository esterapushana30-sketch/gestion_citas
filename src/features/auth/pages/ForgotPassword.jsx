import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, ArrowRight, Heart, Shield, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;
      setEmailSent(true);
      toast.success("Email de recuperación enviado");
    } catch (err) {
      toast.error(err.message || "Error enviando email de recuperación");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-page-pro">
        <div className="auth-container-pro">
          <div className="auth-brand-pro">
            <div className="auth-brand-content">
              <div className="auth-logo-pro">
                <Heart size={40} strokeWidth={2} />
              </div>
              <h1 className="auth-brand-title">SENA Bienestar</h1>
              <p className="auth-brand-subtitle">
                Sistema de Gestión de Citas para Servicios de Bienestar
              </p>
            </div>
          </div>

          <div className="auth-form-side-pro">
            <div className="auth-card-pro">
              <div className="auth-card-header">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: '#dcfce7', borderRadius: '50%' }}>
                    <CheckCircle size={32} color="#22c55e" />
                  </div>
                </div>
                <h2>Email Enviado</h2>
                <p>Revisa tu bandeja de entrada</p>
              </div>

              <div className="auth-success" style={{ background: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  Se ha enviado un email a <strong>{email}</strong> con las
                  instrucciones para restablecer tu contraseña.
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                  Si no recibes el email en unos minutos, revisa tu carpeta de spam
                  o correo no deseado.
                </p>
              </div>

              <Link to="/login" className="btn-submit-pro" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                <ArrowLeft size={18} />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-pro">
      <div className="auth-container-pro">
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
                  <Shield size={20} />
                </div>
                <div className="auth-feature-text-pro">
                  <span className="auth-feature-title-pro">Seguro</span>
                  <span className="auth-feature-desc-pro">Tus datos están protegidos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-side-pro">
          <div className="auth-card-pro">
            <div className="auth-card-header">
              <h2>Recuperar Contraseña</h2>
              <p>Ingresa tu email y te enviaremos las instrucciones</p>
            </div>

            <form className="auth-form-pro" onSubmit={handleSubmit}>
              <div className="field-pro">
                <label htmlFor="forgot-email">Correo electrónico</label>
                <div className="input-wrapper-pro">
                  <Mail size={18} className="input-icon-pro" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu.email@sena.edu.co"
                    required
                  />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Ingresa el email asociado a tu cuenta para recibir las instrucciones de recuperación.
                </span>
              </div>

              <button type="submit" className="btn-submit-pro" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="loading-text-pro">
                    <span className="spinner-pro" />
                    Enviando...
                  </span>
                ) : (
                  <>
                    Enviar Instrucciones
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer-pro" style={{ marginTop: '1.5rem' }}>
              <Link to="/login" className="auth-link-pro secondary">
                <ArrowLeft size={16} />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
