import { TrendingUp, TrendingDown } from "lucide-react";

export function KPICard({ title, value, subtitle, trend, color, icon: Icon }) {
  return (
    <div className="kpi-card-v2" style={{ "--kpi-color": color }}>
      <div className="kpi-header-v2">
        <div className="kpi-icon-v2" style={{ background: `${color}20`, color }}>
          {Icon && <Icon size={20} />}
        </div>
        {trend !== undefined && trend !== null && (
          <span className={`kpi-trend-v2 ${trend >= 0 ? "positive" : "negative"}`}>
            {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="kpi-content-v2">
        <span className="kpi-value-v2" style={{ color }}>
          {value}
        </span>
        <span className="kpi-title-v2">{title}</span>
        {subtitle && <span className="kpi-subtitle-v2">{subtitle}</span>}
      </div>
    </div>
  );
}
