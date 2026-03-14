"use client";

import { UseFormReturn } from "react-hook-form";
import type { Invoice } from "@/lib/invoice/types";
import { FormRow } from "../ui/form-row";
import { CurrencyPicker } from "../ui/currency-picker";

interface DetailsStepProps {
  form: UseFormReturn<Invoice>;
  recentCurrencies: string[];
  onCurrencyChange: (code: string) => void;
}

export function DetailsStep({
  form,
  recentCurrencies,
  onCurrencyChange,
}: DetailsStepProps) {
  const { register, watch } = form;
  const currency = watch("currency");

  return (
    <div className="flex w-full flex-col">
      <h2 className="pb-3 text-2xl font-semibold tracking-[-0.42px]">
        Invoice Details
      </h2>
      <p className="pb-6 text-sm text-black/40">
        Set the invoice number, dates, and currency.
      </p>

      <FormRow
        label="Invoice Number"
        {...register("invoiceNumber")}
        placeholder="INV-001"
      />
      <FormRow
        label="Issue Date"
        {...register("issuedDate")}
        type="date"
      />
      <FormRow
        label="Due Date"
        {...register("dueDate")}
        type="date"
      />

      <div className="pt-4">
        <CurrencyPicker
          value={currency}
          recentCurrencies={recentCurrencies}
          onChange={onCurrencyChange}
        />
      </div>

      <div className="pt-4">
        <FormRow
          label="Tax Rate (%)"
          {...register("taxRate", { valueAsNumber: true })}
          type="number"
          placeholder="20"
          min="0"
          max="100"
          step="0.1"
        />
        <FormRow
          label="Discount (%)"
          {...register("discountRate", { valueAsNumber: true })}
          type="number"
          placeholder="0"
          min="0"
          max="100"
          step="0.1"
        />
      </div>
    </div>
  );
}
