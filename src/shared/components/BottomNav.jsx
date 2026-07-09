import { NavLink } from "react-router-dom";
import { Home, Calendar, Bell, User } from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { getDependencyConfig } from "../../features/appointments/config/dependencies.config";

export function BottomNav({ onProfileClick }) {
  const { profile, isProfessional, isAdmin, isCoordination, isAprendiz } = useAuth();

  const getHomeRoute = () => {
    if (isAdmin()) return "/admin";
    if (isCoordination()) return "/coordination";
    if (isProfessional()) {
      return getDependencyConfig(profile?.roles?.name)?.route || "/psicologia";
    }
    return "/dashboard";
  };

  // "Mis Citas" siempre va a la ruta de citas del usuario
  const getAppointmentsRoute = () => {
    if (isAprendiz()) return "/dashboard";
    if (isProfessional()) {
      return getDependencyConfig(profile?.roles?.name)?.route || "/psicologia";
    }
    if (isCoordination()) return "/coordination";
    if (isAdmin()) return "/admin";
    return "/dashboard";
  };

  return (
    <nav className="bottom-nav">
      <NavLink
        to={getHomeRoute()}
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? "active" : ""}`
        }
      >
        <Home size={22} />
        <span>Inicio</span>
      </NavLink>

      <NavLink
        to={getAppointmentsRoute()}
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? "active" : ""}`
        }
      >
        <Calendar size={22} />
        <span>Mis Citas</span>
      </NavLink>

      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? "active" : ""}`
        }
      >
        <div className="notification-indicator">
          <Bell size={22} />
        </div>
        <span>Alertas</span>
      </NavLink>

      <button
        className="bottom-nav-item"
        onClick={onProfileClick}
      >
        <User size={22} />
        <span>Perfil</span>
      </button>
    </nav>
  );
}
