import { useState, useEffect } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { Settings, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_CONFIG = {
  system_name: { value: "SENA Bienestar", label: "Nombre del Sistema", type: "text" },
  appointment_duration: { value: "30", label: "Duración de Citas (minutos)", type: "number" },
  max_daily_appointments: { value: "20", label: "Máximo de Citas por Día", type: "number" },
  allow_self_registration: { value: "true", label: "Permitir Auto-Registro", type: "boolean" },
  require_email_verification: { value: "false", label: "Requerir Verificación de Email", type: "boolean" },
  notification_enabled: { value: "true", label: "Notificaciones Activadas", type: "boolean" },
  working_hours_start: { value: "08:00", label: "Hora Inicio Jornada", type: "time" },
  working_hours_end: { value: "17:00", label: "Hora Fin Jornada", type: "time" },
  working_days: { value: "1,2,3,4,5", label: "Días Laborales (1=Lun, 7=Dom)", type: "text" },
};

export function SystemConfig() {
  const { config, loading, fetchConfig, updateConfig } = useAdmin();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(formData)) {
        await updateConfig(key, value);
      }
      toast.success("Configuración guardada exitosamente");
    } catch {
      toast.error("Error guardando configuración");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm("¿Restablecer la configuración por defecto?")) return;

    const defaults = {};
    Object.entries(DEFAULT_CONFIG).forEach(([key, config]) => {
      defaults[key] = config.value;
    });
    setFormData(defaults);
    toast.info("Configuración restablecida (pendiente de guardar)");
  };

  if (loading) {
    return <LoadingSpinner message="Cargando configuración..." />;
  }

  return (
    <div className="admin-section">
      <header className="section-header">
        <h2>
          <Settings size={20} />
          Configuración del Sistema
        </h2>
        <div className="header-actions">
          <button onClick={handleReset} className="btn-secondary">
            <RefreshCw size={18} />
            Restablecer
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            <Save size={18} />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </header>

      <div className="config-grid">
        <div className="config-card">
          <h3>General</h3>
          <div className="config-fields">
            {["system_name", "appointment_duration", "max_daily_appointments"].map(
              (key) => {
                const config = DEFAULT_CONFIG[key];
                return (
                  <div key={key} className="field">
                    <label htmlFor={`config-${key}`}>{config.label}</label>
                    <input
                      id={`config-${key}`}
                      type={config.type}
                      value={formData[key] || config.value}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  </div>
                );
              },
            )}
          </div>
        </div>

        <div className="config-card">
          <h3>Horario Laboral</h3>
          <div className="config-fields">
            {["working_hours_start", "working_hours_end", "working_days"].map(
              (key) => {
                const config = DEFAULT_CONFIG[key];
                return (
                  <div key={key} className="field">
                    <label htmlFor={`config-${key}`}>{config.label}</label>
                    <input
                      id={`config-${key}`}
                      type={config.type}
                      value={formData[key] || config.value}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  </div>
                );
              },
            )}
          </div>
        </div>

        <div className="config-card">
          <h3>Permisos</h3>
          <div className="config-fields">
            {["allow_self_registration", "require_email_verification", "notification_enabled"].map(
              (key) => {
                const config = DEFAULT_CONFIG[key];
                return (
                  <div key={key} className="field field-toggle">
                    <label htmlFor={`config-${key}`}>{config.label}</label>
                    <button
                      id={`config-${key}`}
                      type="button"
                      className={`toggle-btn ${formData[key] === "true" ? "active" : ""}`}
                      onClick={() =>
                        handleChange(
                          key,
                          formData[key] === "true" ? "false" : "true",
                        )
                      }
                    >
                      <span className="toggle-knob" />
                    </button>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
