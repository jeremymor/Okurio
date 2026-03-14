"use client";

import { UseFormReturn } from "react-hook-form";
import type { Invoice, FormStep } from "@/lib/invoice/types";
import { StepNavigation } from "./ui/step-navigation";
import { CompanyStep } from "./steps/company-step";
import { ClientStep } from "./steps/client-step";
import { DetailsStep } from "./steps/details-step";
import { ItemsStep } from "./steps/items-step";
import { PaymentStep } from "./steps/payment-step";

interface InvoiceFormProps {
  form: UseFormReturn<Invoice>;
  currentStep: FormStep;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  nextStepNumber?: FormStep;
  prevStepNumber?: FormStep;
  recentCurrencies: string[];
  onCurrencyChange: (code: string) => void;
  onDownloadPdf: () => void;
  onDuplicate: () => void;
  isGeneratingPdf: boolean;
}

export function InvoiceForm({
  form,
  currentStep,
  onNext,
  onBack,
  canGoBack,
  canGoNext,
  nextStepNumber,
  prevStepNumber,
  recentCurrencies,
  onCurrencyChange,
  onDownloadPdf,
  onDuplicate,
  isGeneratingPdf,
}: InvoiceFormProps) {
  return (
    <div className="flex min-h-full flex-col">
      {currentStep === 1 && <CompanyStep form={form} />}
      {currentStep === 2 && <ClientStep form={form} />}
      {currentStep === 3 && (
        <DetailsStep
          form={form}
          recentCurrencies={recentCurrencies}
          onCurrencyChange={onCurrencyChange}
        />
      )}
      {currentStep === 4 && <ItemsStep form={form} />}
      {currentStep === 5 && (
        <PaymentStep
          form={form}
          onDownloadPdf={onDownloadPdf}
          onDuplicate={onDuplicate}
          isGeneratingPdf={isGeneratingPdf}
        />
      )}

      <StepNavigation
        currentStep={currentStep}
        onNext={onNext}
        onBack={onBack}
        canGoBack={canGoBack}
        canGoNext={canGoNext}
        nextStepNumber={nextStepNumber}
        prevStepNumber={prevStepNumber}
      />
    </div>
  );
}
