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
  Pencil,
  Save,
  Phone,
  Camera,
  LogOut,
  Heart,
  Clock,
  Star,
  CheckCircle,
  Briefcase,
  Stethoscope,
} from "lucide-react";

const ROLE_LABELS = {
  SUPERADMIN: "Super Administrador",
  COORDINACION: "Coordinación",
  PSICOLOGIA: "Psicología",
  ENFERMERIA: "Enfermería",
  TRABAJO_SOCIAL: "Trabajo Social",
  APRENDIZ: "Aprendiz",
};

const ROLE_COLORS = {
  SUPERADMIN: { bg: "#fef3c7", text: "#92400e", icon: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
  COORDINACION: { bg: "#dbeafe", text: "#1e40af", icon: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" },
  PSICOLOGIA: { bg: "#f3e8ff", text: "#6b21a8", icon: "#9333ea", gradient: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)" },
  ENFERMERIA: { bg: "#dcfce7", text: "#166534", icon: "#22c55e", gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" },
  TRABAJO_SOCIAL: { bg: "#ffe4e6", text: "#9f1239", icon: "#f43f5e", gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)" },
  APRENDIZ: { bg: "#e0f2fe", text: "#075985", icon: "#0ea5e9", gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)" },
};

export function UserProfile({ onClose }) {
  const { profile, user, updateProfile, signOut } = useAuth();
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
      profession: profile?.profession || "",
      specialty: profile?.specialty || "",
    },
  });

  if (!profile) return null;

  const dependencyConfig = profile.roles?.name
    ? getDependencyConfig(profile.roles.name)
    : null;

  const roleColors = ROLE_COLORS[profile.roles?.name] || ROLE_COLORS.APRENDIZ;
  const roleName =
    ROLE_LABELS[profile.roles?.name] ||
    dependencyConfig?.name ||
    profile.roles?.name;
  const avatarColor = dependencyConfig?.color || roleColors.icon;

  const isProfessional = ["PSICOLOGIA", "ENFERMERIA", "TRABAJO_SOCIAL"].includes(
    profile.roles?.name,
  );

  const onSubmit = async (data) => {
    const result = await updateProfile({
      full_name: data.full_name,
      document_number: data.document_number,
      phone: data.phone || null,
      profession: data.profession || null,
      specialty: data.specialty || null,
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
      profession: profile.profession || "",
      specialty: profile.specialty || "",
    });
    setEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="profile-modal-v3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con gradiente */}
        <div className="profile-header-v3">
          <div className="profile-header-pattern" />
          <button className="close-btn-v3" onClick={onClose}>
            <X size={18} />
          </button>

          <div className="profile-avatar-wrapper-v3">
            <div
              className="profile-avatar-v3"
              style={{ background: avatarColor }}
            >
              {profile.full_name?.[0] || "U"}
            </div>
            <button className="camera-btn-v3" title="Cambiar foto">
              <Camera size={12} />
            </button>
            <div className="avatar-ring-v3" />
          </div>

          <h2 className="profile-name-v3">{profile.full_name}</h2>
          
          <div className="profile-badges-v3">
            <span
              className="role-badge-v3"
              style={{ background: roleColors.bg, color: roleColors.text }}
            >
              <Shield size={11} />
              {roleName}
            </span>
            <span className={`status-badge-v3 ${profile.is_active ? "active" : "inactive"}`}>
              <span className="status-dot-v3" />
              {profile.is_active ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="profile-body-v3">
          {editing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="profile-form-v3">
              <div className="form-group-v3">
                <label>
                  <User size={14} />
                  Nombre completo
                </label>
                <input
                  className={errors.full_name ? "error" : ""}
                  {...register("full_name", {
                    required: "El nombre es obligatorio",
                  })}
                />
                {errors.full_name && (
                  <span className="error-text-v3">{errors.full_name.message}</span>
                )}
              </div>

              <div className="form-group-v3">
                <label>
                  <FileText size={14} />
                  Número de documento
                </label>
                <input
                  className={errors.document_number ? "error" : ""}
                  {...register("document_number", {
                    required: "El documento es obligatorio",
                  })}
                />
                {errors.document_number && (
                  <span className="error-text-v3">
                    {errors.document_number.message}
                  </span>
                )}
              </div>

              <div className="form-group-v3">
                <label>
                  <Phone size={14} />
                  Teléfono
                </label>
                <input placeholder="Opcional" {...register("phone")} />
              </div>

              <div className="form-group-v3">
                <label>
                  <Briefcase size={14} />
                  Profesión / Cargo
                </label>
                <input
                  placeholder="Ej: Psicóloga, Enfermera, Trabajadora Social"
                  {...register("profession")}
                />
              </div>

              {isProfessional && (
                <div className="form-group-v3">
                  <label>
                    <Stethoscope size={14} />
                    Especialidad
                  </label>
                  <input
                    placeholder="Ej: Psicología Clínica, Enfermería General"
                    {...register("specialty")}
                  />
                </div>
              )}

              <div className="form-actions-v3">
                <button
                  type="button"
                  className="btn-cancel-v3"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-save-v3"
                  disabled={isSubmitting}
                >
                  <Save size={14} />
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Quick Stats */}
              <div className="profile-stats-v3">
                <div className="stat-item-v3">
                  <div className="stat-icon-v3 green">
                    <CheckCircle size={16} />
                  </div>
                  <div className="stat-info-v3">
                    <span className="stat-value-v3">
                      {profile.is_active ? "Activo" : "Inactivo"}
                    </span>
                    <span className="stat-label-v3">Estado</span>
                  </div>
                </div>
                <div className="stat-item-v3">
                  <div className="stat-icon-v3 purple">
                    <Star size={16} />
                  </div>
                  <div className="stat-info-v3">
                    <span className="stat-value-v3">{roleName}</span>
                    <span className="stat-label-v3">Rol</span>
                  </div>
                </div>
              </div>

              {/* Info personal */}
              <div className="info-section-v3">
                <h3 className="section-title-v3">
                  <User size={13} />
                  Información Personal
                </h3>

                <div className="info-card-v3">
                  <div className="info-row-v3">
                    <div className="info-icon-v3">
                      <Mail size={15} />
                    </div>
                    <div className="info-content-v3">
                      <span className="info-label-v3">Correo electrónico</span>
                      <span className="info-value-v3">
                        {profile.email || user?.email || "No disponible"}
                      </span>
                    </div>
                  </div>

                  <div className="info-row-v3">
                    <div className="info-icon-v3">
                      <FileText size={15} />
                    </div>
                    <div className="info-content-v3">
                      <span className="info-label-v3">Documento</span>
                      <span className="info-value-v3">
                        {profile.document_number || "No registrado"}
                      </span>
                    </div>
                  </div>

                  {profile.phone && (
                    <div className="info-row-v3">
                      <div className="info-icon-v3">
                        <Phone size={15} />
                      </div>
                      <div className="info-content-v3">
                        <span className="info-label-v3">Teléfono</span>
                        <span className="info-value-v3">{profile.phone}</span>
                      </div>
                    </div>
                  )}

                  {profile.profession && (
                    <div className="info-row-v3">
                      <div className="info-icon-v3">
                        <Briefcase size={15} />
                      </div>
                      <div className="info-content-v3">
                        <span className="info-label-v3">Profesión / Cargo</span>
                        <span className="info-value-v3">{profile.profession}</span>
                      </div>
                    </div>
                  )}

                  {isProfessional && profile.specialty && (
                    <div className="info-row-v3">
                      <div className="info-icon-v3">
                        <Stethoscope size={15} />
                      </div>
                      <div className="info-content-v3">
                        <span className="info-label-v3">Especialidad</span>
                        <span className="info-value-v3">{profile.specialty}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info institucional */}
              <div className="info-section-v3">
                <h3 className="section-title-v3">
                  <Building2 size={13} />
                  Información Institucional
                </h3>

                <div className="info-card-v3">
                  {profile.dependencies?.name && (
                    <div className="info-row-v3">
                      <div className="info-icon-v3">
                        <Heart size={15} />
                      </div>
                      <div className="info-content-v3">
                        <span className="info-label-v3">Dependencia</span>
                        <span className="info-value-v3">
                          {profile.dependencies.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {profile.created_at && (
                    <div className="info-row-v3">
                      <div className="info-icon-v3">
                        <Clock size={15} />
                      </div>
                      <div className="info-content-v3">
                        <span className="info-label-v3">Miembro desde</span>
                        <span className="info-value-v3">
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
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!editing && (
          <div className="profile-footer-v3">
            <button className="edit-btn-v3" onClick={() => setEditing(true)}>
              <Pencil size={14} />
              Editar perfil
            </button>
            <button className="logout-btn-v3" onClick={handleLogout}>
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
