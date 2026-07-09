import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({ title, value, trend, color, icon: Icon }) {
  const isPositive = trend >= 0;

  return (
    <div className="stat-card-mobile">
      <div className="stat-icon-mobile" style={{ background: `${color}15`, color }}>
        {Icon && <Icon size={22} />}
      </div>
      <div className="stat-content-mobile">
        <span className="stat-title-mobile">{title}</span>
        <span className="stat-value-mobile" style={{ color }}>
          {value}
        </span>
        {trend !== undefined && (
          <div className={`stat-trend-mobile ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(trend)}% vs semana anterior</span>
          </div>
        )}
      </div>
    </div>
  );
}
