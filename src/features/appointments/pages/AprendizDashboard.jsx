import { useEffect, useState } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { AppointmentForm } from "../components/AppointmentForm";
import { AppointmentCard } from "../components/AppointmentCard";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { Plus, CalendarX } from "lucide-react";

const FILTER_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "completed", label: "Completadas" },
  { value: "cancelled", label: "Canceladas" },
];

export default function AprendizDashboard() {
  const { appointments, fetchAppointments, cancelAppointment, isLoading } =
    useAppointments();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const filters = filter ? { status: filter } : {};
    fetchAppointments(filters);
  }, [filter, fetchAppointments]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Mis Citas de Bienestar</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={20} />
          Nueva Cita
        </button>
      </header>

      <div className="filter-tabs">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={filter === opt.value ? "active" : ""}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Solicitar Nueva Cita</h2>
            <AppointmentForm
              onSuccess={() => {
                setShowForm(false);
                fetchAppointments(filter ? { status: filter } : {});
              }}
            />
          </div>
        </div>
      )}

      <section className="appointments-list">
        {isLoading ? (
          <LoadingSpinner message="Cargando tus citas..." />
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <CalendarX size={48} color="#9ca3af" />
            <p>
              {filter
                ? `No tienes citas ${FILTER_OPTIONS.find((o) => o.value === filter)?.label?.toLowerCase()}`
                : "No tienes citas agendadas"}
            </p>
            {!filter && (
              <button onClick={() => setShowForm(true)} className="btn-link">
                Agenda tu primera cita aquí
              </button>
            )}
          </div>
        ) : (
          appointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              showCancelButton={apt.status === "pending"}
              onCancel={() => cancelAppointment(apt.id)}
            />
          ))
        )}
      </section>
    </div>
  );
}
