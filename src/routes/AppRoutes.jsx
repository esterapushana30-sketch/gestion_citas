import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../shared/components/AppLayout";
import { useAuth } from "../providers/AuthProvider";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "../shared/components/LoadingSpinner";

// Lazy loading para code splitting (mejor performance)
import { lazy, Suspense } from "react";

// Públicas
const Login = lazy(() => import("../features/auth/pages/Login"));
const Register = lazy(() => import("../features/auth/pages/Register"));
const ProfessionalRegister = lazy(
  () => import("../features/auth/pages/ProfessionalRegister"),
);
const ForgotPassword = lazy(
  () => import("../features/auth/pages/ForgotPassword"),
);
const Unauthorized = lazy(() => import("../shared/components/Unauthorized"));
const NotFound = lazy(() => import("../shared/components/NotFound"));

  // Privadas - Notificaciones
const NotificationsPage = lazy(
  () => import("../features/notifications/pages/NotificationsPage"),
);

// Privadas - Aprendiz
const AprendizDashboard = lazy(
  () => import("../features/appointments/pages/AprendizDashboard"),
);

// Privilegiadas (sin necesidad de especificación de rol)
const EnfermeriaDashboard = lazy(
  () => import("../features/appointments/pages/EnfermeriaDashboard"),
);
const TrabajoSocialDashboard = lazy(
  () => import("../features/appointments/pages/TrabajoSocialDashboard"),
);

// Privadas - Profesional (mismo componente, diferente configuración)
const ProfessionalDashboard = lazy(
  () => import("../features/appointments/pages/ProfessionalDashboard"),
);

// Privadas - Coordinación
const CoordinationDashboard = lazy(
  () => import("../features/dashboard/pages/CoordinationDashboard"),
);

// Privadas - Admin
const AdminDashboard = lazy(
  () => import("../features/admin/pages/AdminDashboard"),
);

const PROFESSIONAL_ROLES = ["PSICOLOGIA", "ENFERMERIA", "TRABAJO_SOCIAL"];

export function AppRoutes() {
  const { isProfessional, isCoordination, isAdmin, profile } = useAuth();

  // Redirección inteligente según rol (después del login)
  const getHomeRoute = () => {
    if (isAdmin()) return "/admin";
    if (isCoordination()) return "/coordination";
    if (isProfessional()) {
      // Redirigir a la ruta de la dependencia del usuario
      const roleName = profile?.roles?.name;
      if (roleName === "ENFERMERIA") return "/enfermeria";
      if (roleName === "TRABAJO_SOCIAL") return "/trabajo-social";
      return "/psicologia"; // PSICOLOGIA por defecto
    }
    return "/dashboard"; // Aprendiz por defecto
  };

  return (
    <Suspense fallback={<LoadingSpinner message="Cargando..." />}>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-professional" element={<ProfessionalRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* RUTAS PROTEGIDAS - NOTIFICACIONES */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute requiredRoles={["APRENDIZ", "PSICOLOGIA", "ENFERMERIA", "TRABAJO_SOCIAL", "COORDINACION", "SUPERADMIN"]}>
              <AppLayout>
                <NotificationsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* RUTAS PROTEGIDAS - APRENDIZ */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRoles="APRENDIZ">
              <AppLayout>
                <AprendizDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* RUTAS PROTEGIDAS - PSICOLOGÍA */}
        <Route
          path="/psicologia"
          element={
            <ProtectedRoute requiredRoles="PSICOLOGIA">
              <AppLayout>
                <ProfessionalDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* RUTAS PROTEGIDAS - ENFERMERÍA */}
        <Route
          path="/enfermeria"
          element={
            <ProtectedRoute requiredRoles="ENFERMERIA">
              <AppLayout>
                <EnfermeriaDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* RUTAS PROTEGIDAS - TRABAJO SOCIAL */}
        <Route
          path="/trabajo-social"
          element={
            <ProtectedRoute requiredRoles="TRABAJO_SOCIAL">
              <AppLayout>
                <TrabajoSocialDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* RUTA LEGACY - Redirigir a la ruta correcta */}
        <Route
          path="/professional"
          element={
            <ProtectedRoute requiredRoles={PROFESSIONAL_ROLES}>
              <Navigate to={getHomeRoute()} replace />
            </ProtectedRoute>
          }
        />

        {/* RUTAS PROTEGIDAS - COORDINACIÓN */}
        <Route
          path="/coordination"
          element={
            <ProtectedRoute requiredRoles={["COORDINACION", "SUPERADMIN"]}>
              <AppLayout>
                <CoordinationDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* RUTAS PROTEGIDAS - ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles="SUPERADMIN">
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* REDIRECCIÓN INICIAL */}
        <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
