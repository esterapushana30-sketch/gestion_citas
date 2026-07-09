import { supabase } from "../../lib/supabase";

/**
 * Obtener profiles por IDs (utilidad compartida entre repositories).
 * @param {string[]} ids - Array de IDs de profiles
 * @param {string} [selectFields="id, full_name, document_number"] - Campos a seleccionar
 * @returns {Promise<Object>} Mapa { id: profile }
 */
export async function fetchProfiles(ids, selectFields = "id, full_name, document_number") {
  if (!ids.length) return {};
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (!uniqueIds.length) return {};

  const { data, error } = await supabase
    .from("profiles")
    .select(selectFields)
    .in("id", uniqueIds);

  if (error) throw error;
  return (data || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
}
