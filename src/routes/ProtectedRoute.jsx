import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { LoadingSpinner } from "../shared/components/LoadingSpinner";

// Componente reutilizable para proteger rutas
export function ProtectedRoute({
  children,
  requiredRoles = null, // null = cualquier usuario logueado
  fallback = "/login", // a dónde redirigir si no tiene acceso
}) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  // 1. Esperar a cargar sesión
  if (loading) {
    return <LoadingSpinner message="Cargando sesión..." />;
  }

  // 2. No está logueado → Login
  if (!user) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  // 3. Requiere roles específicos y no los tiene → Dashboard o Unauthorized
  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Todo OK, renderizar el componente hijo
  return children;
}
