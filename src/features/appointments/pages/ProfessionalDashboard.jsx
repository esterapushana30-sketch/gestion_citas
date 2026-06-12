import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { useProfessional } from "../hooks/useProfessional";
import { useDependencyDashboard } from "../hooks/useDependencyDashboard";
import { AppointmentCard } from "../components/AppointmentCard";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { useAuth } from "../../../providers/AuthProvider";
import { getDependencyConfig } from "../config/dependencies.config";
import { KPICard } from "../../dashboard/components/KPICard";
import { DependencyChart } from "../../dashboard/components/DependencyChart";
import { MonthlyTrendChart } from "../../dashboard/components/MonthlyTrendChart";
import { ProfessionalTable } from "../../dashboard/components/ProfessionalTable";
import {
  CalendarX,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  FileText,
  History,
  X,
  Save,
} from "lucide-react";
import { format, subMonths } from "date-fns";
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

export default function ProfessionalDashboard() {
  const { appointments, fetchAppointments, isLoading } =
    useAppointments();
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
  const {
    kpis,
    byDependency,
    monthlyTrend,
    professionals,
    loading: metricsLoading,
    fetchAllMetrics,
    exportToCSV,
  } = useDependencyDashboard();
  const { profile } = useAuth();
  const [filter, setFilter] = useState("pending");
  const [dateRange, setDateRange] = useState({
    from: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });

  // Estados para modales
  const [showReschedule, setShowReschedule] = useState(null);
  const [showObservations, setShowObservations] = useState(null);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
  });
  const [observationsData, setObservationsData] = useState("");
  const [availabilityData, setAvailabilityData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const config = useMemo(
    () => getDependencyConfig(profile?.roles?.name),
    [profile?.roles?.name],
  );

  const Icon = config.icon;

  // Cargar métricas y citas
  useEffect(() => {
    fetchAllMetrics(dateRange);
  }, [dateRange, fetchAllMetrics]);

  useEffect(() => {
    fetchAppointments({ status: filter });
  }, [filter, fetchAppointments]);

  // Cargar disponibilidad cuando se abre el modal
  const loadAvailability = useCallback(async () => {
    const data = await fetchAvailability();
    setAvailabilityData(data);
  }, [fetchAvailability]);

  // Handle availability modal open
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

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  // REPROGRAMAR
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

  // OBSERVACIONES
  const handleObservations = (appointment) => {
    setShowObservations(appointment);
    setObservationsData(appointment.observations || "");
  };

  const saveObservations = async () => {
    setIsUpdating(true);
    const result = await addObservations(
      showObservations.id,
      observationsData,
    );
    setIsUpdating(false);
    if (result.success) {
      setShowObservations(null);
      fetchAppointments({ status: filter });
    }
  };

  // DISPONIBILIDAD
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

  // HISTORIAL
  const handleShowHistory = async () => {
    await fetchHistory();
    setShowHistory(true);
  };

  return (
    <div className="dependency-dashboard">
      {/* HEADER CON IDENTIDAD DE LA DEPENDENCIA */}
      <header
        className="dependency-header"
        style={{ borderLeft: `4px solid ${config.color}` }}
      >
        <div className="dependency-icon" style={{ background: config.color }}>
          <Icon size={24} />
        </div>
        <div className="dependency-info" style={{ flex: 1 }}>
          <h1>{config.name}</h1>
          <p>{config.description}</p>
        </div>
        <div className="header-actions">
          <button onClick={handleShowHistory} className="btn-secondary">
            <History size={18} />
            {config.historyLabel}
          </button>
          <button
            onClick={handleOpenAvailability}
            className="btn-secondary"
          >
            <Clock size={18} />
            {config.availabilityLabel}
          </button>
          <button
            onClick={() => fetchAllMetrics(dateRange)}
            className="btn-secondary"
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
          <button
            onClick={() => exportToCSV(dateRange)}
            className="btn-primary"
          >
            <Download size={18} />
            Exportar CSV
          </button>
        </div>
      </header>

      {/* FILTRO DE FECHAS */}
      <div className="date-filter">
        <Calendar size={18} />
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => handleDateChange("from", e.target.value)}
        />
        <span>hasta</span>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => handleDateChange("to", e.target.value)}
        />
      </div>

      {/* KPIs */}
      {metricsLoading && !kpis ? (
        <LoadingSpinner message="Cargando métricas..." />
      ) : kpis ? (
        <section className="kpi-grid">
          <KPICard
            title="Total Citas"
            value={kpis.total_appointments}
            color="#3b82f6"
            subtitle="En periodo seleccionado"
          />
          <KPICard
            title="Tasa de Cumplimiento"
            value={`${kpis.total_appointments > 0 ? Math.round((kpis.completed_appointments / kpis.total_appointments) * 100) : 0}%`}
            color="#22c55e"
            subtitle={`${kpis.completed_appointments} completadas`}
          />
          <KPICard
            title="Tiempo Promedio Espera"
            value={`${Math.round(kpis.avg_wait_days || 0)} días`}
            color="#f59e0b"
            subtitle="Desde solicitud a atención"
          />
          <KPICard
            title="No Asistencias"
            value={kpis.no_show_count}
            color="#ef4444"
            subtitle={`${kpis.total_appointments > 0 ? Math.round((kpis.no_show_count / kpis.total_appointments) * 100) : 0}% del total`}
          />
        </section>
      ) : null}

      {/* GRÁFICAS */}
      <section className="charts-grid">
        <DependencyChart data={byDependency} />
        <MonthlyTrendChart data={monthlyTrend} />
      </section>

      {/* RANKING DE PROFESIONALES */}
      <section className="professionals-section">
        <ProfessionalTable data={professionals} />
      </section>

      {/* FILTRO DE CITAS */}
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

      {/* LISTA DE CITAS */}
      <div className="appointments-grid">
        {isLoading ? (
          <LoadingSpinner message="Cargando citas..." />
        ) : appointments.length === 0 ? (
          <div className="dependency-empty-state">
            <CalendarX size={48} color="#9ca3af" />
            <p>{config.emptyStateMessage}</p>
            <span>{config.emptyStateHint}</span>
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
                    {config.addObservationsLabel}
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
                    {config.addObservationsLabel}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* MODAL: REPROGRAMAR */}
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

      {/* MODAL: OBSERVACIONES */}
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

      {/* MODAL: DISPONIBILIDAD */}
      {showAvailability && (
        <div className="modal-overlay" onClick={() => setShowAvailability(false)}>
          <div
            className="modal-content modal-availability"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <Clock size={20} />
                Gestionar Disponibilidad
              </h3>
              <button onClick={() => setShowAvailability(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Configura tu horario de atención para cada día de la semana.
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

      {/* MODAL: HISTORIAL */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div
            className="modal-content modal-history"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <History size={20} />
                Historial de Atención
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
                            {apt.observations
                              ? apt.observations.substring(0, 50) +
                                (apt.observations.length > 50 ? "..." : "")
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
