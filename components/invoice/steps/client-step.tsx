"use client";

import { UseFormReturn } from "react-hook-form";
import type { Invoice } from "@/lib/invoice/types";
import { FormRow } from "../ui/form-row";

interface ClientStepProps {
  form: UseFormReturn<Invoice>;
}

export function ClientStep({ form }: ClientStepProps) {
  const { register } = form;

  return (
    <div className="flex w-full flex-col">
      <h2 className="pb-3 text-2xl font-semibold tracking-[-0.42px]">
        Your Client
      </h2>
      <p className="pb-6 text-sm text-black/40">
        Who is this invoice for?
      </p>

      <FormRow label="Client Name" {...register("to.name")} placeholder="Client Corp" />
      <FormRow label="Email" {...register("to.email")} placeholder="billing@client.com" type="email" />

      <h3 className="pb-2 pt-6 text-sm font-medium text-invoice-light">
        Address
      </h3>
      <FormRow label="Street" {...register("to.address.street")} placeholder="456 Business Ave" />
      <FormRow label="City" {...register("to.address.city")} placeholder="Manchester" />
      <FormRow label="State / Region" {...register("to.address.state")} placeholder="Greater Manchester" />
      <FormRow label="Postal Code" {...register("to.address.zip")} placeholder="M1 1AA" />
      <FormRow label="Country" {...register("to.address.country")} placeholder="United Kingdom" />
    </div>
  );
}
