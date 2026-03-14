"use client";

import { UseFormReturn } from "react-hook-form";
import type { Invoice } from "@/lib/invoice/types";
import { FormRow, FormRowTextarea } from "../ui/form-row";
import { Download, Copy } from "lucide-react";

interface PaymentStepProps {
  form: UseFormReturn<Invoice>;
  onDownloadPdf: () => void;
  onDuplicate: () => void;
  isGeneratingPdf: boolean;
}

export function PaymentStep({
  form,
  onDownloadPdf,
  onDuplicate,
  isGeneratingPdf,
}: PaymentStepProps) {
  const { register } = form;

  return (
    <div className="flex w-full flex-col">
      <h2 className="pb-3 text-2xl font-semibold tracking-[-0.42px]">
        Payment & Notes
      </h2>
      <p className="pb-6 text-sm text-black/40">
        Add payment details and any additional notes.
      </p>

      <h3 className="pb-2 text-sm font-medium text-invoice-light">
        Payment Details
      </h3>
      <FormRow label="Bank Name" {...register("payment.bankName")} placeholder="Barclays" />
      <FormRow label="Account Name" {...register("payment.accountName")} placeholder="Acme Inc" />
      <FormRow label="Account Number" {...register("payment.accountNumber")} placeholder="12345678" />
      <FormRow label="Sort Code" {...register("payment.sortCode")} placeholder="20-00-00" />
      <FormRow label="IBAN" {...register("payment.iban")} placeholder="GB29NWBK60161331926819" />
      <FormRow label="SWIFT / BIC" {...register("payment.swift")} placeholder="BARCGB22" />

      <div className="pt-4">
        <FormRowTextarea
          label="Instructions"
          {...register("payment.instructions")}
          placeholder="Additional payment instructions..."
        />
      </div>

      <h3 className="pb-2 pt-6 text-sm font-medium text-invoice-light">
        Notes & Terms
      </h3>
      <FormRowTextarea
        label="Notes"
        {...register("notes")}
        placeholder="Thank you for your business!"
      />
      <FormRowTextarea
        label="Terms"
        {...register("terms")}
        placeholder="Payment due within 30 days"
      />

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black py-3 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50 transition-colors"
        >
          <Download className="h-4 w-4" />
          {isGeneratingPdf ? "Generating..." : "Download PDF"}
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="flex items-center gap-2 rounded-lg border border-invoice px-4 py-3 text-sm font-medium hover:border-black/20 transition-colors"
        >
          <Copy className="h-4 w-4" />
          Duplicate
        </button>
      </div>
    </div>
  );
}
