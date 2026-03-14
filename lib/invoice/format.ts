import { format, parseISO } from "date-fns";

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "dd/MM/yyyy");
  } catch {
    return dateString;
  }
}
