import { supabase } from "../../../lib/supabase";

// Helper: Obtener profiles por IDs
async function fetchProfiles(ids) {
  if (!ids.length) return {};
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (!uniqueIds.length) return {};

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, document_number")
    .in("id", uniqueIds);

  if (error) throw error;
  return (data || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
}

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
  // CREATE: Crear nueva cita
  static async create(appointmentData) {
    const { data, error } = await supabase
      .from("appointments")
      .insert([appointmentData])
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
}
