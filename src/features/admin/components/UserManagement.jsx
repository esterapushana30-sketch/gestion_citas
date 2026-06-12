import { useEffect, useState } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { Search, UserPlus, MoreVertical, CheckCircle, XCircle, X, Edit, Eye, Trash2 } from "lucide-react";

const ROLES = [
    {id: 1, name: "SUPERADMIN", label: "SuperAdmin"},
    {id: 2, name: "COORDINACION", label: "Coordinación"},
    {id: 3, name: "PSICOLOGIA", label: "Psicología"},
    {id: 4, name: "ENFERMERIA", label: "Enfermería"},
    {id: 5, name: "TRABAJO_SOCIAL", label: "Trabajo social"},
    {id: 6, name: "APRENDIZ", label: "Aprendiz"}
];

const DEPENDENCIES = [
    {id: 1, name: "Psicología"},
    {id: 2, name: "Enfermería"},
    {id: 3, name: "Trabajo Social"}
];

const INITIAL_FORM = {
    email: "",
    password: "",
    fullName: "",
    roleId: "",
    dependencyId: ""
};

const INITIAL_EDIT_FORM = {
    roleId: "",
    dependencyId: ""
};

export function UserManagement() {
    const { users, pagination, loading, fetchUsers, updateUserRole, createUser } = useAdmin();
    const [filters, setFilters] = useState({ search: "", role: ""});
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUserData, setNewUserData] = useState(INITIAL_FORM);
    const [editData, setEditData] = useState(INITIAL_EDIT_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    useEffect(() => {
        fetchUsers(filters);
    }, [filters, fetchUsers]);

    const toggleUserStatus = (user) => {
        updateUserRole(user.id, {
            roleId: user.role_id,
            dependencyId: user.dependency_id,
            isActive: !user.is_active
        });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const result = await createUser({
                email: newUserData.email,
                password: newUserData.password,
                fullName: newUserData.fullName,
                roleId: Number(newUserData.roleId),
                dependencyId: newUserData.dependencyId ? Number(newUserData.dependencyId) : null
            });
            if (result?.success !== false) {
                setShowCreateForm(false);
                setNewUserData(INITIAL_FORM);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        setSubmitting(true);
        try {
            await updateUserRole(selectedUser.id, {
                roleId: Number(editData.roleId),
                dependencyId: editData.dependencyId ? Number(editData.dependencyId) : null,
                isActive: selectedUser.is_active
            });
            setShowEditForm(false);
            setSelectedUser(null);
            setEditData(INITIAL_EDIT_FORM);
        } finally {
            setSubmitting(false);
        }
    };

    const openEditForm = (user) => {
        setSelectedUser(user);
        setEditData({
            roleId: user.role_id || "",
            dependencyId: user.dependency_id || ""
        });
        setShowEditForm(true);
        setActiveMenu(null);
    };

    const openDetails = (user) => {
        setSelectedUser(user);
        setShowDetails(true);
        setActiveMenu(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const toggleMenu = (userId) => {
        setActiveMenu(activeMenu === userId ? null : userId);
    };

    return (
        <div className="admin-section">
            <header className="section-header">
                <h2>Gestión de usuarios</h2>
                <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
                    <UserPlus size={18} />
                    Nuevo Usuario
                </button>
            </header>

            {showCreateForm && (
                <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="section-header">
                            <h2>Crear Nuevo Usuario</h2>
                            <button className="btn-icon" onClick={() => setShowCreateForm(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <form className="auth-form" onSubmit={handleCreateUser}>
                            <div className="field">
                                <label htmlFor="new-fullname">Nombre completo</label>
                                <input
                                    id="new-fullname"
                                    type="text"
                                    name="fullName"
                                    value={newUserData.fullName}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="new-email">Email</label>
                                <input
                                    id="new-email"
                                    type="email"
                                    name="email"
                                    value={newUserData.email}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="new-password">Contraseña temporal</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    name="password"
                                    value={newUserData.password}
                                    onChange={handleFormChange}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="new-role">Rol</label>
                                <select
                                    id="new-role"
                                    name="roleId"
                                    value={newUserData.roleId}
                                    onChange={handleFormChange}
                                    required
                                >
                                    <option value="">Selecciona un rol...</option>
                                    {ROLES.map(r => (
                                        <option key={r.id} value={r.id}>{r.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="new-dependency">Dependencia</label>
                                <select
                                    id="new-dependency"
                                    name="dependencyId"
                                    value={newUserData.dependencyId}
                                    onChange={handleFormChange}
                                >
                                    <option value="">Sin dependencia</option>
                                    {DEPENDENCIES.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn-primary" disabled={submitting}>
                                {submitting ? "Creando..." : "Crear Usuario"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showEditForm && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowEditForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="section-header">
                            <h2>Editar Usuario</h2>
                            <button className="btn-icon" onClick={() => setShowEditForm(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <form className="auth-form" onSubmit={handleEditUser}>
                            <div className="user-info-edit">
                                <div className="avatar">{selectedUser.full_name?.[0]}</div>
                                <div>
                                    <div className="name">{selectedUser.full_name}</div>
                                    <div className="email">{selectedUser.email}</div>
                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="edit-role">Rol</label>
                                <select
                                    id="edit-role"
                                    name="roleId"
                                    value={editData.roleId}
                                    onChange={handleEditFormChange}
                                    required
                                >
                                    <option value="">Selecciona un rol...</option>
                                    {ROLES.map(r => (
                                        <option key={r.id} value={r.id}>{r.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="edit-dependency">Dependencia</label>
                                <select
                                    id="edit-dependency"
                                    name="dependencyId"
                                    value={editData.dependencyId}
                                    onChange={handleEditFormChange}
                                >
                                    <option value="">Sin dependencia</option>
                                    {DEPENDENCIES.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn-primary" disabled={submitting}>
                                {submitting ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showDetails && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowDetails(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="section-header">
                            <h2>Detalles del Usuario</h2>
                            <button className="btn-icon" onClick={() => setShowDetails(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="user-details">
                            <div className="detail-avatar">{selectedUser.full_name?.[0]}</div>
                            <div className="detail-row">
                                <span className="label">Nombre:</span>
                                <span className="value">{selectedUser.full_name}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Email:</span>
                                <span className="value">{selectedUser.email || "-"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Documento:</span>
                                <span className="value">{selectedUser.document_number || "-"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Rol:</span>
                                <span className={`role-badge ${selectedUser.roles?.name?.toLowerCase() || ''}`}>
                                    {selectedUser.roles?.name}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Dependencia:</span>
                                <span className="value">{selectedUser.dependencies?.name || "Sin dependencia"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Estado:</span>
                                <span className={`status-badge ${selectedUser.is_active ? "active" : "inactive"}`}>
                                    {selectedUser.is_active ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Última actualización:</span>
                                <span className="value">{new Date(selectedUser.updated_at).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18}/>
                    <input 
                    type="text"
                    placeholder="Buscar por nombre o documento..."
                    value={filters.search}
                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value}))} 
                    />
                </div>
                <select 
                value={filters.role}
                onChange={(e) => setFilters(f => ({ ...f, role: e.target.value}))}
                >
                    <option value="">Todos los roles</option>
                    {ROLES.map(r => (
                        <option key={r.id} value={r.name}>{r.label}</option>
                    ))}
                </select>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Dependencia</th>
                        <th>Estado</th>
                        <th>Última actualización</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="6"><LoadingSpinner message="Cargando usuarios..." /></td></tr>
                    ) : users.map(u => (
                        <tr key={u.id} className={!u.is_active ? "inactive" : ""}>
                            <td>
                                <div className="user-cell">
                                    <div className="avatar">{u.full_name?.[0]}</div>
                                    <div>
                                        <div className="name">{u.full_name}</div>
                                        <div className="email">{u.email || u.document_number}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className={`role-badge ${u.roles?.name?.toLowerCase() || ''}`}>
                                    {u.roles?.name}
                                </span>
                            </td>
                            <td>{u.dependencies?.name || "-"}</td>
                            <td>
                                <button
                                onClick={() => toggleUserStatus(u)}
                                className={`status-toggle ${u.is_active ? "active" : "inactive"}`}
                                >
                                    {u.is_active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                    {u.is_active ? "Activo" : "Inactivo"}
                                </button>
                            </td>
                            <td>{new Date(u.updated_at).toLocaleDateString()}</td>
                            <td className="actions-cell">
                                <div className="actions-menu-container">
                                    <button 
                                        className="btn-icon" 
                                        onClick={() => toggleMenu(u.id)}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {activeMenu === u.id && (
                                        <div className="actions-dropdown">
                                            <button onClick={() => openDetails(u)}>
                                                <Eye size={16} /> Ver detalles
                                            </button>
                                            <button onClick={() => openEditForm(u)}>
                                                <Edit size={16} /> Editar rol
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <span>Total: {pagination.total} usuarios</span>
                <div className="page-controls">
                    {Array.from({ length: pagination.totalPages}, (_, i) => (
                        <button
                        key={i + 1}
                        className={pagination.page === i + 1 ? 'active' : ''}
                        onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
