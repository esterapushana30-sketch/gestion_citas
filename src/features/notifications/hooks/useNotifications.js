import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { supabase } from "../../../lib/supabase";
import {
  Bell,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const NOTIFICATION_ICONS = {
  appointment_created: { icon: Calendar, color: "#3b82f6" },
  appointment_confirmed: { icon: CheckCircle, color: "#22c55e" },
  appointment_cancelled: { icon: XCircle, color: "#ef4444" },
  appointment_rescheduled: { icon: Clock, color: "#f59e0b" },
  appointment_completed: { icon: CheckCircle, color: "#22c55e" },
  no_show: { icon: AlertTriangle, color: "#f97316" },
};

function getNotificationType(apt) {
  if (apt.status === "cancelled" && apt.notes === "No asistió") return "no_show";
  if (apt.status === "rescheduled") return "appointment_rescheduled";
  if (apt.status === "cancelled") return "appointment_cancelled";
  if (apt.status === "completed") return "appointment_completed";
  if (apt.status === "confirmed") return "appointment_confirmed";
  return "appointment_created";
}

function getTitle(type, apt) {
  const depName = apt.dependencies?.name || "";
  const userName = apt.userName || "";
  const prefix = userName ? `${userName} - ` : "";
  switch (type) {
    case "appointment_created":
      return `${prefix}Nueva cita en ${depName}`;
    case "appointment_confirmed":
      return `${prefix}Cita confirmada en ${depName}`;
    case "appointment_cancelled":
      return `${prefix}Cita cancelada en ${depName}`;
    case "appointment_rescheduled":
      return `${prefix}Cita reprogramada en ${depName}`;
    case "appointment_completed":
      return `${prefix}Cita completada en ${depName}`;
    case "no_show":
      return `${prefix}No asistencia en ${depName}`;
    default:
      return `${prefix}Actualización en ${depName}`;
  }
}

function getMessage(type, apt) {
  const date = apt.scheduled_date;
  const time = apt.scheduled_time;
  switch (type) {
    case "appointment_created":
      return `Programada para el ${date} a las ${time}`;
    case "appointment_confirmed":
      return `Tu cita del ${date} a las ${time} fue confirmada`;
    case "appointment_cancelled":
      return `La cita del ${date} a las ${time} fue cancelada`;
    case "appointment_rescheduled":
      return `La cita fue reprogramada para el ${date} a las ${time}`;
    case "appointment_completed":
      return `La atención del ${date} fue completada`;
    case "no_show":
      return `El aprendiz no asistió a la cita del ${date}`;
    default:
      return `Estado actualizado: ${apt.status}`;
  }
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*, dependencies (name, color)")
        .or(`user_id.eq.${user.id},professional_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const userIds = [...new Set(
        (appointments || []).flatMap((apt) => [apt.user_id, apt.professional_id]).filter(Boolean),
      )];
      let profilesMap = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);
        profilesMap = (profiles || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
      }

      const notifs = (appointments || []).map((apt) => {
        const type = getNotificationType(apt);
        const config = NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.appointment_created;
        const Icon = config.icon;
        const userName = profilesMap[apt.user_id]?.full_name || "Usuario";

        return {
          id: apt.id,
          type,
          title: getTitle(type, { ...apt, userName }),
          message: getMessage(type, apt),
          dependency: apt.dependencies?.name,
          dependencyColor: apt.dependencies?.color,
          date: apt.created_at,
          read: false,
          Icon,
          iconColor: config.color,
        };
      });

      setNotifications(notifs);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    const subscription = supabase
      .channel("appointments-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "appointments",
          filter: `user_id=eq.${user.id},professional_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchNotifications]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return <div>Cargando notificaciones...</div>;
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
  };
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*, dependencies (name, color)")
        .or(`user_id.eq.${user.id},professional_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const userIds = [...new Set(
        (appointments || []).flatMap((apt) => [apt.user_id, apt.professional_id]).filter(Boolean),
      )];
      let profilesMap = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);
        profilesMap = (profiles || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
      }

      const notifs = (appointments || []).map((apt) => {
        const type = getNotificationType(apt);
        const config = NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.appointment_created;
        const Icon = config.icon;
        const userName = profilesMap[apt.user_id]?.full_name || "Usuario";

        return {
          id: apt.id,
          type,
          title: getTitle(type, { ...apt, userName }),
          message: getMessage(type, apt),
          dependency: apt.dependencies?.name,
          dependencyColor: apt.dependencies?.color,
          date: apt.created_at,
          read: false,
          Icon,
          iconColor: config.color,
        };
      });

      setNotifications(notifs);
      const unread = notifs.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    const subscription = supabase
      .channel("appointments-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "appointments",
          filter: `user_id=eq.${user.id},professional_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchNotifications]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
  };
}