import { useState, useEffect } from "react";
import { UserManagement } from "../components/UserManagement";
import { AuditLogViewer } from "../components/AuditLogViewer";
import { RoleManagement } from "../components/RoleManagement";
import { DependencyManagement } from "../components/DependencyManagement";
import { SystemConfig } from "../components/SystemConfig";
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
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "users", label: "Usuarios", icon: Users },
  { id: "roles", label: "Roles", icon: Shield },
  { id: "dependencies", label: "Dependencias", icon: Briefcase },
  { id: "audit", label: "Auditoría", icon: Activity },
  { id: "config", label: "Configuración", icon: Settings },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const [
        { count: totalUsers },
        { count: activeUsers },
        { count: totalAppointments },
        { count: pendingAppointments },
        { count: completedAppointments },
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
      ]);

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        inactiveUsers: (totalUsers || 0) - (activeUsers || 0),
        totalAppointments: totalAppointments || 0,
        pendingAppointments: pendingAppointments || 0,
        completedAppointments: completedAppointments || 0,
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

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Panel de Administración</h1>
          <p>Gestión completa del sistema SENA Bienestar</p>
        </div>
      </header>

      <nav className="admin-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="admin-content">
        {activeTab === "dashboard" && (
          <AdminStats stats={stats} loading={loadingStats} onNavigate={setActiveTab} />
        )}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "roles" && <RoleManagement />}
        {activeTab === "dependencies" && <DependencyManagement />}
        {activeTab === "audit" && <AuditLogViewer />}
        {activeTab === "config" && <SystemConfig />}
      </div>
    </div>
  );
}

function AdminStats({ stats, loading, onNavigate }) {
  if (loading) {
    return <LoadingSpinner message="Cargando estadísticas..." />;
  }

  if (!stats) return null;

  return (
    <div className="admin-stats">
      <h2>Resumen del Sistema</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dbeafe" }}>
            <Users size={24} color="#3b82f6" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">Total Usuarios</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#d1fae5" }}>
            <UserCheck size={24} color="#22c55e" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.activeUsers}</span>
            <span className="stat-label">Usuarios Activos</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fee2e2" }}>
            <UserX size={24} color="#ef4444" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.inactiveUsers}</span>
            <span className="stat-label">Usuarios Inactivos</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#ede9fe" }}>
            <Calendar size={24} color="#8b5cf6" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalAppointments}</span>
            <span className="stat-label">Total Citas</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7" }}>
            <Clock size={24} color="#f59e0b" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.pendingAppointments}</span>
            <span className="stat-label">Citas Pendientes</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#d1fae5" }}>
            <Activity size={24} color="#22c55e" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.completedAppointments}</span>
            <span className="stat-label">Citas Completadas</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="actions-grid">
          <button className="action-card" onClick={() => onNavigate("users")}>
            <Users size={20} />
            <span>Crear Usuario</span>
          </button>
          <button className="action-card" onClick={() => onNavigate("roles")}>
            <Shield size={20} />
            <span>Gestionar Roles</span>
          </button>
          <button className="action-card" onClick={() => onNavigate("dependencies")}>
            <Briefcase size={20} />
            <span>Gestionar Dependencias</span>
          </button>
          <button className="action-card" onClick={() => onNavigate("audit")}>
            <Activity size={20} />
            <span>Ver Auditoría</span>
          </button>
        </div>
      </div>
    </div>
  );
}
