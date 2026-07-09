export function DonutChart({ completed, total, size = 120 }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const cancelled = total - completed;
  const cancelledPercentage = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="donut-chart-wrapper">
      <div className="donut-chart" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="donut-svg">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          {/* Completed arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#22c55e"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            className="donut-progress"
          />
        </svg>
        <div className="donut-center">
          <span className="donut-percentage">{percentage}%</span>
        </div>
      </div>

      <div className="donut-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#22c55e" }} />
          <div className="legend-text">
            <span className="legend-label">Completadas</span>
            <span className="legend-value">
              {completed} ({percentage}%)
            </span>
          </div>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#ef4444" }} />
          <div className="legend-text">
            <span className="legend-label">Canceladas / No asistieron</span>
            <span className="legend-value">
              {cancelled} ({cancelledPercentage}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
