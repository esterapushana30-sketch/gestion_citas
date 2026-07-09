import { useEffect, useState } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { AppointmentForm } from "../components/AppointmentForm";
import { AppointmentCard } from "../components/AppointmentCard";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import {
  Plus,
  CalendarX,
  Calendar,
  Filter,
  Sparkles,
} from "lucide-react";

const FILTER_OPTIONS = [
  { value: "", label: "Todas", icon: Calendar },
  { value: "pending", label: "Pendientes", icon: null },
  { value: "confirmed", label: "Confirmadas", icon: null },
  { value: "completed", label: "Completadas", icon: null },
  { value: "cancelled", label: "Canceladas", icon: null },
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

  const activeFilterLabel =
    FILTER_OPTIONS.find((o) => o.value === filter)?.label || " Todas";

  return (
    <div className="aprendiz-dashboard">
      {/* Header mejorado */}
      <header className="aprendiz-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Mis Citas de Bienestar</h1>
            <p className="header-subtitle">
              {appointments.length > 0
                ? `Tienes ${appointments.length} ${
                    appointments.length === 1 ? "cita" : "citas"
                  } registrada${appointments.length === 1 ? "" : "s"}`
                : "Agenda tu primera cita de bienestar"}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-new-appointment"
          >
            <Plus size={20} />
            <span>Nueva Cita</span>
          </button>
        </div>
      </header>

      {/* Filtros mejorados */}
      <div className="filters-section">
        <div className="filters-wrapper">
          <Filter size={16} className="filter-icon" />
          <div className="filter-tabs">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`filter-tab ${filter === opt.value ? "active" : ""}`}
                onClick={() => setFilter(opt.value)}
              >
                {opt.label}
                {filter === opt.value && (
                  <span className="active-indicator" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de nueva cita */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Solicitar Nueva Cita</h2>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <AppointmentForm
              onSuccess={() => {
                setShowForm(false);
                fetchAppointments(filter ? { status: filter } : {});
              }}
            />
          </div>
        </div>
      )}

      {/* Lista de citas */}
      <section className="appointments-section">
        {isLoading ? (
          <LoadingSpinner message="Cargando tus citas..." />
        ) : appointments.length === 0 ? (
          <div className="empty-appointments">
            <div className="empty-icon-wrapper">
              <CalendarX size={56} strokeWidth={1.5} />
            </div>
            <h3>No hay citas {activeFilterLabel.toLowerCase()}</h3>
            <p>
              {filter
                ? "No encontramos citas con este estado. Intenta con otro filtro."
                : "Comienza agendando tu primera cita de bienestar."}
            </p>
            {!filter && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-cta"
              >
                <Sparkles size={18} />
                Agendar mi primera cita
              </button>
            )}
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                showCancelButton={apt.status === "pending"}
                onCancel={() => cancelAppointment(apt.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
