import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../../providers/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { Mail, Lock, User, FileText, ArrowRight, Heart, Shield, Users, Calendar } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    document_number: "",
  });
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: existingDoc } = await supabase
        .from("profiles")
        .select("id")
        .eq("document_number", formData.document_number)
        .maybeSingle();

      if (existingDoc) {
        setValidationError("Ya existe un usuario registrado con ese número de documento");
        setIsSubmitting(false);
        return;
      }

      const result = await signUp(formData.email, formData.password, {
        full_name: formData.full_name,
        document_number: formData.document_number,
      });

      if (result.success) {
        toast.success(
          "¡Registro exitoso! Revisa tu email para confirmar la cuenta.",
        );
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorMessage = validationError || authError;

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
              Únete a nuestra comunidad y accede a servicios de bienestar
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
                  <span className="auth-feature-desc-pro">Atención especializada</span>
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
              <h2>Crear Cuenta</h2>
              <p>Regístrate como aprendiz para agendar citas</p>
            </div>

            {errorMessage && (
              <div className="auth-error-pro">
                <span className="error-icon-pro">!</span>
                {errorMessage}
              </div>
            )}

            <form className="auth-form-pro" onSubmit={handleSubmit}>
              <div className="field-pro">
                <label htmlFor="reg-fullname">Nombre completo</label>
                <div className="input-wrapper-pro">
                  <User size={18} className="input-icon-pro" />
                  <input
                    id="reg-fullname"
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>

              <div className="field-pro">
                <label htmlFor="reg-document">Número de documento</label>
                <div className="input-wrapper-pro">
                  <FileText size={18} className="input-icon-pro" />
                  <input
                    id="reg-document"
                    type="text"
                    name="document_number"
                    value={formData.document_number}
                    onChange={handleChange}
                    placeholder="Ej: 1234567890"
                    required
                  />
                </div>
              </div>

              <div className="field-pro">
                <label htmlFor="reg-email">Email institucional</label>
                <div className="input-wrapper-pro">
                  <Mail size={18} className="input-icon-pro" />
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu.email@soy.sena.edu.co"
                    required
                  />
                </div>
              </div>

              <div className="field-pro">
                <label htmlFor="reg-password">Contraseña</label>
                <div className="input-wrapper-pro">
                  <Lock size={18} className="input-icon-pro" />
                  <input
                    id="reg-password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
              </div>

              <div className="field-pro">
                <label htmlFor="reg-confirm">Confirmar contraseña</label>
                <div className="input-wrapper-pro">
                  <Lock size={18} className="input-icon-pro" />
                  <input
                    id="reg-confirm"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit-pro" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="loading-text-pro">
                    <span className="spinner-pro" />
                    Creando...
                  </span>
                ) : (
                  <>
                    Crear Cuenta
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer-pro" style={{ marginTop: '1.5rem' }}>
              <p>¿Ya tienes cuenta?</p>
              <Link to="/login" className="auth-link-pro secondary">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
