"use client";

import type { Invoice, FormStep } from "@/lib/invoice/types";
import { InvoiceDocument } from "./invoice-document";

interface InvoicePreviewProps {
  invoice: Invoice;
  activeStep: FormStep;
}

export function InvoicePreview({ invoice, activeStep }: InvoicePreviewProps) {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center bg-page p-6 invoice:relative invoice:justify-center">
      {/* Decorative dot background */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,25,59,0.3) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Invoice card with responsive scaling */}
      <div className="relative z-10 origin-top scale-50 md:scale-[0.8] invoice:scale-100 invoice:origin-center">
        <InvoiceDocument invoice={invoice} activeStep={activeStep} />
      </div>
    </div>
  );
}
