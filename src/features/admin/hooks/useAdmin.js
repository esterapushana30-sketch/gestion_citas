import { useState, useCallback } from 'react';
import { AdminRepository } from '../api/admin.repository';
import { useAuth } from '../../../providers/AuthProvider';
import { toast } from 'sonner';

export function useAdmin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [audLogs, setAudLogs] = useState([]);
  const [auditPagination, setAuditPagination] = useState({page: 1, totalPages: 1, total: 0 });
  const [config, setConfig] = useState(null);
  const [pagination, setPagination] = useState({page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);

  // Gestión de Usuarios
  const fetchUsers = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const result = await AdminRepository.getUsers({
        role: filters.role,
        search: filters.search,
        page: filters.page || 1,
        limit: 20
      });
      setUsers(result.users);
      setPagination({
        page: result.page,
        totalPages: result.totalPages,
        total: result.total
      });
    } catch {
      toast.error('Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (userId, { roleId, dependencyId, isActive }) => {
    try {
      await AdminRepository.updateUser(userId, {
        role_id: roleId,
        dependency_id: dependencyId,
        is_active: isActive
      }, user.id);

      toast.success('Usuario actualizado');
      await fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  }, [user, fetchUsers]);

  const createUser = useCallback(async (userData) => {
    try {
        await AdminRepository.createUser(userData, user.id);
        toast.success("Usuario creado exitosamente");
        await fetchUsers();
    }catch (err) {
        toast.error(err.message);
    }
  }, [user, fetchUsers]);

  // auditoria
  const fetchAuditLog = useCallback(async(filters = {}) => {
    setLoading(true);
    try {
      const result = await AdminRepository.getAuditLogs({
        action: filters.action,
        userId: filters.userId,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        page: filters.page || 1,
        limit: 50
      });
      setAudLogs(result.logs);
      setAuditPagination({
        page: filters.page || 1,
        totalPages: Math.ceil(result.total / 50),
        total: result.total
      });
    }catch {
      toast.error("Error cargando auditoría")
    }finally{
      setLoading(false);
    }
  }, []);

  // configuración
  const fetchConfig = useCallback(async () => {
    try{
        const data = await AdminRepository.getConfig();
        setConfig(data);
    }catch {
        toast.error("Error cargando configuración");
    }
  }, []);

  const updateConfig = useCallback(async (key, value) => {
    try {
      await AdminRepository.updateConfig(key, value, user.id);
      toast.success("Configuración actualizada");
      await fetchConfig();
    }catch (err) {
      toast.error(err.message);
    }
  }, [user, fetchConfig]);

  return {
    users,
    auditLogs: audLogs,
    auditPagination,
    config,
    pagination,
    loading,
    fetchUsers,
    updateUserRole,
    createUser,
    fetchAuditLogs: fetchAuditLog,
    fetchConfig,
    updateConfig
  };
}