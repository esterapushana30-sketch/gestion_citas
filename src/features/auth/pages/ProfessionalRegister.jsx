import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../../providers/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { Mail, Lock, User, FileText, Phone, Briefcase, ArrowRight, Heart, Shield, Users, Calendar } from "lucide-react";

const PROFESSIONS = [
  "Psicólogo/a",
  "Enfermero/a",
  "Trabajador/a Social",
  "Médico/a",
  "Odontólogo/a",
  "Nutricionista",
  "Fisioterapeuta",
  "Otro",
];

const SPECIALTIES = {
  "Psicólogo/a": ["Clínica", "Educacional", "Organizacional", "Comunitaria", "Neuropsicología"],
  "Enfermero/a": ["General", "Comunitaria", "Pediatría", "Geriatría", "Salud Mental"],
  "Trabajador/a Social": ["Comunitaria", "Clínica", "Educacional", "Laboral"],
  "Médico/a": ["General", "Internista", "Pediatra"],
  "default": ["General"],
};

const PROFESSION_TO_ROLE = {
  "Psicólogo/a": 3,
  "Enfermero/a": 4,
  "Trabajador/a Social": 5,
};

export default function ProfessionalRegister() {
  const [formData, setFormData] = useState({
    full_name: "",
    document_number: "",
    email: "",
    phone: "",
    profession: "",
    specialty: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { error: authError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getSpecialties = () => {
    return SPECIALTIES[formData.profession] || SPECIALTIES.default;
  };

  const getRoleName = (profession) => {
    const roleMap = {
      "Psicólogo/a": "PSICOLOGIA",
      "Enfermero/a": "ENFERMERIA",
      "Trabajador/a Social": "TRABAJO_SOCIAL",
    };
    return roleMap[profession] || "PSICOLOGIA";
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
        throw new Error("Ya existe un usuario registrado con ese número de documento");
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            document_number: formData.document_number,
            phone: formData.phone,
            profession: formData.profession,
            specialty: formData.specialty,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo crear el usuario");

      const roleId = PROFESSION_TO_ROLE[formData.profession] || 3;
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone: formData.phone,
          profession: formData.profession,
          specialty: formData.specialty,
          role_id: roleId,
          roles: {
            name: getRoleName(formData.profession),
            label: formData.profession,
          },
        })
        .eq("id", authData.user.id);

      if (profileError) throw profileError;

      toast.success(
        "¡Registro exitoso! Tu cuenta ha sido creada. Revisa tu email para confirmar.",
      );
      navigate("/login");
    } catch (err) {
      setValidationError(err.message);
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
              Únete como profesional y brinda atención de bienestar
            </p>

            <div className="auth-features-pro">
              <div className="auth-feature-pro">
                <div className="auth-feature-icon-pro">
                  <Shield size={20} />
                </div>
                <div className="auth-feature-text-pro">
                  <span className="auth-feature-title-pro">Cuenta Verificada</span>
                  <span className="auth-feature-desc-pro">Rol de profesional asignado</span>
                </div>
              </div>

              <div className="auth-feature-pro">
                <div className="auth-feature-icon-pro">
                  <Users size={20} />
                </div>
                <div className="auth-feature-text-pro">
                  <span className="auth-feature-title-pro">Gestión de Citas</span>
                  <span className="auth-feature-desc-pro">Administra tu agenda</span>
                </div>
              </div>

              <div className="auth-feature-pro">
                <div className="auth-feature-icon-pro">
                  <Calendar size={20} />
                </div>
                <div className="auth-feature-text-pro">
                  <span className="auth-feature-title-pro">Historial</span>
                  <span className="auth-feature-desc-pro">Registro de atención</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="auth-form-side-pro">
          <div className="auth-card-pro" style={{ maxWidth: '480px' }}>
            <div className="auth-card-header">
              <h2>Registro Profesional</h2>
              <p>Crea tu cuenta de profesional en SENA Bienestar</p>
            </div>

            {errorMessage && (
              <div className="auth-error-pro">
                <span className="error-icon-pro">!</span>
                {errorMessage}
              </div>
            )}

            <form className="auth-form-pro" onSubmit={handleSubmit}>
              <div className="field-pro">
                <label htmlFor="prof-fullname">Nombre completo *</label>
                <div className="input-wrapper-pro">
                  <User size={18} className="input-icon-pro" />
                  <input
                    id="prof-fullname"
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez García"
                    required
                  />
                </div>
              </div>

              <div className="field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="field-pro">
                  <label htmlFor="prof-document">Documento *</label>
                  <div className="input-wrapper-pro">
                    <FileText size={18} className="input-icon-pro" />
                    <input
                      id="prof-document"
                      type="text"
                      name="document_number"
                      value={formData.document_number}
                      onChange={handleChange}
                      placeholder="1234567890"
                      required
                    />
                  </div>
                </div>

                <div className="field-pro">
                  <label htmlFor="prof-phone">Teléfono</label>
                  <div className="input-wrapper-pro">
                    <Phone size={18} className="input-icon-pro" />
                    <input
                      id="prof-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="300 123 4567"
                    />
                  </div>
                </div>
              </div>

              <div className="field-pro">
                <label htmlFor="prof-email">Correo institucional *</label>
                <div className="input-wrapper-pro">
                  <Mail size={18} className="input-icon-pro" />
                  <input
                    id="prof-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu.email@sena.edu.co"
                    required
                  />
                </div>
              </div>

              <div className="field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="field-pro">
                  <label htmlFor="prof-profession">Profesión *</label>
                  <div className="input-wrapper-pro">
                    <Briefcase size={18} className="input-icon-pro" />
                    <select
                      id="prof-profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      required
                      style={{ flex: 1, border: 'none', background: 'transparent', padding: '0.875rem 0', fontSize: '0.95rem', color: '#1a1a1a', outline: 'none' }}
                    >
                      <option value="">Selecciona...</option>
                      {PROFESSIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-pro">
                  <label htmlFor="prof-specialty">Especialidad</label>
                  <div className="input-wrapper-pro">
                    <select
                      id="prof-specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      style={{ flex: 1, border: 'none', background: 'transparent', padding: '0.875rem 0', fontSize: '0.95rem', color: '#1a1a1a', outline: 'none' }}
                    >
                      <option value="">Selecciona...</option>
                      {getSpecialties().map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="field-pro">
                  <label htmlFor="prof-password">Contraseña *</label>
                  <div className="input-wrapper-pro">
                    <Lock size={18} className="input-icon-pro" />
                    <input
                      id="prof-password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="field-pro">
                  <label htmlFor="prof-confirm">Confirmar *</label>
                  <div className="input-wrapper-pro">
                    <Lock size={18} className="input-icon-pro" />
                    <input
                      id="prof-confirm"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repite tu contraseña"
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-submit-pro" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="loading-text-pro">
                    <span className="spinner-pro" />
                    Creando cuenta...
                  </span>
                ) : (
                  <>
                    Crear Cuenta Profesional
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
