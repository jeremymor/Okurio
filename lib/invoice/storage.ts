import type { Company, PaymentDetails } from "./types";

const KEYS = {
  company: "invoice-generator:company",
  payment: "invoice-generator:payment",
  counter: "invoice-generator:counter",
  currencies: "invoice-generator:currencies",
} as const;

function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setItem(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable
  }
}

export function loadCompany(): Company | null {
  return getItem<Company>(KEYS.company);
}

export function saveCompany(company: Company): void {
  setItem(KEYS.company, company);
}

export function loadPayment(): PaymentDetails | null {
  return getItem<PaymentDetails>(KEYS.payment);
}

export function savePayment(payment: PaymentDetails): void {
  setItem(KEYS.payment, payment);
}

export function loadCounter(): number {
  return getItem<number>(KEYS.counter) ?? 1;
}

export function saveCounter(counter: number): void {
  setItem(KEYS.counter, counter);
}

export function formatInvoiceNumber(counter: number): string {
  return `INV-${String(counter).padStart(3, "0")}`;
}

export function loadRecentCurrencies(): string[] {
  return getItem<string[]>(KEYS.currencies) ?? ["GBP"];
}

export function saveRecentCurrencies(currencies: string[]): void {
  setItem(KEYS.currencies, currencies);
}

export function addRecentCurrency(code: string): string[] {
  const recent = loadRecentCurrencies();
  const updated = [code, ...recent.filter((c) => c !== code)].slice(0, 4);
  saveRecentCurrencies(updated);
  return updated;
}
