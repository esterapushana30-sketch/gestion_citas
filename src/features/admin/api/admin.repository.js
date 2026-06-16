import { supabase } from "../../../lib/supabase";

// Helper: Obtener profiles por IDs
async function fetchProfiles(ids) {
  if (!ids.length) return {};
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (!uniqueIds.length) return {};

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", uniqueIds);

  if (error) throw error;
  return (data || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
}

export class AdminRepository {

  // USUARIOS: Listar con filtros y paginación
  static async getUsers({ role, status, search, page = 1, limit = 20 }) {
    let query = supabase
      .from('profiles')
      .select(`
        *,
        roles (name, description),
        dependencies (name)
      `, { count: 'exact' });

    if (role) query = query.eq('roles.name', role);
    if (status !== undefined) query = query.eq('is_active', status);
    if (search) {
        query = query.or(`full_name.ilike.%${search}%,document_number.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw new Error(`Error fetching users: ${error.message}`);
    return { users: data, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  // USUARIOS: Actualizar rol, dependencia o estado
  static async updateUser(userId, updates, adminId) {
    // 1. Obtener datos actuales para auditoría
    const { data: oldData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // 2. Aplicar cambios
    const { data: newData, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // 3. Registrar en auditoria
    await this.logAction({
        userId: adminId,
        action: "UPDATE_USER",
        entityType: "user",
        entityId: userId,
        oldData,
        newData
    });

    return newData;
  }

    // USUARIOS: Crear nuevo usuario (invitación)
    static async createUser({ email, password, fullName, roleId, dependencyId }, adminId) {
    // 1. Crear en auth.users (el trigger crea el perfil automáticamente)
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName },
        },
    });

    if (authError) {
        if (authError.message.includes("Database error")) {
            throw new Error("Error al crear el usuario. Verifica que el email no esté registrado.");
        }
        throw authError;
    }
    if (!authData.user) throw new Error("No se pudo crear el usuario");

    // 2. Esperar un momento para que el trigger cree el perfil
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 3. Actualizar el perfil creado por el trigger con los datos correctos
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            role_id: roleId,
            dependency_id: dependencyId,
        })
        .eq('id', authData.user.id);

    if (updateError) throw updateError;

    // 4. Obtener el perfil completo
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

    if (fetchError) throw fetchError;

    // 5. Auditar
    await this.logAction({
        userId: adminId,
        action: 'CREATE_USER',
        entityType: 'user',
        entityId: authData.user.id,
        newData: profile
    });

    return profile;
    }

    // AUDITORÍA: Obtener logs con filtros
    static async getAuditLogs({ action, userId, dateFrom, dateTo, page = 1, limit = 50 }) {
    let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' });

    if (action) query = query.eq('action', action);
    if (userId) query = query.eq('user_id', userId);
    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo) query = query.lte('created_at', dateTo);

    const from = (page - 1) * limit;
    const { data, error, count } = await query
    .order('created_at', { ascending: false})
    .range(from, from + limit - 1);

    if (error) throw error;

    // Enriquecer con profiles
    const adminIds = data.map((log) => log.user_id).filter(Boolean);
    const profilesMap = await fetchProfiles(adminIds);

    const enrichedLogs = data.map((log) => ({
        ...log,
        admin: profilesMap[log.user_id] || null,
    }));

    return { logs: enrichedLogs, total: count };
    }

    // Configuración: obtener y actualizar
    static async getConfig() {
        const { data, error } = await supabase
        .from('system_config')
        .select('*');

        if (error) throw error;
        return data.reduce((acc, item) => ({ ...acc, [item.key]: item.value}), {});
    }

    static async updateConfig(key, value, adminId) {
        const { data: oldConfig } = await supabase
        .from('system_config')
        .select('*')
        .eq('key', key)
        .single();

        const { data, error } = await supabase
        .from('system_config')
        .update({
            value,
            update_by: adminId,
            updated_at: new Date()
        })
        .eq('key', key)
        .select()
        .single();

        if (error) throw error;

        await this.logAction({
            userId: adminId,
            action: 'UPDATE_CONFIG',
            entityType: 'config',
            entityId: key,
            oldData: oldConfig,
            newData: data
        });

        return data;
    }

    // Helper: Registrar accion en auditoria
    static async logAction({ userId, action, entityType, entityId, oldData, newData}) {
        // Obtener IP y User-Agent del navegador
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;

        await supabase.from('audit_logs').insert({
            user_id: userId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            old_data: oldData,
            new_data: newData,
            user_agent: userAgent
        });
    }
}