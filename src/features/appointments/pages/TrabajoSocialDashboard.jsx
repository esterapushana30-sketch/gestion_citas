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
  Users,
} from "lucide-react";
import { toast } from "sonner";

const APPOINTMENT_FILTERS = [
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "completed", label: "Historial" },
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

export default function TrabajoSocialDashboard() {
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

  return (
    <div className="dependency-dashboard">
      <header
        className="dependency-header"
        style={{ borderLeft: `4px solid ${config.color}` }}
      >
        <div className="dependency-icon" style={{ background: config.color }}>
          <Users size={24} />
        </div>
        <div className="dependency-info" style={{ flex: 1 }}>
          <h1>{config.name}</h1>
          <p>Gestión de citas para trabajo social y acompañamiento</p>
        </div>
        <div className="header-actions">
          <button onClick={handleShowHistory} className="btn-secondary">
            <History size={18} />
            Historial
          </button>
          <button
            onClick={handleOpenAvailability}
            className="btn-secondary"
          >
            <Clock size={18} />
            Mi Horario
          </button>
          <button
            onClick={() => fetchAppointments({ status: filter })}
            className="btn-secondary"
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
        </div>
      </header>

      <nav
        className="dependency-filter-tabs"
        style={{ "--dependency-color": config.color }}
      >
        {APPOINTMENT_FILTERS.map((opt) => (
          <button
            key={opt.value}
            className={filter === opt.value ? "active" : ""}
            style={
              filter === opt.value
                ? { background: config.color, color: "#fff" }
                : {}
            }
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </nav>

      <div className="appointments-grid">
        {isLoading ? (
          <LoadingSpinner message="Cargando citas..." />
        ) : appointments.length === 0 ? (
          <div className="dependency-empty-state">
            <CalendarX size={48} color="#9ca3af" />
            <p>No hay citas {filter === "pending" ? "pendientes" : filter === "confirmed" ? "confirmadas" : "en historial"}</p>
            <span>Cuando haya citas, aparecerán aquí</span>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="appointments-wrapper">
              <AppointmentCard appointment={apt} showCancelButton={false} />

              {filter === "pending" && (
                <div className="professional-actions">
                  <button
                    onClick={() => handleConfirm(apt.id)}
                    className="btn-success"
                  >
                    {config.confirmLabel}
                  </button>
                  <button
                    onClick={() => handleReschedule(apt)}
                    className="btn-secondary"
                  >
                    <Clock size={14} />
                    {config.rescheduleLabel}
                  </button>
                  <button
                    onClick={() => handleNoshow(apt.id)}
                    className="btn-danger"
                  >
                    {config.noShowLabel}
                  </button>
                </div>
              )}

              {filter === "confirmed" && (
                <div className="professional-actions">
                  <button
                    onClick={() =>
                      handleComplete(apt.id, "Atención completada")
                    }
                    className="btn-primary"
                  >
                    {config.completeLabel}
                  </button>
                  <button
                    onClick={() => handleObservations(apt)}
                    className="btn-secondary"
                  >
                    <FileText size={14} />
                    Observaciones
                  </button>
                </div>
              )}

              {filter === "completed" && (
                <div className="professional-actions">
                  <button
                    onClick={() => handleObservations(apt)}
                    className="btn-secondary"
                  >
                    <FileText size={14} />
                    Observaciones
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showReschedule && (
        <div className="modal-overlay" onClick={() => setShowReschedule(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <Clock size={20} />
                Reprogramar Cita
              </h3>
              <button onClick={() => setShowReschedule(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Cita actual: {showReschedule.scheduled_date} a las{" "}
                {showReschedule.scheduled_time}
              </p>
              <div className="field">
                <label>Nueva fecha:</label>
                <input
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) =>
                    setRescheduleData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="field">
                <label>Nueva hora:</label>
                <input
                  type="time"
                  value={rescheduleData.time}
                  onChange={(e) =>
                    setRescheduleData((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowReschedule(null)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReschedule}
                className="btn-primary"
                disabled={isUpdating}
              >
                <Save size={16} />
                {isUpdating ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showObservations && (
        <div className="modal-overlay" onClick={() => setShowObservations(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <FileText size={20} />
                Observaciones de la Cita
              </h3>
              <button onClick={() => setShowObservations(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Fecha:</strong> {showObservations.scheduled_date} -{" "}
                {showObservations.scheduled_time}
              </p>
              <div className="field">
                <label>Observaciones:</label>
                <textarea
                  value={observationsData}
                  onChange={(e) => setObservationsData(e.target.value)}
                  rows={6}
                  placeholder="Escribe las observaciones de la atención..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowObservations(null)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={saveObservations}
                className="btn-primary"
                disabled={isUpdating}
              >
                <Save size={16} />
                {isUpdating ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAvailability && (
        <div className="modal-overlay" onClick={() => setShowAvailability(false)}>
          <div
            className="modal-content modal-availability"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <Clock size={20} />
                Gestionar Disponibilidad (Trabajo Social)
              </h3>
              <button onClick={() => setShowAvailability(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Configura tu horario de atención para acompañamiento social y actividades comunitarias.
              </p>
              <div className="availability-grid">
                {DAYS_OF_WEEK.map((day, index) => {
                  const dayData = availabilityData.find(
                    (a) => a.day_of_week === index,
                  );
                  return (
                    <div key={index} className="availability-day">
                      <div className="day-header">
                        <label>
                          <input
                            type="checkbox"
                            checked={dayData?.is_available || false}
                            onChange={(e) =>
                              handleAvailabilityChange(
                                index,
                                "is_available",
                                e.target.checked,
                              )
                            }
                          />
                          {day}
                        </label>
                      </div>
                      {dayData?.is_available && (
                        <div className="day-hours">
                          <input
                            type="time"
                            value={dayData?.start_time || "08:00"}
                            onChange={(e) =>
                              handleAvailabilityChange(
                                index,
                                "start_time",
                                e.target.value,
                              )
                            }
                          />
                          <span>a</span>
                          <input
                            type="time"
                            value={dayData?.end_time || "17:00"}
                            onChange={(e) =>
                              handleAvailabilityChange(
                                index,
                                "end_time",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowAvailability(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={saveAvailability}
                className="btn-primary"
                disabled={isUpdating}
              >
                <Save size={16} />
                {isUpdating ? "Guardando..." : "Guardar Disponibilidad"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div
            className="modal-content modal-history"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <History size={20} />
                Historial de Atención (Trabajo Social)
              </h3>
              <button onClick={() => setShowHistory(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {history.length === 0 ? (
                <p>No hay registros en el historial.</p>
              ) : (
                <div className="history-table-wrapper">
                  <table className="history-table">
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
                            <span
                              className={`status-badge status-${apt.status}`}
                            >
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
            <div className="modal-footer">
              <button
                onClick={() => setShowHistory(false)}
                className="btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}