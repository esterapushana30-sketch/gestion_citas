import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "../validations/appointment.schema";
import { useAppointments } from "../hooks/useAppointments";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { AppointmentRepository } from "../api/appointments.repository";
import { CheckCircle, XCircle, Hash, BookOpen } from "lucide-react";

export function AppointmentForm({ onSuccess }) {
  const { createAppointment, isCreating } = useAppointments();
  const [dependencies, setDependencies] = useState([]);
  const [depsError, setDepsError] = useState(null);
  const [depsLoading, setDepsLoading] = useState(true);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      dependency_id: "",
      ficha_number: "",
      programa: "",
      scheduled_date: "",
      scheduled_time: "08:00",
      reason: "",
    },
  });

  const watchedDependency = watch("dependency_id");
  const watchedDate = watch("scheduled_date");
  const watchedTime = watch("scheduled_time");

  useEffect(() => {
    async function loadDependencies() {
      try {
        setDepsLoading(true);
        setDepsError(null);
        const { data, error } = await supabase.from("dependencies").select("*");
        if (error) throw error;
        setDependencies(data || []);
      } catch (err) {
        console.error("Error cargando dependencias:", err);
        setDepsError("No se pudieron cargar las dependencias. Intenta de nuevo.");
      } finally {
        setDepsLoading(false);
      }
    }
    loadDependencies();
  }, []);

  // Check availability when dependency, date, or time changes
  useEffect(() => {
    if (!watchedDependency || !watchedDate || !watchedTime) {
      setAvailabilityStatus(null);
      return;
    }

    let cancelled = false;
    async function checkAvailability() {
      setCheckingAvailability(true);
      try {
        const result = await AppointmentRepository.checkProfessionalAvailability(
          watchedDependency,
          watchedDate,
          watchedTime,
        );
        if (!cancelled) {
          setAvailabilityStatus(result);
        }
      } catch {
        if (!cancelled) {
          setAvailabilityStatus(null);
        }
      } finally {
        if (!cancelled) {
          setCheckingAvailability(false);
        }
      }
    }

    // Debounce the check
    const timeout = setTimeout(checkAvailability, 500);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [watchedDependency, watchedDate, watchedTime]);

  const onSubmit = async (data) => {
    const result = await createAppointment(data);
    if (result.success) {
      onSuccess?.();
    }
  };

  if (depsError) {
    return (
      <div className="appointment-form">
        <div className="auth-error">{depsError}</div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="appointment-form">
      {/* Ficha y Programa */}
      <div className="field-row">
        <div className="field">
          <label htmlFor="ficha_number">
            <Hash size={14} />
            Número de Ficha
          </label>
          <input
            id="ficha_number"
            type="text"
            {...register("ficha_number")}
            placeholder="Ej: 2458765"
          />
          {errors.ficha_number && (
            <span className="error">{errors.ficha_number.message}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="programa">
            <BookOpen size={14} />
            Programa de Formación
          </label>
          <input
            id="programa"
            type="text"
            {...register("programa")}
            placeholder="Ej: Tecnología en Desarrollo de Software"
          />
          {errors.programa && (
            <span className="error">{errors.programa.message}</span>
          )}
        </div>
      </div>

      {/* Dependencia */}
      <div className="field">
        <label>Dependencia</label>
        {depsLoading ? (
          <span className="dependency-loading">Cargando dependencias...</span>
        ) : (
          <select {...register("dependency_id")}>
            <option value="">Selecciona una dependencia...</option>
            {dependencies.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        )}
        {errors.dependency_id && (
          <span className="error">{errors.dependency_id.message}</span>
        )}
      </div>

      {/* Fecha y Hora */}
      <div className="field-row">
        <div className="field">
          <label>Fecha</label>
          <input type="date" {...register("scheduled_date")} />
          {errors.scheduled_date && (
            <span className="error">{errors.scheduled_date.message}</span>
          )}
        </div>

        <div className="field">
          <label>Hora</label>
          <select {...register("scheduled_time")}>
            {Array.from({ length: 9 }, (_, i) => {
              const hour = (8 + i).toString().padStart(2, "0");
              return (
                <option key={hour} value={`${hour}:00`}>
                  {hour}:00
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Availability indicator */}
      {watchedDependency && watchedDate && watchedTime && (
        <div className="availability-indicator">
          {checkingAvailability ? (
            <span className="checking">Verificando disponibilidad...</span>
          ) : availabilityStatus?.available ? (
            <span className="available">
              <CheckCircle size={16} />
              {availabilityStatus.professionalCount} profesional(es) disponible(s)
            </span>
          ) : availabilityStatus && !availabilityStatus.available ? (
            <span className="unavailable">
              <XCircle size={16} />
              No hay profesionales disponibles en este horario
            </span>
          ) : null}
        </div>
      )}

      {/* Motivo */}
      <div className="field">
        <label htmlFor="reason">Motivo de consulta</label>
        <textarea
          id="reason"
          {...register("reason")}
          rows="4"
          placeholder="Describe brevemente por qué necesitas la cita..."
        />
        {errors.reason && (
          <span className="error">{errors.reason.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isCreating || depsLoading || availabilityStatus?.available === false}
        className="btn-primary"
      >
        {isCreating ? "Agendando..." : "Solicitar Cita"}
      </button>
    </form>
  );
}
