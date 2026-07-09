import { useState, useEffect } from "react";
import { UserManagement } from "../components/UserManagement";
import { AuditLogViewer } from "../components/AuditLogViewer";
import { RoleManagement } from "../components/RoleManagement";
import { DependencyManagement } from "../components/DependencyManagement";
import { SystemConfig } from "../components/SystemConfig";
import { DocumentationViewer } from "../components/DocumentationViewer";
import { AppointmentsViewer } from "../components/AppointmentsViewer";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import {
  Users,
  Shield,
  Settings,
  BarChart3,
  Calendar,
  Briefcase,
  Activity,
  UserCheck,
  UserX,
  Clock,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "users", label: "Usuarios", icon: Users },
  { id: "appointments", label: "Citas", icon: Calendar },
  { id: "roles", label: "Roles", icon: Shield },
  { id: "dependencies", label: "Dependencias", icon: Briefcase },
  { id: "audit", label: "Auditoría", icon: Activity },
  { id: "config", label: "Configuración", icon: Settings },
  { id: "docs", label: "Documentación", icon: BookOpen },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [appointmentFilter, setAppointmentFilter] = useState(null);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const [
        { count: totalUsers },
        { count: activeUsers },
        { count: totalAppointments },
        { count: pendingAppointments },
        { count: completedAppointments },
        { count: cancelledAppointments },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed"),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("status", "cancelled"),
      ]);

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        inactiveUsers: (totalUsers || 0) - (activeUsers || 0),
        totalAppointments: totalAppointments || 0,
        pendingAppointments: pendingAppointments || 0,
        completedAppointments: completedAppointments || 0,
        cancelledAppointments: cancelledAppointments || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Navegar a la pestaña de citas con un filtro pre-seleccionado
  const navigateToAppointments = (statusFilter) => {
    setAppointmentFilter(statusFilter);
    setActiveTab("appointments");
  };

  // Limpiar el filtro cuando se cambia de pestaña manualmente
  const handleTabChange = (tabId) => {
    if (tabId !== "appointments") {
      setAppointmentFilter(null);
    }
    setActiveTab(tabId);
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header-new">
        <div className="admin-header-content">
          <div className="admin-header-text">
            <div className="admin-header-icon">
              <Shield size={28} />
            </div>
            <div>
              <h1>Panel de Administración</h1>
              <p>Gestión completa del sistema SENA Bienestar</p>
            </div>
          </div>
          <button
            className="admin-refresh-btn"
            onClick={fetchStats}
            disabled={loadingStats}
          >
            <RefreshCw size={16} className={loadingStats ? "spinning" : ""} />
            <span>Actualizar</span>
          </button>
        </div>
      </header>

      <nav className="admin-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="admin-content">
        {activeTab === "dashboard" && (
          <AdminStats
            stats={stats}
            loading={loadingStats}
            onNavigate={setActiveTab}
            onNavigateAppointment={navigateToAppointments}
          />
        )}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "appointments" && (
          <AppointmentsViewer initialStatus={appointmentFilter} />
        )}
        {activeTab === "roles" && <RoleManagement />}
        {activeTab === "dependencies" && <DependencyManagement />}
        {activeTab === "audit" && <AuditLogViewer />}
        {activeTab === "config" && <SystemConfig />}
        {activeTab === "docs" && <DocumentationViewer />}
      </div>
    </div>
  );
}

function AdminStats({ stats, loading, onNavigate, onNavigateAppointment }) {
  if (loading) {
    return <LoadingSpinner message="Cargando estadísticas..." />;
  }

  if (!stats) return null;

  const completionRate =
    stats.totalAppointments > 0
      ? Math.round(
          (stats.completedAppointments / stats.totalAppointments) * 100
        )
      : 0;

  return (
    <div className="admin-stats">
      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <button
          className="admin-stat-card"
          onClick={() => onNavigate("users")}
        >
          <div className="admin-stat-icon blue">
            <Users size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.totalUsers}</span>
            <span className="admin-stat-label">Total Usuarios</span>
          </div>
          <ArrowRight size={16} className="admin-stat-arrow" />
        </button>

        <button
          className="admin-stat-card"
          onClick={() => onNavigate("users")}
        >
          <div className="admin-stat-icon green">
            <UserCheck size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.activeUsers}</span>
            <span className="admin-stat-label">Activos</span>
          </div>
          <ArrowRight size={16} className="admin-stat-arrow" />
        </button>

        <button
          className="admin-stat-card"
          onClick={() => onNavigate("users")}
        >
          <div className="admin-stat-icon red">
            <UserX size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.inactiveUsers}</span>
            <span className="admin-stat-label">Inactivos</span>
          </div>
          <ArrowRight size={16} className="admin-stat-arrow" />
        </button>

        <button
          className="admin-stat-card"
          onClick={() => onNavigateAppointment(null)}
        >
          <div className="admin-stat-icon purple">
            <Calendar size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.totalAppointments}</span>
            <span className="admin-stat-label">Total Citas</span>
          </div>
          <ArrowRight size={16} className="admin-stat-arrow" />
        </button>

        <button
          className="admin-stat-card"
          onClick={() => onNavigateAppointment("pending")}
        >
          <div className="admin-stat-icon amber">
            <Clock size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">
              {stats.pendingAppointments}
            </span>
            <span className="admin-stat-label">Pendientes</span>
          </div>
          <ArrowRight size={16} className="admin-stat-arrow" />
        </button>

        <button
          className="admin-stat-card"
          onClick={() => onNavigateAppointment("completed")}
        >
          <div className="admin-stat-icon emerald">
            <CheckCircle size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">
              {stats.completedAppointments}
            </span>
            <span className="admin-stat-label">Completadas</span>
          </div>
          <ArrowRight size={16} className="admin-stat-arrow" />
        </button>
      </div>

      {/* Completion Rate Card */}
      <div className="admin-completion-card">
        <div className="admin-completion-header">
          <div className="admin-completion-icon">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3>Tasa de Cumplimiento</h3>
            <p>Citas completadas vs total</p>
          </div>
        </div>
        <div className="admin-completion-body">
          <div className="admin-completion-value">{completionRate}%</div>
          <div className="admin-completion-bar">
            <div
              className="admin-completion-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="admin-completion-stats">
            <span>
              <CheckCircle size={14} /> {stats.completedAppointments}{" "}
              completadas
            </span>
            <span>
              <AlertCircle size={14} /> {stats.cancelledAppointments}{" "}
              canceladas
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="admin-actions-grid">
          <button
            className="admin-action-card"
            onClick={() => onNavigate("users")}
          >
            <div className="admin-action-icon blue">
              <Users size={20} />
            </div>
            <div className="admin-action-text">
              <span className="admin-action-title">Crear Usuario</span>
              <span className="admin-action-desc">
                Registrar nuevo usuario
              </span>
            </div>
            <ArrowRight size={16} className="admin-action-arrow" />
          </button>

          <button
            className="admin-action-card"
            onClick={() => onNavigate("roles")}
          >
            <div className="admin-action-icon purple">
              <Shield size={20} />
            </div>
            <div className="admin-action-text">
              <span className="admin-action-title">Gestionar Roles</span>
              <span className="admin-action-desc">
                Configurar permisos
              </span>
            </div>
            <ArrowRight size={16} className="admin-action-arrow" />
          </button>

          <button
            className="admin-action-card"
            onClick={() => onNavigate("dependencies")}
          >
            <div className="admin-action-icon green">
              <Briefcase size={20} />
            </div>
            <div className="admin-action-text">
              <span className="admin-action-title">Dependencias</span>
              <span className="admin-action-desc">
                Administrar áreas
              </span>
            </div>
            <ArrowRight size={16} className="admin-action-arrow" />
          </button>

          <button
            className="admin-action-card"
            onClick={() => onNavigate("audit")}
          >
            <div className="admin-action-icon amber">
              <Activity size={20} />
            </div>
            <div className="admin-action-text">
              <span className="admin-action-title">Auditoría</span>
              <span className="admin-action-desc">
                Ver registro de actividades
              </span>
            </div>
            <ArrowRight size={16} className="admin-action-arrow" />
          </button>
        </div>
      </div>
    </div>
  );
}
