import { Brain, Stethoscope, Users } from "lucide-react";

export const DEPENDENCIES_CONFIG = {
  PSICOLOGIA: {
    id: "PSICOLOGIA",
    name: "Psicología",
    route: "/psicologia",
    color: "#8b5cf6",
    colorLight: "#ede9fe",
    icon: Brain,
    description: "Servicios de salud mental y apoyo psicológico",
    emptyStateMessage: "No hay citas de psicología",
    emptyStateHint: "Las citas de psicología aparecerán aquí cuando los aprendiz las soliciten.",
    confirmLabel: "Confirmar",
    completeLabel: "Completar Atención",
    noShowLabel: "No asistió",
    rescheduleLabel: "Reprogramar",
    addObservationsLabel: "Ver/Observaciones",
    availabilityLabel: "Gestionar Disponibilidad",
    historyLabel: "Historial de Atención",
    statsLabel: "Citas de Psicología",
  },
  ENFERMERIA: {
    id: "ENFERMERIA",
    name: "Enfermería",
    route: "/enfermeria",
    color: "#06b6d4",
    colorLight: "#ecfeff",
    icon: Stethoscope,
    description: "Servicios de enfermería y primeros auxilios",
    emptyStateMessage: "No hay citas de enfermería",
    emptyStateHint: "Las citas de enfermería aparecerán aquí cuando los aprendiz las soliciten.",
    confirmLabel: "Confirmar",
    completeLabel: "Completar Atención",
    noShowLabel: "No asistió",
    rescheduleLabel: "Reprogramar",
    addObservationsLabel: "Ver/Observaciones",
    availabilityLabel: "Gestionar Disponibilidad",
    historyLabel: "Historial de Atención",
    statsLabel: "Citas de Enfermería",
  },
  TRABAJO_SOCIAL: {
    id: "TRABAJO_SOCIAL",
    name: "Trabajo Social",
    route: "/trabajo-social",
    color: "#f97316",
    colorLight: "#fff7ed",
    icon: Users,
    description: "Servicios de apoyo social y acompañamiento",
    emptyStateMessage: "No hay citas de trabajo social",
    emptyStateHint: "Las citas de trabajo social aparecerán aquí cuando los aprendiz las soliciten.",
    confirmLabel: "Confirmar",
    completeLabel: "Completar Atención",
    noShowLabel: "No asistió",
    rescheduleLabel: "Reprogramar",
    addObservationsLabel: "Ver/Observaciones",
    availabilityLabel: "Gestionar Disponibilidad",
    historyLabel: "Historial de Atención",
    statsLabel: "Citas de Trabajo Social",
  },
};

export const PROFESIONAL_CONFIG = {
  ENFERMERIA: {
    name: "Enfermería",
    route: "/enfermeria",
    color: "#06b6d4",
  },
  TRABAJO_SOCIAL: {
    name: "Trabajo Social",
    route: "/trabajo-social",
    color: "#f97316",
  },
};

export function getDependencyConfig(roleName) {
  return DEPENDENCIES_CONFIG[roleName] || DEPENDENCIES_CONFIG.PSICOLOGIA;
}
