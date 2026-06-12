import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../../providers/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../lib/supabase";

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
  "Psicólogo/a": 3,      // PSICOLOGIA
  "Enfermero/a": 4,      // ENFERMERIA
  "Trabajador/a Social": 5, // TRABAJO_SOCIAL
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
      // 1. Registrar usuario en auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo crear el usuario");

      // 2. Crear perfil con datos extendidos
      const roleId = PROFESSION_TO_ROLE[formData.profession] || 3; // PSICOLOGIA por defecto
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: formData.email,
        full_name: formData.full_name,
        document_number: formData.document_number,
        phone: formData.phone,
        profession: formData.profession,
        specialty: formData.specialty,
        role_id: roleId,
        is_active: true,
      });

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
    <div className="auth-page">
      <div className="auth-card professional-register">
        <h1>Registro de Profesional</h1>
        <p className="auth-subtitle">
          SENA Bienestar — Crea tu cuenta de profesional
        </p>

        {errorMessage && <div className="auth-error">{errorMessage}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="prof-fullname">Nombre completo *</label>
            <input
              id="prof-fullname"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="Ej: Juan Pérez García"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="prof-document">Documento de identidad *</label>
              <input
                id="prof-document"
                type="text"
                name="document_number"
                value={formData.document_number}
                onChange={handleChange}
                required
                placeholder="Ej: 1234567890"
              />
            </div>

            <div className="field">
              <label htmlFor="prof-phone">Teléfono</label>
              <input
                id="prof-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej: 300 123 4567"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="prof-email">Correo institucional *</label>
            <input
              id="prof-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu.email@sena.edu.co"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="prof-profession">Profesión *</label>
              <select
                id="prof-profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona...</option>
                {PROFESSIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="prof-specialty">Especialidad</label>
              <select
                id="prof-specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
              >
                <option value="">Selecciona...</option>
                {getSpecialties().map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="prof-password">Contraseña *</label>
              <input
                id="prof-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="field">
              <label htmlFor="prof-confirm">Confirmar contraseña *</label>
              <input
                id="prof-confirm"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Crear Cuenta Profesional"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="auth-link">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
