import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { getDependencyConfig } from "../../features/appointments/config/dependencies.config";
import { UserProfile } from "./UserProfile";
import { BottomNav } from "./BottomNav";
import {
  LayoutDashboard,
  Calendar,
  Shield,
  LogOut,
  Heart,
} from "lucide-react";

export function AppLayout({ children }) {
  const { profile, signOut, isAdmin, isCoordination, isProfessional } =
    useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // Obtener configuración de la dependencia del usuario
  const dependencyConfig = isProfessional()
    ? getDependencyConfig(profile?.roles?.name)
    : null;

  const navItems = [];

  if (isAdmin()) {
    navItems.push({ to: "/admin", label: "Administración", icon: Shield });
  }
  if (isCoordination()) {
    navItems.push({
      to: "/coordination",
      label: "Coordinación",
      icon: LayoutDashboard,
    });
  }
  if (isProfessional() && dependencyConfig) {
    navItems.push({
      to: dependencyConfig.route,
      label: dependencyConfig.name,
      icon: dependencyConfig.icon,
      color: dependencyConfig.color,
    });
  }
  if (profile?.roles?.name === "APRENDIZ") {
    navItems.push({
      to: "/dashboard",
      label: "Mis Citas",
      icon: Calendar,
    });
  }

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <Heart size={24} color="var(--sena-green)" />
          <span className="sidebar-brand">SENA Bienestar</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
                style={
                  item.color
                    ? { "--sidebar-link-color": item.color }
                    : {}
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div
            className="sidebar-user"
            onClick={() => setShowProfile(true)}
            title="Ver perfil"
          >
            <div
              className="avatar"
              style={
                dependencyConfig
                  ? { background: dependencyConfig.color }
                  : {}
              }
            >
              {profile?.full_name?.[0]}
            </div>
            <div className="user-info">
              <div className="user-name">{profile?.full_name}</div>
              <div className="user-role">
                {dependencyConfig?.name || profile?.roles?.name}
              </div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </aside>

      <main className="app-main">
        {children}
        <BottomNav onProfileClick={() => setShowProfile(true)} />
      </main>

      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </div>
  );
}
