import { useEffect, useState } from "react";
import { useDashboard } from "../../../shared/hooks/useDashboard";
import { KPICard } from "../components/KPICard";
import { DependencyChart } from "../components/DependencyChart";
import { MonthlyTrendChart } from "../components/MonthlyTrendChart";
import { ProfessionalTable } from "../components/ProfessionalTable";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { Download, RefreshCw, Calendar } from "lucide-react";
import { format, subMonths } from "date-fns";

export default function CoordinationDashboard() {
  const {
    kpis,
    byDependency,
    monthlyTrend,
    professionals,
    loading,
    fetchAllMetrics,
    exportToCSV,
  } = useDashboard();

  const [dateRange, setDateRange] = useState({
    from: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(()=> {
    fetchAllMetrics(dateRange);
  }, [dateRange, fetchAllMetrics]);

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value}));
  };

  if (loading && !kpis) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }
  
  return (
    <div className="coordination-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Panel de Coordinación</h1>
          <p>Vista general del bienestar institucional</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => fetchAllMetrics(dateRange)}
            className="btn-secondary"
          >
            <RefreshCw size={18}/>
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

      {kpis && (
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
      )}

      <section className="charts-grid">
        <DependencyChart data={byDependency} />
        <MonthlyTrendChart data={monthlyTrend}/>
      </section>

      <section className="professionals-section">
        <ProfessionalTable data={professionals} />
      </section>
    </div>
  );
}
