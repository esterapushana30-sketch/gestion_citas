import { useState, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../providers/AuthProvider";
import { toast } from "sonner";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  UPDATING: "updating",
};

export function useProfessional() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState(null);

  // FETCH: Obtener citas del profesional
  const fetchAppointments = useCallback(async (filters = {}) => {
    setStatus(STATUS.LOADING);
    setError(null);

    try {
      let query = supabase
        .from("appointments")
        .select(`
          *,
          dependencies (name, color),
          profiles!user_id (full_name, document_number, email, phone)
        `)
        .order("scheduled_date", { ascending: true })
        .order("scheduled_time", { ascending: true });

      if (filters.status) query = query.eq("status", filters.status);
      if (filters.date) query = query.eq("scheduled_date", filters.date);

      const { data, error } = await query;
      if (error) throw error;

      setAppointments(data || []);
      return data || [];
    } catch (err) {
      setError(err.message);
      toast.error("Error cargando citas");
      return [];
    } finally {
      setStatus(STATUS.IDLE);
    }
  }, []);

  // FETCH HISTORY: Obtener historial de atención
  const fetchHistory = useCallback(async () => {
    setStatus(STATUS.LOADING);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          dependencies (name, color),
          profiles!user_id (full_name, document_number, email)
        `)
        .in("status", ["completed", "cancelled", "no_show"])
        .order("scheduled_date", { ascending: false });

      if (error) throw error;

      setHistory(data || []);
      return data || [];
    } catch (err) {
      setError(err.message);
      toast.error("Error cargando historial");
      return [];
    } finally {
      setStatus(STATUS.IDLE);
    }
  }, []);

  // CONFIRM: Confirmar cita
  const confirmAppointment = async (appointmentId) => {
    setStatus(STATUS.UPDATING);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "confirmed", updated_at: new Date().toISOString() })
        .eq("id", appointmentId);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "confirmed" } : apt,
        ),
      );

      toast.success("Cita confirmada");
      return { success: true };
    } catch (err) {
      toast.error("Error confirmando cita");
      return { success: false, error: err.message };
    } finally {
      setStatus(STATUS.IDLE);
    }
  };

  // COMPLETE: Completar cita
  const completeAppointment = async (appointmentId, notes = "") => {
    setStatus(STATUS.UPDATING);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "completed",
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? { ...apt, status: "completed", notes }
            : apt,
        ),
      );

      toast.success("Cita completada");
      return { success: true };
    } catch (err) {
      toast.error("Error completando cita");
      return { success: false, error: err.message };
    } finally {
      setStatus(STATUS.IDLE);
    }
  };

  // CANCEL: Cancelar cita
  const cancelAppointment = async (appointmentId, reason = "") => {
    setStatus(STATUS.UPDATING);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "cancelled",
          notes: reason,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? { ...apt, status: "cancelled", notes: reason }
            : apt,
        ),
      );

      toast.success("Cita cancelada");
      return { success: true };
    } catch (err) {
      toast.error("Error cancelando cita");
      return { success: false, error: err.message };
    } finally {
      setStatus(STATUS.IDLE);
    }
  };

  // RESCHEDULE: Reprogramar cita
  const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
    setStatus(STATUS.UPDATING);
    try {
      // Verificar disponibilidad
      const { data: existing } = await supabase
        .from("appointments")
        .select("id")
        .eq("scheduled_date", newDate)
        .eq("scheduled_time", newTime)
        .in("status", ["pending", "confirmed"])
        .neq("id", appointmentId);

      if (existing && existing.length > 0) {
        throw new Error("Ese horario ya está ocupado");
      }

      const { error } = await supabase
        .from("appointments")
        .update({
          scheduled_date: newDate,
          scheduled_time: newTime,
          status: "rescheduled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? {
                ...apt,
                scheduled_date: newDate,
                scheduled_time: newTime,
                status: "rescheduled",
              }
            : apt,
        ),
      );

      toast.success("Cita reprogramada");
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Error reprogramando cita");
      return { success: false, error: err.message };
    } finally {
      setStatus(STATUS.IDLE);
    }
  };

  // ADD OBSERVATIONS: Agregar observaciones
  const addObservations = async (appointmentId, observations) => {
    setStatus(STATUS.UPDATING);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          observations,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, observations } : apt,
        ),
      );

      toast.success("Observaciones guardadas");
      return { success: true };
    } catch (err) {
      toast.error("Error guardando observaciones");
      return { success: false, error: err.message };
    } finally {
      setStatus(STATUS.IDLE);
    }
  };

  // FETCH AVAILABILITY: Obtener disponibilidad del profesional actual
  const fetchAvailability = useCallback(async () => {
    setStatus(STATUS.LOADING);
    try {
      if (!user?.id) throw new Error("No hay usuario autenticado");

      const { data, error } = await supabase
        .from("professional_availability")
        .select("*")
        .eq("professional_id", user.id)
        .order("day_of_week", { ascending: true });

      if (error) throw error;
      setAvailability(data || []);
      return data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setStatus(STATUS.IDLE);
    }
  }, [user?.id]);

  // UPDATE AVAILABILITY: Actualizar disponibilidad
  const updateAvailability = async (dayOfWeek, startTime, endTime, isAvailable) => {
    setStatus(STATUS.UPDATING);
    try {
      if (!user?.id) throw new Error("No hay usuario autenticado");

      const { error } = await supabase
        .from("professional_availability")
        .upsert(
          {
            professional_id: user.id,
            day_of_week: dayOfWeek,
            start_time: startTime,
            end_time: endTime,
            is_available: isAvailable,
          },
          { onConflict: "professional_id,day_of_week,start_time" },
        );

      if (error) throw error;

      toast.success("Disponibilidad actualizada");
      fetchAvailability();
      return { success: true };
    } catch (err) {
      toast.error("Error actualizando disponibilidad");
      return { success: false, error: err.message };
    } finally {
      setStatus(STATUS.IDLE);
    }
  };

  return {
    appointments,
    availability,
    history,
    status,
    error,
    isLoading: status === STATUS.LOADING,
    isUpdating: status === STATUS.UPDATING,
    fetchAppointments,
    fetchHistory,
    confirmAppointment,
    completeAppointment,
    cancelAppointment,
    rescheduleAppointment,
    addObservations,
    fetchAvailability,
    updateAvailability,
  };
}
