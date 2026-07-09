import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pendiente", color: "#f59e0b", icon: AlertCircle, bg: "#fef3c7" },
  confirmed: { label: "Confirmada", color: "#3b82f6", icon: CheckCircle, bg: "#dbeafe" },
  completed: { label: "Completada", color: "#22c55e", icon: CheckCircle, bg: "#dcfce7" },
  cancelled: { label: "Cancelada", color: "#ef4444", icon: XCircle, bg: "#fee2e2" },
  no_show: { label: "No asistió", color: "#6b7280", icon: XCircle, bg: "#f3f4f6" },
};

export function AppointmentCard({ appointment, onCancel, showCancelButton = false }) {
  const {
    dependencies,
    scheduled_date,
    scheduled_time,
    status,
    reason,
    notes,
    profiles,
  } = appointment;
  const config = STATUS_CONFIG[status] || { label: status || "Desconocido", color: "#6b7280", icon: AlertCircle, bg: "#f3f4f6" };
  const Icon = config.icon;

  // Formatear fecha de manera mas legible
  const formatDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), "EEEE, d 'de' MMMM yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

  // Formatear hora (quitar segundos si existen)
  const formatTime = (time) => {
    if (!time) return "";
    return time.substring(0, 5); // "10:00:00" -> "10:00"
  };

  return (
    <div
      className="appointment-card-v3"
      style={{ borderLeftColor: dependencies?.color || "#ccc" }}
    >
      {/* Header de la tarjeta */}
      <div className="card-header-v3">
        <div className="card-header-left">
          <div
            className="dependency-badge-v3"
            style={{ background: dependencies?.color || "#ccc" }}
          >
            {dependencies?.name || "Sin dependencia"}
          </div>
          <span className="card-date-v3">
            <Calendar size={14} />
            {formatDate(scheduled_date)}
          </span>
        </div>
        <div className="status-badge-v3" style={{ background: config.bg, color: config.color }}>
          <Icon size={14} />
          <span>{config.label}</span>
        </div>
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="card-body-v3">
        <div className="card-time-v3">
          <Clock size={16} />
          <span>{formatTime(scheduled_time)}</span>
        </div>

        {reason && (
          <div className="card-reason-v3">
            <FileText size={14} />
            <p>{reason.length > 100 ? reason.substring(0, 100) + "..." : reason}</p>
          </div>
        )}

        {profiles?.full_name && (
          <div className="card-student-v3">
            <div className="student-avatar-v3">
              {profiles.full_name[0]}
            </div>
            <div className="student-info-v3">
              <span className="student-name-v3">{profiles.full_name}</span>
              <span className="student-label-v3">Aprendiz</span>
            </div>
          </div>
        )}

        {notes && (
          <div className="card-notes-v3">
            <span className="notes-label-v3">Observaciones:</span>
            <span className="notes-text-v3">{notes}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      {showCancelButton && status === "pending" && (
        <div className="card-actions-v3">
          <button onClick={onCancel} className="btn-cancel-appointment-v3">
            Cancelar Cita
          </button>
        </div>
      )}
    </div>
  );
}
