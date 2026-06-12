import { useState, useCallback } from "react";
import { DashboardRepository } from "../../features/dashboard/api/dashboard.repository";
import { toast } from "sonner";
import { startOfMonth, endOfMonth, format } from "date-fns";

export function useDashboard() {
    const [kpis, setKpis] = useState(null);
    const [byDependency, setByDependency] = useState([]);
    const [monthlyTrend, setMonthlyTrend] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(false);

    const getDefaultDateRange = () => ({
        from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
        to: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    });

    const fetchAllMetrics = useCallback(async(customRange = null) => {
        setLoading(true);
        const range = customRange || getDefaultDateRange();

        try {
            const [KpisData, depData, trendData, profData] = await Promise.all([
                DashboardRepository.getKPIs(range),
                DashboardRepository.getAppointmentsByDependency(range),
                DashboardRepository.getMonthlyTrend(new Date().getFullYear()),
                DashboardRepository.getProfessionalPerformance(range),
            ]);
            setKpis(KpisData[0]); // la funcion retorna array con un objeto
            setByDependency(depData);
            setMonthlyTrend(trendData);
            setProfessionals(profData);
        }catch (err){
            toast.error("Error cargando métricas");
            console.error(err);
        }finally {
            setLoading(false);
        }
    }, []);

    const exportToCSV = async (range = null) => {
        try {
            const data = await DashboardRepository.getRawDataForExport(
                range || getDefaultDateRange(),
            );

            //tranformar a formato plano para excel
            const flatData = data.map((row) =>({
                ID: row.id,
                Fecha_Cita: row.scheduled_date,
                Hora: row.scheduled_time,
                Dependencia: row.dependencies?.name,
                Aprendiz: row.aprendiz?.full_name,
                Documento: row.aprendiz?.document_number,
                Profesional: row.professional?.full_name || "sin asignar",
                Estado: row.status,
                Motivo: row.reason,
                Notas: row.notes,
                Fecha_Creacion: row.created_at,
            }));

            if (flatData.length === 0) {
                toast.warning("No hay datos para exportar en este rango");
                return;
            }

            // Crear CSV
            const headers = Object.keys(flatData[0]);
            const csv = [
                headers.join(","),
                ...flatData.map((row) => 
                headers.map((h) => `"${row[h] || ""}"`).join(","),
                )                    
            ].join("\n");

            // Descargar
            const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `reporte_bienestar_${format(new Date(), "yyyy-MM-dd")}.csv`;
            link.click();

            toast.success("Reporte descargado");
        }catch {
            toast.error("Error exportando datos");
        }
    };
    return {
        kpis,
        byDependency,
        monthlyTrend,
        professionals,
        loading,
        fetchAllMetrics,
        exportToCSV,
    };
}