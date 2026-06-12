import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { Shield, Edit2, Trash2, Plus, X, Save } from "lucide-react";
import { toast } from "sonner";

const INITIAL_ROLE = {
  name: "",
  description: "",
};

export function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState(INITIAL_ROLE);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      toast.error("Error cargando roles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("roles").insert({
        name: formData.name.toUpperCase().replace(/\s/g, "_"),
        description: formData.description,
      });

      if (error) throw error;

      toast.success("Rol creado exitosamente");
      setShowForm(false);
      setFormData(INITIAL_ROLE);
      fetchRoles();
    } catch (error) {
      toast.error(error.message || "Error creando rol");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("roles")
        .update({ description: formData.description })
        .eq("id", editingRole.id);

      if (error) throw error;

      toast.success("Rol actualizado exitosamente");
      setEditingRole(null);
      setFormData(INITIAL_ROLE);
      fetchRoles();
    } catch (error) {
      toast.error(error.message || "Error actualizando rol");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (roleId) => {
    if (!confirm("¿Estás seguro de eliminar este rol? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const { error } = await supabase.from("roles").delete().eq("id", roleId);

      if (error) throw error;

      toast.success("Rol eliminado exitosamente");
      fetchRoles();
    } catch (error) {
      toast.error(error.message || "Error eliminando rol");
    }
  };

  const startEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingRole(null);
    setFormData(INITIAL_ROLE);
  };

  const getRoleBadgeClass = (roleName) => {
    const classes = {
      SUPERADMIN: "role-superadmin",
      COORDINACION: "role-coordinacion",
      PSICOLOGIA: "role-psicologia",
      ENFERMERIA: "role-enfermeria",
      TRABAJO_SOCIAL: "role-trabajo-social",
      APRENDIZ: "role-aprendiz",
    };
    return classes[roleName] || "role-default";
  };

  return (
    <div className="admin-section">
      <header className="section-header">
        <h2>
          <Shield size={20} />
          Gestión de Roles
        </h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Nuevo Rol
        </button>
      </header>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="section-header">
              <h2>Crear Nuevo Rol</h2>
              <button className="btn-icon" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>
            <form className="auth-form" onSubmit={handleCreate}>
              <div className="field">
                <label htmlFor="role-name">Nombre del rol</label>
                <input
                  id="role-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ej: COORDINADOR"
                  required
                />
                <span className="field-hint">
                  Se guardará en mayúsculas y sin espacios
                </span>
              </div>
              <div className="field">
                <label htmlFor="role-description">Descripción</label>
                <textarea
                  id="role-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe las funciones de este rol..."
                  rows={3}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Creando..." : "Crear Rol"}
              </button>
            </form>
          </div>
        </div>
      )}

      {editingRole && (
        <div className="modal-overlay" onClick={cancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="section-header">
              <h2>Editar Rol: {editingRole.name}</h2>
              <button className="btn-icon" onClick={cancelEdit}>
                <X size={18} />
              </button>
            </div>
            <form className="auth-form" onSubmit={handleUpdate}>
              <div className="field">
                <label htmlFor="edit-role-name">Nombre</label>
                <input
                  id="edit-role-name"
                  type="text"
                  value={formData.name}
                  disabled
                  className="disabled"
                />
                <span className="field-hint">El nombre del rol no se puede cambiar</span>
              </div>
              <div className="field">
                <label htmlFor="edit-role-description">Descripción</label>
                <textarea
                  id="edit-role-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe las funciones de este rol..."
                  rows={3}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={submitting}>
                <Save size={16} />
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Cargando roles..." />
      ) : (
        <div className="roles-grid">
          {roles.map((role) => (
            <div key={role.id} className="role-card">
              <div className="role-header">
                <span className={`role-badge ${getRoleBadgeClass(role.name)}`}>
                  {role.name}
                </span>
                <span className="role-id">ID: {role.id}</span>
              </div>
              <p className="role-description">
                {role.description || "Sin descripción"}
              </p>
              <div className="role-actions">
                <button
                  className="btn-icon"
                  onClick={() => startEdit(role)}
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                {role.id > 6 && (
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => handleDelete(role.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
