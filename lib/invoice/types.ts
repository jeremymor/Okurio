export interface Company {
  name: string;
  email: string;
  logo?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  taxId?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface PaymentDetails {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  sortCode?: string;
  iban?: string;
  swift?: string;
  instructions?: string;
}

export interface Invoice {
  invoiceNumber: string;
  issuedDate: string;
  dueDate: string;
  currency: string;
  from: Company;
  to: Company;
  items: LineItem[];
  taxRate: number;
  discountRate: number;
  notes: string;
  terms: string;
  payment: PaymentDetails;
}

export type FormStep = 1 | 2 | 3 | 4 | 5;

export const STEP_NAMES: Record<FormStep, string> = {
  1: "Your Company",
  2: "Your Client",
  3: "Invoice Details",
  4: "Line Items",
  5: "Payment & Notes",
};
