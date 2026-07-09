import { useState } from "react";
import {
  User,
  Clock,
  FileText,
  ChevronRight,
  X,
  Award,
  TrendingUp,
  Download,
} from "lucide-react";

const ACTIONS = [
  {
    id: "professionals",
    icon: User,
    title: "Top profesionales",
    subtitle: "Profesionales con más citas completadas",
  },
  {
    id: "schedule",
    icon: Clock,
    title: "Distribución por franja horaria",
    subtitle: "Ver análisis por horarios del día",
  },
  {
    id: "report",
    icon: FileText,
    title: "Reporte rápido",
    subtitle: "Exporta los datos del período seleccionado",
  },
];

export function QuickActions({ professionals = [], onExportCSV }) {
  const [activeModal, setActiveModal] = useState(null);

  const handleAction = (actionId) => {
    if (actionId === "report") {
      onExportCSV?.();
      return;
    }
    setActiveModal(actionId);
  };

  return (
    <>
      <div className="quick-actions-section">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className="quick-action-item"
              onClick={() => handleAction(action.id)}
            >
              <div className="quick-action-icon">
                <Icon size={20} />
              </div>
              <div className="quick-action-text">
                <span className="quick-action-title">{action.title}</span>
                <span className="quick-action-subtitle">{action.subtitle}</span>
              </div>
              <ChevronRight size={18} className="quick-action-arrow" />
            </button>
          );
        })}
      </div>

      {/* Modal: Top Profesionales */}
      {activeModal === "professionals" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div
            className="modal-content quick-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-title">
                <Award size={20} color="#22c55e" />
                <h3>Top Profesionales</h3>
              </div>
              <button
                className="btn-icon"
                onClick={() => setActiveModal(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              {professionals.length === 0 ? (
                <div className="empty-state-small">
                  <p>No hay datos de profesionales</p>
                </div>
              ) : (
                <div className="professionals-list">
                  {professionals.slice(0, 10).map((prof, index) => {
                    const total = prof.total || 0;
                    const completed = prof.completed || 0;
                    const rate =
                      total > 0
                        ? Math.round((completed / total) * 100)
                        : 0;
                    return (
                      <div key={prof.id || index} className="prof-item">
                        <div className="prof-rank">
                          {index < 3 ? (
                            <span className={`rank-badge rank-${index + 1}`}>
                              {index + 1}
                            </span>
                          ) : (
                            <span className="rank-badge rank-other">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="prof-info">
                          <span className="prof-name">
                            {prof.name || "Sin nombre"}
                          </span>
                          <span className="prof-stats">
                            {completed} completadas de {total} total
                          </span>
                        </div>
                        <div className="prof-rate">
                          <div className="prof-rate-bar">
                            <div
                              className="prof-rate-fill"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="prof-rate-value">{rate}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Distribución por Franja Horaria */}
      {activeModal === "schedule" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div
            className="modal-content quick-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-title">
                <Clock size={20} color="#f59e0b" />
                <h3>Distribución por Franja Horaria</h3>
              </div>
              <button
                className="btn-icon"
                onClick={() => setActiveModal(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <TimeSlotDistribution professionals={professionals} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Componente inline: Distribución de citas por hora */
function TimeSlotDistribution() {
  // Datos de distribución por hora del día
  // En producción: fetch de supabase agrupando por hour de scheduled_time
  const distribution = [
    { hour: "8", count: 2, label: "8:00 - 9:00" },
    { hour: "9", count: 5, label: "9:00 - 10:00" },
    { hour: "10", count: 8, label: "10:00 - 11:00" },
    { hour: "11", count: 6, label: "11:00 - 12:00" },
    { hour: "12", count: 1, label: "12:00 - 13:00" },
    { hour: "13", count: 4, label: "13:00 - 14:00" },
    { hour: "14", count: 7, label: "14:00 - 15:00" },
    { hour: "15", count: 5, label: "15:00 - 16:00" },
    { hour: "16", count: 3, label: "16:00 - 17:00" },
  ];

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  // Encontrar pico
  const peakSlot = distribution.reduce((max, d) =>
    d.count > max.count ? d : max
  );

  return (
    <div className="time-slot-dist">
      <div className="dist-summary">
        <div className="dist-summary-item">
          <TrendingUp size={16} color="#22c55e" />
          <span>
            Hora pico: <strong>{peakSlot.label}</strong> ({peakSlot.count}{" "}
            citas)
          </span>
        </div>
        <div className="dist-summary-item">
          <Clock size={16} color="#6b7280" />
          <span>
            Horario laboral: <strong>8:00 AM - 5:00 PM</strong>
          </span>
        </div>
      </div>

      <div className="dist-bars">
        {distribution.map((slot) => {
          const height = maxCount > 0 ? (slot.count / maxCount) * 100 : 0;
          const isPeak = slot.hour === peakSlot.hour;
          return (
            <div key={slot.hour} className="dist-bar-col">
              <span className="dist-bar-count">{slot.count}</span>
              <div className="dist-bar-wrapper">
                <div
                  className={`dist-bar ${isPeak ? "peak" : ""}`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="dist-bar-label">{slot.label.split(" - ")[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
