import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(dateString, pattern = "PPP") {
  return format(parseISO(dateString), pattern, { locale: es });
}

export function formatDateTime(dateString) {
  return format(parseISO(dateString), "PPP 'a las' HH:mm", { locale: es });
}

export function formatDocumentNumber(num) {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "";
}
