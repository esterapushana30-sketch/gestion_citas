import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { useProfessional } from "../hooks/useProfessional";
import { AppointmentCard } from "../components/AppointmentCard";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { useAuth } from "../../../providers/AuthProvider";
import { getDependencyConfig } from "../config/dependencies.config";
import {
  CalendarX,
  RefreshCw,
  Calendar,
  Clock,
  FileText,
  History,
  X,
  Save,
  CheckCircle,
  Users,
  Brain,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const APPOINTMENT_FILTERS = [
  { value: "pending", label: "Pendientes", icon: Clock },
  { value: "confirmed", label: "Confirmadas", icon: CheckCircle },
  { value: "completed", label: "Historial", icon: History },
];

const DAYS_OF_WEEK = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function ProfessionalDashboard() {
  const { appointments, fetchAppointments, isLoading } = useAppointments();
  const {
    confirmAppointment,
    completeAppointment,
    cancelAppointment,
    rescheduleAppointment,
    addObservations,
    fetchAvailability,
    updateAvailability,
    history,
    fetchHistory,
  } = useProfessional();
  const { profile } = useAuth();
  const [filter, setFilter] = useState("pending");
  const [showReschedule, setShowReschedule] = useState(null);
  const [showObservations, setShowObservations] = useState(null);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" });
  const [observationsData, setObservationsData] = useState("");
  const [availabilityData, setAvailabilityData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const config = useMemo(
    () => getDependencyConfig(profile?.roles?.name),
    [profile?.roles?.name],
  );

  const Icon = config.icon;

  // Estadísticas profesionales
  const stats = useMemo(() => {
    const pendingCount = appointments.filter((a) => a.status === "pending").length;
    const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
    const completedCount = appointments.filter((a) => a.status === "completed").length;
    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = appointments.filter((a) => a.scheduled_date === today);
    const todayCount = todayAppointments.length;
    const totalCount = appointments.length;

    // Próxima cita
    const now = new Date();
    const upcoming = appointments
      .filter((a) => a.status === "confirmed" || a.status === "pending")
      .sort((a, b) => {
        const dateA = new Date(`${a.scheduled_date}T${a.scheduled_time}`);
        const dateB = new Date(`${b.scheduled_date}T${b.scheduled_time}`);
        return dateA - dateB;
      })
      .find((a) => new Date(`${a.scheduled_date}T${a.scheduled_time}`) > now);

    return {
      pendingCount,
      confirmedCount,
      completedCount,
      todayCount,
      totalCount,
      upcoming,
      todayAppointments,
    };
  }, [appointments]);

  useEffect(() => {
    fetchAppointments({ status: filter });
  }, [filter, fetchAppointments]);

  const loadAvailability = useCallback(async () => {
    const data = await fetchAvailability();
    setAvailabilityData(data);
  }, [fetchAvailability]);

  const handleOpenAvailability = () => {
    setShowAvailability(true);
    loadAvailability();
  };

  const handleConfirm = async (id) => {
    await confirmAppointment(id);
    fetchAppointments({ status: filter });
  };

  const handleComplete = async (id, notes) => {
    await completeAppointment(id, notes);
    fetchAppointments({ status: filter });
  };

  const handleNoshow = async (id) => {
    await cancelAppointment(id, "No asistió");
    fetchAppointments({ status: filter });
  };

  const handleReschedule = (appointment) => {
    setShowReschedule(appointment);
    setRescheduleData({
      date: appointment.scheduled_date,
      time: appointment.scheduled_time,
    });
  };

  const confirmReschedule = async () => {
    if (!rescheduleData.date || !rescheduleData.time) {
      toast.error("Selecciona fecha y hora");
      return;
    }
    setIsUpdating(true);
    const result = await rescheduleAppointment(
      showReschedule.id,
      rescheduleData.date,
      rescheduleData.time,
    );
    setIsUpdating(false);
    if (result.success) {
      setShowReschedule(null);
      fetchAppointments({ status: filter });
    }
  };

  const handleObservations = (appointment) => {
    setShowObservations(appointment);
    setObservationsData(appointment.notes || "");
  };

  const saveObservations = async () => {
    setIsUpdating(true);
    const result = await addObservations(showObservations.id, observationsData);
    setIsUpdating(false);
    if (result.success) {
      setShowObservations(null);
      fetchAppointments({ status: filter });
    }
  };

  const handleAvailabilityChange = (dayIndex, field, value) => {
    setAvailabilityData((prev) => {
      const existing = prev.find((a) => a.day_of_week === dayIndex);
      if (existing) {
        return prev.map((a) =>
          a.day_of_week === dayIndex ? { ...a, [field]: value } : a,
        );
      }
      return [
        ...prev,
        {
          day_of_week: dayIndex,
          start_time: "08:00",
          end_time: "17:00",
          is_available: true,
          [field]: value,
        },
      ];
    });
  };

  const saveAvailability = async () => {
    setIsUpdating(true);
    let success = true;
    for (const item of availabilityData) {
      const result = await updateAvailability(
        item.day_of_week,
        item.start_time,
        item.end_time,
        item.is_available,
      );
      if (!result.success) success = false;
    }
    setIsUpdating(false);
    if (success) {
      toast.success("Disponibilidad guardada correctamente");
      setShowAvailability(false);
    }
  };

  const handleShowHistory = async () => {
    await fetchHistory();
    setShowHistory(true);
  };

  // Saludo según hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="pro-dashboard">
      {/* ═══════ HERO HEADER ═══════ */}
      <header
        className="pro-hero"
        style={{
          "--dep-color": config.color,
          "--dep-color-light": config.colorLight || `${config.color}15`,
        }}
      >
        <div className="pro-hero-bg" />
        <div className="pro-hero-content">
          <div className="pro-hero-left">
            <div className="pro-hero-icon">
              <Icon size={28} />
            </div>
            <div>
              <p className="pro-hero-greeting">{getGreeting()}</p>
              <h1 className="pro-hero-title">{config.name}</h1>
              <p className="pro-hero-subtitle">{config.description}</p>
            </div>
          </div>
          <div className="pro-hero-actions">
            <button onClick={handleShowHistory} className="pro-btn pro-btn-ghost">
              <History size={16} />
              Historial
            </button>
            <button onClick={handleOpenAvailability} className="pro-btn pro-btn-ghost">
              <Clock size={16} />
              Mi Horario
            </button>
            <button
              onClick={() => fetchAppointments({ status: filter })}
              className="pro-btn pro-btn-solid"
            >
              <RefreshCw size={16} />
              Actualizar
            </button>
          </div>
        </div>
      </header>

      {/* ═══════ KPI CARDS ═══════ */}
      <div className="pro-kpis">
        <div className="pro-kpi pro-kpi--today" style={{ "--kpi-color": config.color }}>
          <div className="pro-kpi-icon">
            <Calendar size={20} />
          </div>
          <div className="pro-kpi-data">
            <span className="pro-kpi-value">{stats.todayCount}</span>
            <span className="pro-kpi-label">Citas de hoy</span>
          </div>
        </div>

        <div className="pro-kpi pro-kpi--pending">
          <div className="pro-kpi-icon">
            <Clock size={20} />
          </div>
          <div className="pro-kpi-data">
            <span className="pro-kpi-value">{stats.pendingCount}</span>
            <span className="pro-kpi-label">Pendientes</span>
          </div>
          {stats.pendingCount > 0 && (
            <span className="pro-kpi-badge">Requieren atención</span>
          )}
        </div>

        <div className="pro-kpi pro-kpi--confirmed">
          <div className="pro-kpi-icon">
            <CheckCircle size={20} />
          </div>
          <div className="pro-kpi-data">
            <span className="pro-kpi-value">{stats.confirmedCount}</span>
            <span className="pro-kpi-label">Confirmadas</span>
          </div>
        </div>

        <div className="pro-kpi pro-kpi--total">
          <div className="pro-kpi-icon">
            <TrendingUp size={20} />
          </div>
          <div className="pro-kpi-data">
            <span className="pro-kpi-value">{stats.totalCount}</span>
            <span className="pro-kpi-label">Total período</span>
          </div>
        </div>
      </div>

      {/* ═══════ NEXT APPOINTMENT BANNER ═══════ */}
      {stats.upcoming && (
        <div className="pro-next-banner" style={{ "--dep-color": config.color }}>
          <div className="pro-next-icon">
            <Sparkles size={18} />
          </div>
          <div className="pro-next-info">
            <span className="pro-next-label">Próxima cita</span>
            <span className="pro-next-detail">
              {stats.upcoming.profiles?.full_name || "Aprendiz"} —{" "}
              {stats.upcoming.scheduled_date} a las {stats.upcoming.scheduled_time}
            </span>
          </div>
          <ArrowRight size={18} className="pro-next-arrow" />
        </div>
      )}

      {/* ═══════ FILTER TABS ═══════ */}
      <nav className="pro-filters" style={{ "--dep-color": config.color }}>
        {APPOINTMENT_FILTERS.map((opt) => {
          const FilterIcon = opt.icon;
          const count =
            opt.value === "pending"
              ? stats.pendingCount
              : opt.value === "confirmed"
                ? stats.confirmedCount
                : stats.completedCount;
          return (
            <button
              key={opt.value}
              className={`pro-filter-btn ${filter === opt.value ? "active" : ""}`}
              onClick={() => setFilter(opt.value)}
            >
              <FilterIcon size={15} />
              <span>{opt.label}</span>
              <span className="pro-filter-count">{count}</span>
            </button>
          );
        })}
      </nav>

      {/* ═══════ APPOINTMENTS LIST ═══════ */}
      <div className="pro-appointments">
        {isLoading ? (
          <LoadingSpinner message="Cargando citas..." />
        ) : appointments.length === 0 ? (
          <div className="pro-empty">
            <div className="pro-empty-icon">
              <CalendarX size={40} />
            </div>
            <h3>
              {filter === "pending"
                ? "Sin citas pendientes"
                : filter === "confirmed"
                  ? "Sin citas confirmadas"
                  : "Sin historial"}
            </h3>
            <p>
              {filter === "pending"
                ? "No hay nuevas solicitudes de cita en este momento."
                : filter === "confirmed"
                  ? "No tienes citas confirmadas para atender."
                  : "Aún no has completado ninguna atención."}
            </p>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="pro-apt-wrapper">
              <AppointmentCard appointment={apt} showCancelButton={false} />

              {filter === "pending" && (
                <div className="pro-apt-actions">
                  <button
                    onClick={() => handleConfirm(apt.id)}
                    className="pro-action pro-action--confirm"
                  >
                    <CheckCircle size={15} />
                    {config.confirmLabel}
                  </button>
                  <button
                    onClick={() => handleReschedule(apt)}
                    className="pro-action pro-action--reschedule"
                  >
                    <Clock size={15} />
                    {config.rescheduleLabel}
                  </button>
                  <button
                    onClick={() => handleNoshow(apt.id)}
                    className="pro-action pro-action--noshow"
                  >
                    {config.noShowLabel}
                  </button>
                </div>
              )}

              {filter === "confirmed" && (
                <div className="pro-apt-actions">
                  <button
                    onClick={() => handleComplete(apt.id, "Atención completada")}
                    className="pro-action pro-action--complete"
                  >
                    <CheckCircle size={15} />
                    {config.completeLabel}
                  </button>
                  <button
                    onClick={() => handleObservations(apt)}
                    className="pro-action pro-action--notes"
                  >
                    <FileText size={15} />
                    Observaciones
                  </button>
                </div>
              )}

              {filter === "completed" && (
                <div className="pro-apt-actions">
                  <button
                    onClick={() => handleObservations(apt)}
                    className="pro-action pro-action--notes"
                  >
                    <FileText size={15} />
                    Observaciones
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ═══════ MODAL: REPROGRAMAR ═══════ */}
      {showReschedule && (
        <div className="pro-modal-overlay" onClick={() => setShowReschedule(null)}>
          <div className="pro-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <h3>
                <Clock size={20} />
                Reprogramar Cita
              </h3>
              <button onClick={() => setShowReschedule(null)} className="pro-modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="pro-modal-body">
              <p className="pro-modal-context">
                Cita actual: <strong>{showReschedule.scheduled_date}</strong> a las{" "}
                <strong>{showReschedule.scheduled_time}</strong>
              </p>
              <div className="pro-form-group">
                <label>Nueva fecha</label>
                <input
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) =>
                    setRescheduleData((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
              <div className="pro-form-group">
                <label>Nueva hora</label>
                <input
                  type="time"
                  value={rescheduleData.time}
                  onChange={(e) =>
                    setRescheduleData((prev) => ({ ...prev, time: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="pro-modal-footer">
              <button onClick={() => setShowReschedule(null)} className="pro-btn pro-btn-ghost">
                Cancelar
              </button>
              <button
                onClick={confirmReschedule}
                className="pro-btn pro-btn-solid"
                disabled={isUpdating}
              >
                <Save size={16} />
                {isUpdating ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ MODAL: OBSERVACIONES ═══════ */}
      {showObservations && (
        <div className="pro-modal-overlay" onClick={() => setShowObservations(null)}>
          <div className="pro-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <h3>
                <FileText size={20} />
                Observaciones de la Cita
              </h3>
              <button onClick={() => setShowObservations(null)} className="pro-modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="pro-modal-body">
              <p className="pro-modal-context">
                <strong>Fecha:</strong> {showObservations.scheduled_date} —{" "}
                {showObservations.scheduled_time}
              </p>
              <div className="pro-form-group">
                <label>Observaciones</label>
                <textarea
                  value={observationsData}
                  onChange={(e) => setObservationsData(e.target.value)}
                  rows={6}
                  placeholder="Escribe las observaciones de la atención..."
                />
              </div>
            </div>
            <div className="pro-modal-footer">
              <button onClick={() => setShowObservations(null)} className="pro-btn pro-btn-ghost">
                Cancelar
              </button>
              <button
                onClick={saveObservations}
                className="pro-btn pro-btn-solid"
                disabled={isUpdating}
              >
                <Save size={16} />
                {isUpdating ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ MODAL: DISPONIBILIDAD ═══════ */}
      {showAvailability && (
        <div className="pro-modal-overlay" onClick={() => setShowAvailability(false)}>
          <div className="pro-modal pro-modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <h3>
                <Clock size={20} />
                Gestionar Disponibilidad
              </h3>
              <button onClick={() => setShowAvailability(false)} className="pro-modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="pro-modal-body">
              <p className="pro-modal-context">
                Configura tu horario de atención para cada día de la semana.
              </p>
              <div className="pro-availability-grid">
                {DAYS_OF_WEEK.map((day, index) => {
                  const dayData = availabilityData.find((a) => a.day_of_week === index);
                  return (
                    <div
                      key={index}
                      className={`pro-avail-day ${dayData?.is_available ? "active" : ""}`}
                    >
                      <div className="pro-avail-check">
                        <input
                          type="checkbox"
                          checked={dayData?.is_available || false}
                          onChange={(e) =>
                            handleAvailabilityChange(index, "is_available", e.target.checked)
                          }
                          id={`day-${index}`}
                        />
                        <label htmlFor={`day-${index}`}>{day}</label>
                      </div>
                      {dayData?.is_available && (
                        <div className="pro-avail-hours">
                          <input
                            type="time"
                            value={dayData?.start_time || "08:00"}
                            onChange={(e) =>
                              handleAvailabilityChange(index, "start_time", e.target.value)
                            }
                          />
                          <span>a</span>
                          <input
                            type="time"
                            value={dayData?.end_time || "17:00"}
                            onChange={(e) =>
                              handleAvailabilityChange(index, "end_time", e.target.value)
                            }
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pro-modal-footer">
              <button onClick={() => setShowAvailability(false)} className="pro-btn pro-btn-ghost">
                Cancelar
              </button>
              <button
                onClick={saveAvailability}
                className="pro-btn pro-btn-solid"
                disabled={isUpdating}
              >
                <Save size={16} />
                {isUpdating ? "Guardando..." : "Guardar Disponibilidad"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ MODAL: HISTORIAL ═══════ */}
      {showHistory && (
        <div className="pro-modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="pro-modal pro-modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <h3>
                <History size={20} />
                Historial de Atención
              </h3>
              <button onClick={() => setShowHistory(false)} className="pro-modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="pro-modal-body">
              {history.length === 0 ? (
                <div className="pro-empty" style={{ padding: "2rem" }}>
                  <CalendarX size={32} color="#9ca3af" />
                  <p>No hay registros en el historial.</p>
                </div>
              ) : (
                <div className="pro-history-table-wrap">
                  <table className="pro-history-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Aprendiz</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((apt) => (
                        <tr key={apt.id}>
                          <td>{apt.scheduled_date}</td>
                          <td>{apt.scheduled_time}</td>
                          <td>{apt.profiles?.full_name || "N/A"}</td>
                          <td>
                            <span className={`pro-status pro-status--${apt.status}`}>
                              {apt.status}
                            </span>
                          </td>
                          <td>
                            {apt.notes
                              ? apt.notes.substring(0, 50) +
                                (apt.notes.length > 50 ? "..." : "")
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="pro-modal-footer">
              <button onClick={() => setShowHistory(false)} className="pro-btn pro-btn-ghost">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
