import { useEffect, useState, useCallback } from "react";
import { useDashboard } from "../../../shared/hooks/useDashboard";
import { DonutChart } from "../components/DonutChart";
import { DependencyProgress } from "../components/DependencyProgress";
import { QuickActions } from "../components/QuickActions";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import {
  Calendar,
  Building2,
  CalendarPlus,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format, subMonths } from "date-fns";
import { supabase } from "../../../lib/supabase";

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
  const [dependencies, setDependencies] = useState([]);
  const [selectedDependency, setSelectedDependency] = useState("");
  const [showDepFilter, setShowDepFilter] = useState(false);

  useEffect(() => {
    async function loadDependencies() {
      const { data } = await supabase.from("dependencies").select("*");
      setDependencies(data || []);
    }
    loadDependencies();
  }, []);

  useEffect(() => {
    fetchAllMetrics(dateRange);
  }, [dateRange, fetchAllMetrics]);

  const handleDateChange = useCallback((field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleDependencyChange = useCallback((depId) => {
    setSelectedDependency(depId);
    setShowDepFilter(false);
  }, []);

  if (loading && !kpis) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  const totalAppointments = kpis?.total_appointments || 0;
  const completedAppointments = kpis?.completed_appointments || 0;
  const pendingAppointments =
    kpis?.pending_appointments ||
    totalAppointments - completedAppointments;
  const cancelledAppointments = kpis?.cancelled_appointments || 0;

  const completionRate =
    totalAppointments > 0
      ? Math.round((completedAppointments / totalAppointments) * 100)
      : 0;

  const selectedDepName = selectedDependency
    ? dependencies.find((d) => d.id === selectedDependency)?.name || "Filtrada"
    : "Todas";

  // Obtener saludo según hora
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="coord-dashboard">
      {/* Header con gradiente */}
      <header className="coord-header">
        <div className="coord-header-content">
          <div className="coord-header-text">
            <span className="coord-greeting">{greeting} 👋</span>
            <h1>Coordinación de Bienestar</h1>
            <p className="coord-subtitle">
              Panel de control y métricas del centro
            </p>
          </div>
          <div className="coord-header-date">
            <Calendar size={16} />
            <span>
              {format(new Date(dateRange.from), "dd MMM")} -{" "}
              {format(new Date(dateRange.to), "dd MMM yyyy")}
            </span>
          </div>
        </div>

        {/* Filtros */}
        <div className="coord-filters">
          <div className="coord-date-filter-row">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => handleDateChange("from", e.target.value)}
              className="coord-date-input"
            />
            <span className="coord-date-sep">hasta</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => handleDateChange("to", e.target.value)}
              className="coord-date-input"
            />
          </div>
          <div className="coord-dep-filter">
            <button
              className="coord-dep-btn"
              onClick={() => setShowDepFilter(!showDepFilter)}
            >
              <Building2 size={16} />
              <span>{selectedDepName}</span>
            </button>
            {showDepFilter && (
              <div className="coord-dep-dropdown">
                <button
                  className={`coord-dep-option ${!selectedDependency ? "active" : ""}`}
                  onClick={() => handleDependencyChange("")}
                >
                  Todas
                </button>
                {dependencies.map((dep) => (
                  <button
                    key={dep.id}
                    className={`coord-dep-option ${selectedDependency === dep.id ? "active" : ""}`}
                    onClick={() => handleDependencyChange(dep.id)}
                  >
                    <span
                      className="coord-dep-dot"
                      style={{ background: dep.color }}
                    />
                    {dep.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="coord-content">
        {/* Tarjeta de cumplimiento - Hero Card */}
        <div className="coord-hero-card">
          <div className="coord-hero-left">
            <div className="coord-hero-icon">
              <CheckCircle size={28} />
            </div>
            <div className="coord-hero-info">
              <span className="coord-hero-label">Tasa de Cumplimiento</span>
              <span className="coord-hero-value">{completionRate}%</span>
              <div className="coord-hero-bar">
                <div
                  className="coord-hero-bar-fill"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
          <div className="coord-hero-right">
            <DonutChart
              completed={completedAppointments}
              total={totalAppointments}
              size={120}
            />
          </div>
        </div>

        {/* Grid de estadísticas */}
        <div className="coord-stats-grid">
          <div className="coord-stat-card stat-green">
            <div className="coord-stat-icon">
              <CalendarPlus size={20} />
            </div>
            <div className="coord-stat-content">
              <span className="coord-stat-value">{totalAppointments}</span>
              <span className="coord-stat-label">Total Citas</span>
            </div>
          </div>

          <div className="coord-stat-card stat-amber">
            <div className="coord-stat-icon">
              <Clock size={20} />
            </div>
            <div className="coord-stat-content">
              <span className="coord-stat-value">{pendingAppointments}</span>
              <span className="coord-stat-label">Pendientes</span>
            </div>
          </div>

          <div className="coord-stat-card stat-emerald">
            <div className="coord-stat-icon">
              <CheckCircle size={20} />
            </div>
            <div className="coord-stat-content">
              <span className="coord-stat-value">{completedAppointments}</span>
              <span className="coord-stat-label">Completadas</span>
            </div>
          </div>

          <div className="coord-stat-card stat-red">
            <div className="coord-stat-icon">
              <AlertCircle size={20} />
            </div>
            <div className="coord-stat-content">
              <span className="coord-stat-value">{cancelledAppointments}</span>
              <span className="coord-stat-label">Canceladas</span>
            </div>
          </div>
        </div>

        {/* Gráfico de tendencia */}
        <div className="coord-chart-card">
          <div className="coord-chart-header">
            <div className="coord-chart-title">
              <BarChart3 size={18} color="#22c55e" />
              <h3>Tendencia mensual</h3>
            </div>
            <span className="coord-chart-period">
              Últimos {monthlyTrend?.length || 0} meses
            </span>
          </div>
          <div className="coord-chart-body">
            {monthlyTrend && monthlyTrend.length > 0 ? (
              <div className="coord-bars">
                {monthlyTrend.slice(-6).map((item, index) => {
                  const maxValue = Math.max(
                    ...monthlyTrend.map((m) => m.total || 0),
                  );
                  const height =
                    maxValue > 0
                      ? ((item.total || 0) / maxValue) * 100
                      : 0;
                  const completedHeight =
                    maxValue > 0
                      ? ((item.completed || 0) / maxValue) * 100
                      : 0;
                  return (
                    <div key={index} className="coord-bar-col">
                      <div className="coord-bar-values">
                        <span className="coord-bar-total">{item.total || 0}</span>
                      </div>
                      <div className="coord-bar-stack">
                        <div
                          className="coord-bar-bg"
                          style={{ height: `${height}%` }}
                        />
                        <div
                          className="coord-bar-fill"
                          style={{ height: `${completedHeight}%` }}
                        />
                      </div>
                      <span className="coord-bar-label">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state-small">
                <BarChart3 size={32} />
                <p>Sin datos de tendencia</p>
              </div>
            )}
          </div>
          {/* Leyenda */}
          {monthlyTrend && monthlyTrend.length > 0 && (
            <div className="coord-chart-legend">
              <span className="legend-item">
                <span className="legend-dot" style={{ background: "#86efac" }} />
                Total
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{ background: "#22c55e" }} />
                Completadas
              </span>
            </div>
          )}
        </div>

        {/* Progreso por dependencia */}
        <DependencyProgress data={byDependency} />

        {/* Quick Actions */}
        <QuickActions
          professionals={professionals}
          onExportCSV={() => exportToCSV(dateRange)}
        />
      </main>
    </div>
  );
}
