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

// Agregaciones complejas con PostgreSQL
export class DashboardRepository {
    // KPI: Conteos generales
    static async getKPIs (dateRange) {
        const { data, error} = await supabase.rpc("get_dashboard_kpis", {
            start_date: dateRange.from,
            end_date: dateRange.to,
        });

        if (error) throw new Error(`Error KPIs: ${error.message}`);
        return data;
    }

    //Citas por dependencia (para graficos de barras)
    static async getAppointmentsByDependency(dateRange) {
        const { data, error } = await supabase
        .from("appointments")
        .select(
            `
            dependency_id,
            dependencies (name, color),
            status
            `,
        )
        .gte("scheduled_date", dateRange.from)
        .lte("scheduled_date", dateRange.to);

        if (error) throw error;

        // Transformacion en fronted (podria ser SQL tambien)
        const grouped = data.reduce((acc, curr) => {
            const depName = curr.dependencies.name;
            const color = curr.dependencies.color;

            if (!acc[depName]){
                acc[depName] = {
                    name: depName,
                    color,
                    total: 0,
                    completed: 0,
                    cancelled: 0,
                };    
            }

            acc[depName].total++;
            if (curr.status === "completed") acc[depName].completed++;
            if (curr.status === "cancelled") acc[depName].cancelled++;

            return acc;
        }, {});

        return Object.values(grouped);
    }

    //Evolucion mensual (linea de tiempo)
    static async getMonthlyTrend(year) {
        const { data, error} = await supabase.rpc("get_monthly_appointments", {
            year_param: year,
        });

        if (error) throw error;
        return data; // [{ month: `Ene`, total: 45, completed. 38}, ...]
    }
    // Ranking de profesionales
    static async getProfessionalPerformance(dateRange) {
        const { data, error } = await supabase
        .from("appointments")
        .select("professional_id, status, scheduled_date")
        .not("professional_id", "is", null)
        .gte("scheduled_date", dateRange.from)
        .lte("scheduled_date", dateRange.to);

        if (error) throw error;

        // Enriquecer con nombres de profesionales
        const profIds = data.map((d) => d.professional_id).filter(Boolean);
        const profilesMap = await fetchProfiles(profIds);

        const grouped = data.reduce((acc, curr) => {
            const profId = curr.professional_id;
            const name = profilesMap[profId]?.full_name || "sin asignar"

            if (!acc[profId]) {
                acc[profId] =  {
                    id: profId,
                    name,
                    total: 0,
                    completed: 0,
                    avgResponseTime: 0,
                };
            }

            acc[profId].total++;
            if (curr.status === "completed") acc[profId].completed++;

            return acc;
        }, {});

        return Object.values(grouped)
        .sort((a, b) => b.completed - a.completed)
        .slice(0, 10);
    }

    // Datos crudos para exportar a excel
    static async getRawDataForExport(dateRange) {
        const { data, error } = await supabase
        .from("appointments")
        .select("*, dependencies (name)")
        .gte("scheduled_date", dateRange.from)
        .lte("scheduled_date", dateRange.to)
        .order("scheduled_date", { ascending: false});

        if (error) throw error;

        // Enriquecer con profiles
        const profileIds = data.flatMap((d) => [d.user_id, d.professional_id]).filter(Boolean);
        const profilesMap = await fetchProfiles(profileIds);

        return data.map((d) => ({
            ...d,
            aprendiz: profilesMap[d.user_id] || null,
            professional: profilesMap[d.professional_id] || null,
        }));
    }
}
