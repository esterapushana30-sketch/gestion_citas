import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Link } from "react-router-dom";
import { toast } from "sonner";

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
      <div className="auth-page">
        <div className="auth-card">
          <h1>Email Enviado</h1>
          <p className="auth-subtitle">SENA Bienestar — Recuperación de contraseña</p>

          <div className="auth-success">
            <p>
              Se ha enviado un email a <strong>{email}</strong> con las
              instrucciones para restablecer tu contraseña.
            </p>
            <p className="auth-hint">
              Si no recibes el email en unos minutos, revisa tu carpeta de spam
              o correo no deseado.
            </p>
          </div>

          <Link to="/login" className="btn-primary" style={{ display: "block", textAlign: "center", marginTop: "1rem" }}>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Recuperar Contraseña</h1>
        <p className="auth-subtitle">SENA Bienestar — Ingresa tu email para recuperar tu contraseña</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="forgot-email">Email</label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu.email@sena.edu.co"
            />
            <span className="field-hint">
              Ingresa el email asociado a tu cuenta y te enviaremos las
              instrucciones para restablecer tu contraseña.
            </span>
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Recuerdas tu contraseña?{" "}
          <Link to="/login" className="auth-link">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
