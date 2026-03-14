"use client";

import type { Invoice, FormStep } from "@/lib/invoice/types";
import { calculateTotal } from "@/lib/invoice/calculations";
import { formatCurrency, formatDate } from "@/lib/invoice/format";
import { Visor } from "./ui/visor";

interface InvoiceDocumentProps {
  invoice: Invoice;
  activeStep: FormStep;
}

function Placeholder({ width, height = 16 }: { width: number; height?: number }) {
  return (
    <div
      className="rounded bg-black/[0.06]"
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}

function CompanyBlock({
  label,
  company,
}: {
  label: string;
  company: Invoice["from"];
}) {
  const hasData = company.name || company.email;

  return (
    <div className="p-8 py-6">
      <p className="pb-2.5 text-xxs font-semibold uppercase tracking-wider text-invoice-light">
        {label}
      </p>
      {company.logo ? (
        <img
          src={company.logo}
          alt="Logo"
          className="mb-4 h-[45px] w-[45px] rounded-full object-cover"
        />
      ) : (
        <div className="mb-4 h-[45px] w-[45px] rounded-full bg-black/[0.04]" />
      )}
      {hasData ? (
        <div className="space-y-1.5">
          <p className="text-xs font-medium">{company.name}</p>
          {company.email && (
            <p className="text-xs text-invoice-light">{company.email}</p>
          )}
          {company.address.street && (
            <p className="text-xs text-invoice-light">
              {company.address.street}
            </p>
          )}
          {(company.address.city || company.address.state) && (
            <p className="text-xs text-invoice-light">
              {[company.address.city, company.address.state]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
          {(company.address.zip || company.address.country) && (
            <p className="text-xs text-invoice-light">
              {[company.address.zip, company.address.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
          {company.taxId && (
            <p className="text-xs text-invoice-light">
              VAT: {company.taxId}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <Placeholder width={160} height={20} />
          <Placeholder width={140} />
          <Placeholder width={120} />
          <Placeholder width={80} />
          <Placeholder width={50} />
        </div>
      )}
    </div>
  );
}

export function InvoiceDocument({ invoice, activeStep }: InvoiceDocumentProps) {
  const { subtotal, discountAmount, taxAmount, total } = calculateTotal(
    invoice.items,
    invoice.discountRate,
    invoice.taxRate
  );
  const currency = invoice.currency;

  return (
    <div className="relative w-[612.25px] min-h-[866px] rounded-[14px] bg-white invoice-card-shadow flex flex-col overflow-hidden">
      {/* Section A: Header Bar */}
      <div className="relative max-h-[56px]">
        <Visor active={activeStep === 3} />
        <div className="flex items-center justify-between border-b border-invoice px-8 py-4">
          <div>
            <p className="text-xxs font-semibold uppercase tracking-wider text-invoice-light">
              Invoice No
            </p>
            <p className="text-xs font-medium text-invoice-dark">
              {invoice.invoiceNumber || "INV-001"}
            </p>
          </div>
          <div className="flex min-w-[44%] justify-end gap-6">
            <div>
              <p className="text-xxs font-semibold uppercase tracking-wider text-invoice-light">
                Issued
              </p>
              <p className="text-xs font-medium text-invoice-dark">
                {formatDate(invoice.issuedDate) || "—"}
              </p>
            </div>
            <div>
              <p className="text-xxs font-semibold uppercase tracking-wider text-invoice-light">
                Due Date
              </p>
              <p className="text-xs font-medium text-invoice-dark">
                {formatDate(invoice.dueDate) || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section B: FROM / TO */}
      <div className="relative">
        <Visor active={activeStep === 1 || activeStep === 2} />
        <div className="grid grid-cols-2 divide-x divide-invoice">
          <CompanyBlock label="From" company={invoice.from} />
          <CompanyBlock label="To" company={invoice.to} />
        </div>
      </div>

      {/* Section C: Line Items */}
      <div className="relative flex grow flex-col px-8 py-6">
        <Visor active={activeStep === 4} />
        {/* Header */}
        <div className="grid grid-cols-[1fr,85px,1fr,1fr] gap-2 pb-3">
          <p className="text-xxs font-semibold uppercase tracking-wider text-invoice-light">
            Description
          </p>
          <p className="text-xxs font-semibold uppercase tracking-wider text-invoice-light text-center">
            Qty
          </p>
          <p className="text-xxs font-semibold uppercase tracking-wider text-invoice-light text-right">
            Price
          </p>
          <p className="text-xxs font-semibold uppercase tracking-wider text-invoice-light text-right">
            Amount
          </p>
        </div>
        {/* Rows */}
        {invoice.items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr,85px,1fr,1fr] gap-2 min-h-[49px] items-center border-b border-invoice py-4"
          >
            <p className="text-xs font-medium text-invoice-dark">
              {item.description || "—"}
            </p>
            <p className="text-xs font-medium text-invoice-dark text-center">
              {item.quantity || 0}
            </p>
            <p className="text-xs font-medium text-invoice-dark text-right">
              {formatCurrency(item.price || 0, currency)}
            </p>
            <p className="text-xs font-medium text-invoice-dark text-right">
              {formatCurrency((item.quantity || 0) * (item.price || 0), currency)}
            </p>
          </div>
        ))}

        {/* Section D: Summary */}
        <div className="mt-auto pt-4">
          <div className="ml-auto w-[50%] space-y-1">
            <div className="flex justify-between py-2">
              <p className="text-xs font-medium text-invoice-light">Subtotal</p>
              <p className="text-xs font-medium text-invoice-dark">
                {formatCurrency(subtotal, currency)}
              </p>
            </div>
            {invoice.discountRate > 0 && (
              <div className="flex justify-between py-2">
                <p className="text-xs font-medium text-invoice-light">
                  Discount ({invoice.discountRate}%)
                </p>
                <p className="text-xs font-medium text-invoice-dark">
                  -{formatCurrency(discountAmount, currency)}
                </p>
              </div>
            )}
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-2">
                <p className="text-xs font-medium text-invoice-light">
                  VAT ({invoice.taxRate}%)
                </p>
                <p className="text-xs font-medium text-invoice-dark">
                  {formatCurrency(taxAmount, currency)}
                </p>
              </div>
            )}
            <div className="flex justify-between border-t border-invoice py-3">
              <p className="text-xs font-medium">Total</p>
              <p className="text-sm font-semibold">
                {formatCurrency(total, currency)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section E: Payment Footer */}
      <div className="relative min-h-[156px] border-t border-invoice">
        <Visor active={activeStep === 5} />
        <div className="grid grid-cols-2 divide-x divide-invoice h-full">
          <div className="p-8 py-6">
            <p className="pb-2.5 text-xxs font-semibold uppercase tracking-wider text-invoice-light">
              Payment Details
            </p>
            <div className="space-y-1">
              {invoice.payment.bankName && (
                <p className="text-xs font-medium text-invoice-dark">
                  {invoice.payment.bankName}
                </p>
              )}
              {invoice.payment.accountName && (
                <p className="text-xs text-invoice-light">
                  {invoice.payment.accountName}
                </p>
              )}
              {invoice.payment.accountNumber && (
                <p className="text-xs text-invoice-light">
                  Acc: {invoice.payment.accountNumber}
                </p>
              )}
              {invoice.payment.sortCode && (
                <p className="text-xs text-invoice-light">
                  Sort: {invoice.payment.sortCode}
                </p>
              )}
            </div>
          </div>
          <div className="p-8 py-6">
            <p className="pb-2.5 text-xxs font-semibold uppercase tracking-wider text-invoice-light">
              Instructions
            </p>
            <div className="space-y-1">
              {invoice.payment.iban && (
                <p className="text-xs text-invoice-light">
                  IBAN: {invoice.payment.iban}
                </p>
              )}
              {invoice.payment.swift && (
                <p className="text-xs text-invoice-light">
                  SWIFT: {invoice.payment.swift}
                </p>
              )}
              {invoice.payment.instructions && (
                <p className="text-xs text-invoice-light whitespace-pre-wrap">
                  {invoice.payment.instructions}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
