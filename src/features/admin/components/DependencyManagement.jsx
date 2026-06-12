import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { Briefcase, Edit2, Trash2, Plus, X, Save, Palette } from "lucide-react";
import { toast } from "sonner";

const INITIAL_DEPENDENCY = {
  name: "",
  color: "#39A900",
};

const PRESET_COLORS = [
  "#39A900",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#14b8a6",
  "#f43f5e",
  "#6366f1",
];

export function DependencyManagement() {
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDependency, setEditingDependency] = useState(null);
  const [formData, setFormData] = useState(INITIAL_DEPENDENCY);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDependencies();
  }, []);

  const fetchDependencies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("dependencies")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setDependencies(data || []);
    } catch (error) {
      toast.error("Error cargando dependencias");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("dependencies").insert({
        name: formData.name,
        color: formData.color,
      });

      if (error) throw error;

      toast.success("Dependencia creada exitosamente");
      setShowForm(false);
      setFormData(INITIAL_DEPENDENCY);
      fetchDependencies();
    } catch (error) {
      toast.error(error.message || "Error creando dependencia");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("dependencies")
        .update({ name: formData.name, color: formData.color })
        .eq("id", editingDependency.id);

      if (error) throw error;

      toast.success("Dependencia actualizada exitosamente");
      setEditingDependency(null);
      setFormData(INITIAL_DEPENDENCY);
      fetchDependencies();
    } catch (error) {
      toast.error(error.message || "Error actualizando dependencia");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dependencyId) => {
    if (
      !confirm(
        "¿Estás seguro de eliminar esta dependencia? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("dependencies")
        .delete()
        .eq("id", dependencyId);

      if (error) throw error;

      toast.success("Dependencia eliminada exitosamente");
      fetchDependencies();
    } catch (error) {
      toast.error(error.message || "Error eliminando dependencia");
    }
  };

  const startEdit = (dependency) => {
    setEditingDependency(dependency);
    setFormData({
      name: dependency.name,
      color: dependency.color || "#39A900",
    });
  };

  const cancelEdit = () => {
    setEditingDependency(null);
    setFormData(INITIAL_DEPENDENCY);
  };

  return (
    <div className="admin-section">
      <header className="section-header">
        <h2>
          <Briefcase size={20} />
          Gestión de Dependencias
        </h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Nueva Dependencia
        </button>
      </header>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="section-header">
              <h2>Crear Nueva Dependencia</h2>
              <button className="btn-icon" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>
            <form className="auth-form" onSubmit={handleCreate}>
              <div className="field">
                <label htmlFor="dep-name">Nombre de la dependencia</label>
                <input
                  id="dep-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ej: Nutrición"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="dep-color">Color identificativo</label>
                <div className="color-picker">
                  <input
                    id="dep-color"
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, color: e.target.value }))
                    }
                  />
                  <div className="preset-colors">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-preset ${formData.color === color ? "active" : ""}`}
                        style={{ background: color }}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, color }))
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Creando..." : "Crear Dependencia"}
              </button>
            </form>
          </div>
        </div>
      )}

      {editingDependency && (
        <div className="modal-overlay" onClick={cancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="section-header">
              <h2>Editar Dependencia</h2>
              <button className="btn-icon" onClick={cancelEdit}>
                <X size={18} />
              </button>
            </div>
            <form className="auth-form" onSubmit={handleUpdate}>
              <div className="field">
                <label htmlFor="edit-dep-name">Nombre</label>
                <input
                  id="edit-dep-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="edit-dep-color">Color identificativo</label>
                <div className="color-picker">
                  <input
                    id="edit-dep-color"
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, color: e.target.value }))
                    }
                  />
                  <div className="preset-colors">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-preset ${formData.color === color ? "active" : ""}`}
                        style={{ background: color }}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, color }))
                        }
                      />
                    ))}
                  </div>
                </div>
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
        <LoadingSpinner message="Cargando dependencias..." />
      ) : (
        <div className="dependencies-grid">
          {dependencies.map((dep) => (
            <div
              key={dep.id}
              className="dependency-card"
              style={{ borderTop: `4px solid ${dep.color || "#39A900"}` }}
            >
              <div className="dep-header">
                <div
                  className="dep-color"
                  style={{ background: dep.color || "#39A900" }}
                />
                <div className="dep-info">
                  <h3>{dep.name}</h3>
                  <span className="dep-id">ID: {dep.id}</span>
                </div>
              </div>
              <div className="dep-actions">
                <button
                  className="btn-icon"
                  onClick={() => startEdit(dep)}
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="btn-icon btn-danger"
                  onClick={() => handleDelete(dep.id)}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
