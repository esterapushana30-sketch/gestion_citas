import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../providers/AuthProvider";
import { getDependencyConfig } from "../../features/appointments/config/dependencies.config";
import { toast } from "sonner";
import {
  X,
  User,
  Mail,
  FileText,
  Shield,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Pencil,
  Save,
  Phone,
} from "lucide-react";

const ROLE_LABELS = {
  SUPERADMIN: "Super Administrador",
  COORDINACION: "Coordinación",
  PSICOLOGIA: "Psicología",
  ENFERMERIA: "Enfermería",
  TRABAJO_SOCIAL: "Trabajo Social",
  APRENDIZ: "Aprendiz",
};

export function UserProfile({ onClose }) {
  const { profile, user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      full_name: profile?.full_name || "",
      document_number: profile?.document_number || "",
      phone: profile?.phone || "",
    },
  });

  if (!profile) return null;

  const dependencyConfig = profile.roles?.name
    ? getDependencyConfig(profile.roles.name)
    : null;

  const Icon = dependencyConfig?.icon || Shield;

  const onSubmit = async (data) => {
    const result = await updateProfile({
      full_name: data.full_name,
      document_number: data.document_number,
      phone: data.phone || null,
    });
    if (result.success) {
      toast.success("Perfil actualizado correctamente");
      setEditing(false);
    } else {
      toast.error(result.error || "No se pudo actualizar el perfil");
    }
  };

  const handleCancel = () => {
    reset({
      full_name: profile.full_name || "",
      document_number: profile.document_number || "",
      phone: profile.phone || "",
    });
    setEditing(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-header">
          <h2>{editing ? "Editar Perfil" : "Mi Perfil"}</h2>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {!editing && (
              <button
                className="btn-icon"
                onClick={() => setEditing(true)}
                title="Editar perfil"
              >
                <Pencil size={16} />
              </button>
            )}
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-avatar-section">
            <div
              className="profile-avatar"
              style={{
                background: dependencyConfig?.color || "var(--sena-green)",
              }}
            >
              {profile.full_name?.[0] || "U"}
            </div>
            <h3 className="profile-name">{profile.full_name}</h3>
            <span
              className="profile-role-badge"
              style={{
                background: dependencyConfig?.colorLight || "#dcfce7",
                color: dependencyConfig?.color || "#166534",
              }}
            >
              <Icon size={14} />
              {dependencyConfig?.name ||
                ROLE_LABELS[profile.roles?.name] ||
                profile.roles?.name}
            </span>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
              <div className="profile-info-section">
                <h4>Información Personal</h4>

                <div className="form-field">
                  <label className="form-label">
                    <User size={14} /> Nombre completo
                  </label>
                  <input
                    className={`form-input ${errors.full_name ? "error" : ""}`}
                    {...register("full_name", {
                      required: "El nombre es obligatorio",
                    })}
                  />
                  {errors.full_name && (
                    <span className="form-error">{errors.full_name.message}</span>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">
                    <FileText size={14} /> Número de documento
                  </label>
                  <input
                    className={`form-input ${errors.document_number ? "error" : ""}`}
                    {...register("document_number", {
                      required: "El documento es obligatorio",
                    })}
                  />
                  {errors.document_number && (
                    <span className="form-error">
                      {errors.document_number.message}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">
                    <Phone size={14} /> Teléfono
                  </label>
                  <input
                    className="form-input"
                    placeholder="Opcional"
                    {...register("phone")}
                  />
                </div>
              </div>

              <div className="profile-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  <Save size={16} />
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="profile-info-section">
                <h4>Información Personal</h4>

                <div className="profile-field">
                  <div className="profile-field-icon">
                    <User size={16} />
                  </div>
                  <div className="profile-field-content">
                    <span className="profile-field-label">Nombre completo</span>
                    <span className="profile-field-value">
                      {profile.full_name}
                    </span>
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-icon">
                    <Mail size={16} />
                  </div>
                  <div className="profile-field-content">
                    <span className="profile-field-label">
                      Correo electrónico
                    </span>
                    <span className="profile-field-value">
                      {profile.email || user?.email || "No disponible"}
                    </span>
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-icon">
                    <FileText size={16} />
                  </div>
                  <div className="profile-field-content">
                    <span className="profile-field-label">
                      Número de documento
                    </span>
                    <span className="profile-field-value">
                      {profile.document_number || "No registrado"}
                    </span>
                  </div>
                </div>

                {profile.phone && (
                  <div className="profile-field">
                    <div className="profile-field-icon">
                      <Phone size={16} />
                    </div>
                    <div className="profile-field-content">
                      <span className="profile-field-label">Teléfono</span>
                      <span className="profile-field-value">
                        {profile.phone}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="profile-info-section">
                <h4>Información Institucional</h4>

                <div className="profile-field">
                  <div className="profile-field-icon">
                    <Shield size={16} />
                  </div>
                  <div className="profile-field-content">
                    <span className="profile-field-label">Rol</span>
                    <span className="profile-field-value">
                      {ROLE_LABELS[profile.roles?.name] || profile.roles?.name}
                    </span>
                  </div>
                </div>

                {profile.dependencies?.name && (
                  <div className="profile-field">
                    <div className="profile-field-icon">
                      <Building2 size={16} />
                    </div>
                    <div className="profile-field-content">
                      <span className="profile-field-label">Dependencia</span>
                      <span className="profile-field-value">
                        {profile.dependencies.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="profile-field">
                  <div className="profile-field-icon">
                    {profile.is_active ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                  </div>
                  <div className="profile-field-content">
                    <span className="profile-field-label">Estado</span>
                    <span
                      className="profile-field-value"
                      style={{
                        color: profile.is_active ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {profile.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                {profile.created_at && (
                  <div className="profile-field">
                    <div className="profile-field-icon">
                      <Calendar size={16} />
                    </div>
                    <div className="profile-field-content">
                      <span className="profile-field-label">Miembro desde</span>
                      <span className="profile-field-value">
                        {new Date(profile.created_at).toLocaleDateString(
                          "es-CO",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
