"use client";

import { UseFormReturn } from "react-hook-form";
import type { Invoice } from "@/lib/invoice/types";
import { FormRow } from "../ui/form-row";
import { LogoUpload } from "../ui/logo-upload";

interface CompanyStepProps {
  form: UseFormReturn<Invoice>;
}

export function CompanyStep({ form }: CompanyStepProps) {
  const { register, setValue, watch } = form;
  const logo = watch("from.logo");

  return (
    <div className="flex w-full flex-col">
      <h2 className="pb-3 text-2xl font-semibold tracking-[-0.42px]">
        Your Company
      </h2>
      <p className="pb-6 text-sm text-black/40">
        This info will be saved for future invoices.
      </p>

      <div className="flex items-center gap-3 border-b border-invoice pb-4">
        <LogoUpload
          value={logo}
          onChange={(v) => setValue("from.logo", v, { shouldDirty: true })}
        />
        <span className="text-sm text-black/40">
          {logo ? "Logo uploaded" : "Upload logo"}
        </span>
      </div>

      <FormRow label="Company Name" {...register("from.name")} placeholder="Acme Inc" />
      <FormRow label="Email" {...register("from.email")} placeholder="info@acme.com" type="email" />
      <FormRow label="Tax ID / VAT" {...register("from.taxId")} placeholder="GB123456789" />

      <h3 className="pb-2 pt-6 text-sm font-medium text-invoice-light">
        Address
      </h3>
      <FormRow label="Street" {...register("from.address.street")} placeholder="123 Main Street" />
      <FormRow label="City" {...register("from.address.city")} placeholder="London" />
      <FormRow label="State / Region" {...register("from.address.state")} placeholder="Greater London" />
      <FormRow label="Postal Code" {...register("from.address.zip")} placeholder="SW1A 1AA" />
      <FormRow label="Country" {...register("from.address.country")} placeholder="United Kingdom" />
    </div>
  );
}
