import { useState, useEffect, useCallback } from "react";
import { AdminRepository } from "../api/admin.repository";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import {
  Search,
  Calendar,
  Clock,
  User,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_LABELS = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No asistió",
};

const STATUS_COLORS = {
  pending: { bg: "#fef3c7", color: "#92400e" },
  confirmed: { bg: "#dbeafe", color: "#1e40af" },
  completed: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
  no_show: { bg: "#f3f4f6", color: "#374151" },
};

export function AppointmentsViewer({ initialStatus = null }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({
    status: initialStatus || "",
    dependencyId: "",
    search: "",
    page: 1,
  });

  const fetchAppointments = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      const result = await AdminRepository.getAppointments({
        status: currentFilters.status || undefined,
        dependencyId: currentFilters.dependencyId || undefined,
        search: currentFilters.search || undefined,
        page: currentFilters.page || 1,
        limit: 15,
      });
      setAppointments(result.appointments);
      setPagination({
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
      });
    } catch {
      toast.error("Error cargando citas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments(filters);
  }, [filters, fetchAppointments]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ status: "", dependencyId: "", search: "", page: 1 });
  };

  const hasActiveFilters = filters.status || filters.dependencyId || filters.search;

  return (
    <div className="admin-section">
      <header className="section-header">
        <h2>Gestión de Citas</h2>
        <span className="admin-appointments-count">
          Total: {pagination.total} citas
        </span>
      </header>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por motivo o notas..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmadas</option>
          <option value="completed">Completadas</option>
          <option value="cancelled">Canceladas</option>
          <option value="no_show">No asistió</option>
        </select>
        <select
          value={filters.dependencyId}
          onChange={(e) => handleFilterChange("dependencyId", e.target.value)}
        >
          <option value="">Todas las dependencias</option>
          <option value="1">Psicología</option>
          <option value="2">Enfermería</option>
          <option value="3">Trabajo Social</option>
        </select>
        {hasActiveFilters && (
          <button className="admin-clear-filters" onClick={clearFilters}>
            <X size={14} />
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      {loading ? (
        <LoadingSpinner message="Cargando citas..." />
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <p>No hay citas que mostrar</p>
          <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            {hasActiveFilters
              ? "Intenta cambiar los filtros de búsqueda"
              : "Las citas aparecerán aquí cuando los aprendices las agenden"}
          </p>
        </div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Aprendiz</th>
                <th>Dependencia</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Profesional</th>
                <th>Estado</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => {
                const statusStyle = STATUS_COLORS[apt.status] || STATUS_COLORS.pending;
                return (
                  <tr key={apt.id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar" style={{ fontSize: "0.75rem" }}>
                          {apt.aprendiz?.full_name?.[0] || "?"}
                        </div>
                        <div>
                          <div className="name">
                            {apt.aprendiz?.full_name || "Sin asignar"}
                          </div>
                          <div className="email">
                            {apt.aprendiz?.document_number || "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className="dependency-tag"
                        style={{
                          background: apt.dependencies?.color
                            ? `${apt.dependencies.color}20`
                            : "#f3f4f6",
                          color: apt.dependencies?.color || "#374151",
                        }}
                      >
                        {apt.dependencies?.name || "—"}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Calendar size={14} style={{ color: "#9ca3af" }} />
                        {apt.scheduled_date}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Clock size={14} style={{ color: "#9ca3af" }} />
                        {apt.scheduled_time?.slice(0, 5)}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <User size={14} style={{ color: "#9ca3af" }} />
                        {apt.professional?.full_name || "Sin asignar"}
                      </span>
                    </td>
                    <td>
                      <span
                        className="status-tag"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        {STATUS_LABELS[apt.status] || apt.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className="appointment-reason-cell"
                        title={apt.reason || ""}
                      >
                        {apt.reason
                          ? apt.reason.length > 50
                            ? apt.reason.slice(0, 50) + "..."
                            : apt.reason
                          : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="pagination">
            <span>
              Página {pagination.page} de {pagination.totalPages} ({pagination.total} citas)
            </span>
            <div className="page-controls">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handleFilterChange("page", pagination.page - 1)}
                style={{ opacity: pagination.page <= 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const startPage = Math.max(1, pagination.page - 2);
                const pageNum = startPage + i;
                if (pageNum > pagination.totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    className={pagination.page === pageNum ? "active" : ""}
                    onClick={() => handleFilterChange("page", pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handleFilterChange("page", pagination.page + 1)}
                style={{ opacity: pagination.page >= pagination.totalPages ? 0.4 : 1 }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
