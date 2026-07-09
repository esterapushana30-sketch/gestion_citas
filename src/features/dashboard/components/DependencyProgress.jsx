import { Brain, Stethoscope, Users } from "lucide-react";

const DEPENDENCY_ICONS = {
  PSICOLOGIA: { icon: Brain, color: "#22c55e" },
  ENFERMERIA: { icon: Stethoscope, color: "#3b82f6" },
  TRABAJO_SOCIAL: { icon: Users, color: "#f59e0b" },
};

export function DependencyProgress({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="dependency-progress-section">
        <div className="section-header-v2">
          <h3>Citas por dependencia</h3>
        </div>
        <div className="empty-state-small">
          <p>No hay datos de dependencias</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <div className="dependency-progress-section">
      <div className="section-header-v2">
        <h3>Citas por dependencia</h3>
        <button className="see-detail-btn">
          Ver detalle
          <span className="arrow">›</span>
        </button>
      </div>

      <div className="dependency-list">
        {data.map((item, index) => {
          const config = DEPENDENCY_ICONS[item.id] || DEPENDENCY_ICONS.PSICOLOGIA;
          const Icon = config.icon;
          const percentage = total > 0 ? Math.round((item.total / total) * 100) : 0;

          return (
            <div key={item.id || `dependency-${index}`} className="dependency-row">
              <div className="dependency-icon-wrapper" style={{ background: `${config.color}15` }}>
                <Icon size={18} color={config.color} />
              </div>
              <span className="dependency-name">{item.name}</span>
              <div className="progress-bar-wrapper">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${percentage}%`, background: config.color }}
                />
              </div>
              <span className="dependency-count">
                {item.total} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
