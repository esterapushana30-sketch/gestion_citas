import { supabase } from "../../../lib/supabase";
import { fetchProfiles } from "../../../shared/utils/api";

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

    // 2. Esperar a que el trigger cree el perfil (polling con reintento)
    let profileExists = false;
    for (let attempt = 0; attempt < 5; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const { data: check } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', authData.user.id)
            .maybeSingle();
        if (check) { profileExists = true; break; }
    }
    if (!profileExists) {
        // El trigger podría no existir — crear el perfil manualmente como fallback
        await supabase.from('profiles').insert({ id: authData.user.id, full_name: fullName });
    }

    // 3. Actualizar el perfil con los datos correctos
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
    const profilesMap = await fetchProfiles(adminIds, "id, full_name, email");

    const enrichedLogs = data.map((log) => ({
        ...log,
        admin: profilesMap[log.user_id] || null,
    }));

    return { logs: enrichedLogs, total: count };
    }

    // Configuración: obtener y actualizar
    static async getConfig() {
        try {
            const { data, error } = await supabase
            .from('system_config')
            .select('key, value');

            if (error) {
                console.warn('Error cargando config, usando defaults:', error.message);
                return {};
            }
            return (data || []).reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {});
        } catch (err) {
            console.warn('getConfig falló, usando defaults:', err.message);
            return {};
        }
    }

    static async updateConfig(key, value, adminId) {
        // Buscar si ya existe
        let existing = null;
        try {
            const result = await supabase
            .from('system_config')
            .select('id, value')
            .eq('key', key)
            .maybeSingle();
            existing = result.data;
        } catch {
            // Ignorar errores de SELECT
        }

        let result;
        if (existing) {
            // Actualizar existente
            const { data, error } = await supabase
            .from('system_config')
            .update({
                value,
                updated_by: adminId,
                updated_at: new Date()
            })
            .eq('id', existing.id)
            .select()
            .single();

            if (error) throw error;
            result = { data, oldData: existing };
        } else {
            // Insertar nueva
            const { data, error } = await supabase
            .from('system_config')
            .insert({
                key,
                value,
                updated_by: adminId,
            })
            .select()
            .single();

            if (error) throw error;
            result = { data, oldData: null };
        }

        await this.logAction({
            userId: adminId,
            action: 'UPDATE_CONFIG',
            entityType: 'config',
            entityId: key,
            oldData: result.oldData,
            newData: result.data
        });

        return result.data;
    }

    // CITAS: Obtener todas las citas con filtros (para admin)
    static async getAppointments({ status, dependencyId, search, page = 1, limit = 20 }) {
        let query = supabase
            .from('appointments')
            .select(`
                *,
                dependencies (name, color)
            `, { count: 'exact' });

        if (status) query = query.eq('status', status);
        if (dependencyId) query = query.eq('dependency_id', dependencyId);
        if (search) {
            query = query.or(`reason.ilike.%${search}%,notes.ilike.%${search}%`);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('scheduled_date', { ascending: false })
            .order('scheduled_time', { ascending: false })
            .range(from, to);

        if (error) throw new Error(`Error fetching appointments: ${error.message}`);

        // Enriquecer con profiles (aprendiz y profesional)
        const profileIds = (data || []).flatMap(d => [d.user_id, d.professional_id]).filter(Boolean);
        let profilesMap = {};
        try {
            profilesMap = await fetchProfiles(profileIds, "id, full_name, document_number");
        } catch (err) {
            console.warn("No se pudieron cargar profiles:", err.message);
        }

        const enriched = (data || []).map(d => ({
            ...d,
            aprendiz: profilesMap[d.user_id] || null,
            professional: profilesMap[d.professional_id] || null,
        }));

        return {
            appointments: enriched,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
        };
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