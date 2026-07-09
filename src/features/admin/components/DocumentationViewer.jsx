import { useState } from "react";
import {
  BookOpen,
  FileText,
  Users,
  Settings,
  Database,
  Shield,
  Code,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const MANUALS = {
  technical: {
    title: "Manual Técnico",
    icon: Code,
    description: "Arquitectura, base de datos, API y configuración del sistema",
    sections: [
      {
        title: "1. Arquitectura del Sistema",
        icon: Settings,
        content: [
          { label: "Frontend", value: "React 19 + Vite 8 + React Router v7" },
          { label: "Backend/BDD", value: "Supabase (PostgreSQL + Auth + RLS)" },
          { label: "Estado", value: "Context API + Hooks personalizados" },
          { label: "Formularios", value: "React Hook Form + Zod v4" },
          { label: "UI", value: "CSS Custom + Lucide React icons" },
          { label: "Tests", value: "Vitest + Testing Library + jsdom" },
          { label: "Linting", value: "ESLint 9" },
        ],
      },
      {
        title: "2. Modelo de Base de Datos",
        icon: Database,
        content: [
          { label: "profiles", value: "Perfiles de usuario (id, role_id, full_name, email, dependency_id)" },
          { label: "roles", value: "Roles del sistema (SUPERADMIN, COORDINACION, PSICOLOGIA, ENFERMERIA, TRABAJO_SOCIAL, APRENDIZ)" },
          { label: "dependencies", value: "Dependencias (PSICOLOGIA, ENFERMERIA, TRABAJO_SOCIAL)" },
          { label: "appointments", value: "Citas (user_id, professional_id, dependency_id, status, reason, notes)" },
          { label: "professional_availability", value: "Disponibilidad de profesionales por día y hora" },
          { label: "system_config", value: "Configuración del sistema (key-value)" },
          { label: "audit_logs", value: "Registro de auditoría de acciones" },
        ],
      },
      {
        title: "3. Sistema de Roles (RBAC)",
        icon: Shield,
        content: [
          { label: "SUPERADMIN (id:1)", value: "Acceso total al sistema" },
          { label: "COORDINACION (id:2)", value: "Dashboard, ver todas las citas, reportes" },
          { label: "PSICOLOGIA (id:3)", value: "Gestionar citas de psicología" },
          { label: "ENFERMERIA (id:4)", value: "Gestionar citas de enfermería" },
          { label: "TRABAJO_SOCIAL (id:5)", value: "Gestionar citas de trabajo social" },
          { label: "APRENDIZ (id:6)", value: "Crear y ver sus propias citas" },
        ],
      },
      {
        title: "4. Autenticación y Seguridad",
        icon: Shield,
        content: [
          { label: "Autenticación", value: "Supabase Auth (JWT)" },
          { label: "RLS", value: "Row Level Security por rol en Supabase" },
          { label: "Sesiones", value: "Persistencia automática con refresh token" },
          { label: "Passwords", value: "Hasheados con bcrypt por Supabase" },
        ],
      },
      {
        title: "5. Estructura de Archivos",
        icon: FileText,
        content: [
          { label: "src/features/auth/", value: "Login, Register, ForgotPassword, ProfessionalRegister" },
          { label: "src/features/appointments/", value: "AppointmentForm, hooks, repository, validaciones" },
          { label: "src/features/dashboard/", value: "CoordinationDashboard, KPIs, gráficas" },
          { label: "src/features/admin/", value: "AdminDashboard, usuarios, configuración" },
          { label: "src/shared/", value: "AppLayout, BottomNav, LoadingSpinner, estilos" },
          { label: "src/providers/", value: "AuthProvider (Context API global)" },
          { label: "src/routes/", value: "AppRoutes, ProtectedRoute" },
        ],
      },
      {
        title: "6. Comandos Disponibles",
        icon: Code,
        content: [
          { label: "npm run dev", value: "Servidor de desarrollo (Vite)" },
          { label: "npm run build", value: "Build de producción" },
          { label: "npm run test", value: "Ejecutar tests (Vitest watch)" },
          { label: "npm run test:run", value: "Tests una vez" },
          { label: "npm run test:coverage", value: "Tests con cobertura" },
          { label: "npm run lint", value: "Linting con ESLint" },
        ],
      },
    ],
  },
  user: {
    title: "Manual de Usuario",
    icon: Users,
    description: "Guía completa de uso para cada tipo de usuario",
    sections: [
      {
        title: "1. Autenticación",
        icon: Shield,
        content: [
          { label: "Iniciar Sesión", value: "Ingrese email y contraseña en la página de login" },
          { label: "Registrarse (Aprendiz)", value: "Haga clic en 'Regístrate aquí' y complete el formulario" },
          { label: "Registrarse (Profesional)", value: "Navegue a /register-professional" },
          { label: "Recuperar Contraseña", value: "Haga clic en '¿Olvidaste?' y siga las instrucciones" },
        ],
      },
      {
        title: "2. Panel del Aprendiz",
        icon: Users,
        content: [
          { label: "Ver Mis Citas", value: "Dashboard principal con filtro por estado" },
          { label: "Solicitar Nueva Cita", value: "Seleccione dependencia, fecha, hora y motivo" },
          { label: "Reglas de Negocio", value: "Máx 2 pendientes, solo horario laboral, no fines de semana" },
          { label: "Cancelar Cita", value: "Solo cancela citas pendientes" },
        ],
      },
      {
        title: "3. Panel del Profesional",
        icon: Users,
        content: [
          { label: "Dashboard", value: "KPIs, próxima cita, filtros por estado" },
          { label: "Confirmar Cita", value: "Acepta la cita y cambia estado a confirmed" },
          { label: "Reprogramar", value: "Cambia fecha y hora de la cita" },
          { label: "Completar Atención", value: "Marca cita como completada" },
          { label: "Observaciones", value: "Agrega notas sobre la atención" },
          { label: "Mi Horario", value: "Configura disponibilidad semanal" },
          { label: "Historial", value: "Tabla con todas las citas atendidas" },
        ],
      },
      {
        title: "4. Panel de Coordinación",
        icon: BarChart3,
        content: [
          { label: "Dashboard", value: "KPIs generales, gráficas, tendencias" },
          { label: "Filtrar por Fecha", value: "Seleccione rango de fechas" },
          { label: "Exportar Reportes", value: "Genera reporte del período seleccionado" },
        ],
      },
      {
        title: "5. Panel de Administración",
        icon: Settings,
        content: [
          { label: "Gestionar Usuarios", value: "Crear, editar, activar/desactivar usuarios" },
          { label: "Configuración", value: "General, horario laboral, permisos" },
          { label: "Auditoría", value: "Logs de actividad del sistema" },
          { label: "Roles", value: "Gestionar permisos por rol" },
          { label: "Dependencias", value: "Administrar áreas de bienestar" },
        ],
      },
      {
        title: "6. Credenciales de Prueba",
        icon: Users,
        content: [
          { label: "Aprendiz", value: "aprendiz@test.com / Test1234!" },
          { label: "Psicología", value: "psicologia@test.com / Test1234!" },
          { label: "Enfermería", value: "enfermeria@test.com / Test1234!" },
          { label: "Trabajo Social", value: "trabajosocial@test.com / Test1234!" },
          { label: "Coordinación", value: "coordinacion@test.com / Test1234!" },
          { label: "Administrador", value: "admin@test.com / Test1234!" },
        ],
      },
    ],
  },
};

// BarChart3 icon import
import { BarChart3 } from "lucide-react";

export function DocumentationViewer() {
  const [activeManual, setActiveManual] = useState("technical");
  const [expandedSection, setExpandedSection] = useState(null);

  const manual = MANUALS[activeManual];

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="admin-section">
      <header className="section-header">
        <h2>
          <BookOpen size={20} />
          Documentación del Sistema
        </h2>
      </header>

      {/* Manual Selector */}
      <div className="doc-manual-selector">
        {Object.entries(MANUALS).map(([key, m]) => {
          const Icon = m.icon;
          return (
            <button
              key={key}
              className={`doc-manual-btn ${activeManual === key ? "active" : ""}`}
              onClick={() => {
                setActiveManual(key);
                setExpandedSection(null);
              }}
            >
              <Icon size={20} />
              <div>
                <span className="doc-manual-title">{m.title}</span>
                <span className="doc-manual-desc">{m.description}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Manual Content */}
      <div className="doc-content">
        <h3 className="doc-content-title">
          {manual.title}
        </h3>

        <div className="doc-sections">
          {manual.sections.map((section, index) => {
            const SectionIcon = section.icon;
            const isExpanded = expandedSection === index;

            return (
              <div
                key={index}
                className={`doc-section ${isExpanded ? "expanded" : ""}`}
              >
                <button
                  className="doc-section-header"
                  onClick={() => toggleSection(index)}
                >
                  <SectionIcon size={18} />
                  <span>{section.title}</span>
                  <ChevronRight
                    size={16}
                    className={`doc-section-arrow ${isExpanded ? "rotated" : ""}`}
                  />
                </button>

                {isExpanded && (
                  <div className="doc-section-body">
                    {section.content.map((item, i) => (
                      <div key={i} className="doc-item">
                        <span className="doc-item-label">{item.label}</span>
                        <span className="doc-item-value">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
