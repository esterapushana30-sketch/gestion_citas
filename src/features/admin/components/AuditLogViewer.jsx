import { useEffect, useState } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { Clock, User, Database, ArrowRight, Activity } from "lucide-react";

const ACTION_COLORS = {
    CREATE_USER: "#22c55e",
    UPDATE_USER: "#3b82f6",
    UPDATE_CONFIG: "#f59e0b",
    DELETE_USER: "#ef4444",
};

export function AuditLogViewer() {
    const { auditLogs, auditPagination, loading, fetchAuditLogs } = useAdmin();
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchAuditLogs({ action: filter, page: currentPage });
    }, [fetchAuditLogs, filter, currentPage]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="admin-section">
            <header className="section-header">
                <h2>
                    <Activity size={20} />
                    Registro de Auditoría
                </h2>
            </header>

            <div className="audit-filters">
                <input
                    type="text"
                    placeholder="Filtrar por acción (CREATE_USER, UPDATE_USER...)"
                    value={filter}
                    onChange={handleFilterChange}
                />
            </div>

            {loading ? (
                <div className="empty-state">
                    <p>Cargando registros...</p>
                </div>
            ) : auditLogs.length === 0 ? (
                <div className="empty-state">
                    <Activity size={48} />
                    <p>No hay registros de auditoría</p>
                </div>
            ) : (
                <div className="audit-timeline">
                    {auditLogs.map((log) => (
                        <div key={log.id} className="audit-item">
                            <div
                                className="audit-bar"
                                style={{ background: ACTION_COLORS[log.action] || "#666" }}
                            />

                            <div className="audit-content">
                                <div className="audit-header">
                                    <span
                                        className="audit-action-label"
                                        style={{ color: ACTION_COLORS[log.action] }}
                                    >
                                        {log.action}
                                    </span>
                                    <span className="audit-time">
                                        <Clock size={14} />
                                        {new Date(log.created_at).toLocaleString()}
                                    </span>
                                </div>

                                <div className="audit-details">
                                    <p>
                                        <User size={14} />
                                        <strong>{log.admin?.full_name || "Sistema"}</strong>
                                        {" "}modificó{" "}
                                        <Database size={14} />
                                        <strong>{log.entity_type}</strong>
                                        {" "}(ID: {log.entity_id})
                                    </p>

                                    {log.old_data && log.new_data && (
                                        <div className="audit-changes">
                                            <div className="change-box old">
                                                <span className="label">Antes</span>
                                                <pre>
                                                    {JSON.stringify(log.old_data, null, 2)}
                                                </pre>
                                            </div>
                                            <ArrowRight size={20} />
                                            <div className="change-box new">
                                                <span className="label">Después</span>
                                                <pre>
                                                    {JSON.stringify(log.new_data, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {auditPagination.total > 0 && (
                <div className="pagination">
                    <span>Total: {auditPagination.total} registros</span>
                    <div className="page-controls">
                        {Array.from(
                            { length: auditPagination.totalPages },
                            (_, i) => (
                                <button
                                    key={i + 1}
                                    className={currentPage === i + 1 ? "active" : ""}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ),
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
