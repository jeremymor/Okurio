import type { Company, Invoice, LineItem, PaymentDetails } from "./types";

export function createEmptyCompany(): Company {
  return {
    name: "",
    email: "",
    logo: undefined,
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    taxId: "",
  };
}

export function createEmptyLineItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    price: 0,
    amount: 0,
  };
}

export function createEmptyPayment(): PaymentDetails {
  return {
    bankName: "",
    accountName: "",
    accountNumber: "",
    sortCode: "",
    iban: "",
    swift: "",
    instructions: "",
  };
}

export function createDefaultInvoice(
  invoiceNumber: string = "INV-001",
  from?: Company,
  payment?: PaymentDetails
): Invoice {
  return {
    invoiceNumber,
    issuedDate: "",
    dueDate: "",
    currency: "GBP",
    from: from ?? createEmptyCompany(),
    to: createEmptyCompany(),
    items: [createEmptyLineItem()],
    taxRate: 20,
    discountRate: 0,
    notes: "",
    terms: "",
    payment: payment ?? createEmptyPayment(),
  };
}
