"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import type { Invoice } from "@/lib/invoice/types";
import { createEmptyLineItem } from "@/lib/invoice/defaults";
import { formatCurrency } from "@/lib/invoice/format";
import { Plus, Trash2 } from "lucide-react";

interface ItemsStepProps {
  form: UseFormReturn<Invoice>;
}

export function ItemsStep({ form }: ItemsStepProps) {
  const { register, watch, control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const currency = watch("currency");
  const items = watch("items");

  return (
    <div className="flex w-full flex-col">
      <h2 className="pb-3 text-2xl font-semibold tracking-[-0.42px]">
        Line Items
      </h2>
      <p className="pb-6 text-sm text-black/40">
        Add the services or products for this invoice.
      </p>

      <div className="space-y-3">
        {fields.map((field, index) => {
          const qty = items?.[index]?.quantity ?? 0;
          const price = items?.[index]?.price ?? 0;
          const amount = qty * price;

          return (
            <div
              key={field.id}
              className="rounded-lg border border-invoice p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-invoice-light">
                    Description
                  </label>
                  <input
                    {...register(`items.${index}.description`)}
                    placeholder="Web development services"
                    className="w-full bg-transparent text-sm caret-accent focus:outline-none"
                  />
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-4 text-black/30 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-invoice-light">
                    Quantity
                  </label>
                  <input
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1"
                    className="w-full bg-transparent text-sm caret-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-invoice-light">
                    Price
                  </label>
                  <input
                    {...register(`items.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-transparent text-sm caret-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-invoice-light">
                    Amount
                  </label>
                  <p className="text-sm font-medium">
                    {formatCurrency(amount, currency)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append(createEmptyLineItem())}
        className="mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-accent hover:bg-accent/5 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Item
      </button>
    </div>
  );
}
