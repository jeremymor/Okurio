import type { LineItem } from "./types";

export function calculateSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

export function calculateDiscount(subtotal: number, discountRate: number): number {
  return subtotal * (discountRate / 100);
}

export function calculateTax(taxableAmount: number, taxRate: number): number {
  return taxableAmount * (taxRate / 100);
}

export function calculateTotal(items: LineItem[], discountRate: number, taxRate: number) {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscount(subtotal, discountRate);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = calculateTax(taxableAmount, taxRate);
  const total = taxableAmount + taxAmount;

  return { subtotal, discountAmount, taxableAmount, taxAmount, total };
}
