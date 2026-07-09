import { supabase } from "../../../lib/supabase";
import { fetchProfiles } from "../../../shared/utils/api";

// Helper: Enriquecer citas con datos de profiles
async function enrichAppointments(appointments) {
  const profileIds = appointments.flatMap((apt) => [
    apt.user_id,
    apt.professional_id,
  ]).filter(Boolean);

  if (!profileIds.length) return appointments;

  const profilesMap = await fetchProfiles(profileIds);

  return appointments.map((apt) => ({
    ...apt,
    profiles: profilesMap[apt.user_id] || null,
    professional: profilesMap[apt.professional_id] || null,
  }));
}

// CLASE Repository: encapsula todo el acceso a datos de citas
// Principio SOLID: Dependency Inversion (dependemos de abstracciones)
export class AppointmentRepository {
  // CREATE: Crear nueva cita (con auto-asignación de profesional)
  static async create(appointmentData) {
    const { dependency_id, scheduled_date, scheduled_time } = appointmentData;
    let professional_id = appointmentData.professional_id || null;

    // Auto-asignar profesional si no se especifica uno
    if (!professional_id && dependency_id && scheduled_date && scheduled_time) {
      const available = await AppointmentRepository.getAvailableProfessionals(
        dependency_id,
        scheduled_date,
        scheduled_time,
      );
      if (available.length > 0) {
        // Asignar el primero disponible
        professional_id = available[0].id;
      }
    }

    const { data, error } = await supabase
      .from("appointments")
      .insert([{ ...appointmentData, professional_id }])
      .select("*, dependencies (name, color)")
      .single();

    if (error) throw new Error(`Error creando cita: ${error.message}`);

    // Enriquecer con profiles
    const [enriched] = await enrichAppointments([data]);
    return enriched;
  }

  // READ: Obtener citas según filtros (RLS se encarga de seguridad)
  static async fetch({ userId, dependencyId, status, dateFrom, dateTo }) {
    let query = supabase
      .from("appointments")
      .select("*, dependencies (name, color)");

    // Filtros dinámicos
    if (userId) query = query.eq("user_id", userId);
    if (dependencyId) query = query.eq("dependency_id", dependencyId);
    if (status) query = query.eq("status", status);
    if (dateFrom) query = query.gte("scheduled_date", dateFrom);
    if (dateTo) query = query.lte("scheduled_date", dateTo);

    // Ordenar por fecha y hora
    query = query
      .order("scheduled_date", { ascending: true })
      .order("scheduled_time", { ascending: true });

    const { data, error } = await query;
    if (error) throw new Error(`Error fetching citas: ${error.message}`);

    // Enriquecer con profiles
    return enrichAppointments(data || []);
  }

  // UPDATE: Actualizar estado o notas
  static async update(id, updates) {
    const { data, error } = await supabase
      .from("appointments")
      .update({ ...updates, updated_at: new Date() })
      .eq("id", id)
      .select("*, dependencies (name, color)")
      .single();

    if (error) throw new Error(`Error actualizando cita: ${error.message}`);

    const [enriched] = await enrichAppointments([data]);
    return enriched;
  }

  // CHECK AVAILABILITY: Verificar si horario está libre
  static async checkAvailability(dependencyId, date, time, excludeId = null) {
    let query = supabase
      .from("appointments")
      .select("id")
      .eq("dependency_id", dependencyId)
      .eq("scheduled_date", date)
      .eq("scheduled_time", time)
      .in("status", ["pending", "confirmed"]);

    if (excludeId) query = query.neq("id", excludeId);

    const { data, error } = await query;
    if (error) throw error;
    return data.length === 0; // true = disponible
  }

  // COUNT PENDING: Contar citas pendientes de un usuario (límite de 2)
  static async countPending(userId) {
    const { count, error } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "pending");

    if (error) throw error;
    return count;
  }

  // CHECK PROFESSIONAL AVAILABILITY: Verificar si hay profesional disponible
  // Retorna true si al menos un profesional de la dependencia está disponible
  static async checkProfessionalAvailability(dependencyId, date, time) {
    // Obtener profesionales de la dependencia
    const { data: professionals, error: profError } = await supabase
      .from("profiles")
      .select("id")
      .eq("dependency_id", dependencyId)
      .eq("is_active", true)
      .not("role_id", "is", null);

    if (profError) throw profError;
    if (!professionals || professionals.length === 0) return { available: false, professionals: [] };

    const profIds = professionals.map((p) => p.id);

    // Obtener profesionales que ya tienen citas en ese horario
    const { data: busyProfessionals, error: busyError } = await supabase
      .from("appointments")
      .select("professional_id")
      .eq("dependency_id", dependencyId)
      .eq("scheduled_date", date)
      .eq("scheduled_time", time)
      .in("status", ["pending", "confirmed"])
      .in("professional_id", profIds);

    if (busyError) throw busyError;

    const busyIds = new Set((busyProfessionals || []).map((bp) => bp.professional_id));
    const availableProfessionals = profIds.filter((id) => !busyIds.has(id));

    return {
      available: availableProfessionals.length > 0,
      professionalCount: availableProfessionals.length,
    };
  }

  // GET AVAILABLE PROFESSIONALS: Obtener profesionales disponibles para un horario
  static async getAvailableProfessionals(dependencyId, date, time) {
    const { data: professionals, error: profError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("dependency_id", dependencyId)
      .eq("is_active", true)
      .not("role_id", "is", null);

    if (profError) throw profError;
    if (!professionals || professionals.length === 0) return [];

    const profIds = professionals.map((p) => p.id);

    const { data: busyProfessionals, error: busyError } = await supabase
      .from("appointments")
      .select("professional_id")
      .eq("dependency_id", dependencyId)
      .eq("scheduled_date", date)
      .eq("scheduled_time", time)
      .in("status", ["pending", "confirmed"])
      .in("professional_id", profIds);

    if (busyError) throw busyError;

    const busyIds = new Set((busyProfessionals || []).map((bp) => bp.professional_id));
    return professionals.filter((p) => !busyIds.has(p.id));
  }
}
