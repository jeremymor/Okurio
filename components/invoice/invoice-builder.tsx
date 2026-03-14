"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { Invoice, FormStep } from "@/lib/invoice/types";
import { createDefaultInvoice } from "@/lib/invoice/defaults";
import {
  loadCompany,
  saveCompany,
  loadPayment,
  savePayment,
  loadCounter,
  saveCounter,
  formatInvoiceNumber,
  loadRecentCurrencies,
  addRecentCurrency,
} from "@/lib/invoice/storage";
import { generatePdf } from "@/lib/invoice/pdf-generate";
import { toast } from "sonner";

import { InvoiceForm } from "./invoice-form";
import { InvoicePreview } from "./invoice-preview";

export function InvoiceBuilder() {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [recentCurrencies, setRecentCurrencies] = useState<string[]>(["GBP"]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [mounted, setMounted] = useState(false);

  const form = useForm<Invoice>({
    defaultValues: createDefaultInvoice(),
  });

  const invoice = form.watch();

  // Load persisted data on mount
  useEffect(() => {
    const savedCompany = loadCompany();
    const savedPayment = loadPayment();
    const counter = loadCounter();
    const currencies = loadRecentCurrencies();

    const defaults = createDefaultInvoice(
      formatInvoiceNumber(counter),
      savedCompany ?? undefined,
      savedPayment ?? undefined
    );

    form.reset(defaults);
    setRecentCurrencies(currencies);

    // Auto-skip Step 1 if company info is saved
    if (savedCompany?.name) {
      setCurrentStep(2);
    }

    setMounted(true);
  }, [form]);

  const handleCurrencyChange = useCallback(
    (code: string) => {
      form.setValue("currency", code);
      const updated = addRecentCurrency(code);
      setRecentCurrencies(updated);
    },
    [form]
  );

  const getStepSequence = useCallback((): FormStep[] => {
    const savedCompany = loadCompany();
    if (savedCompany?.name) {
      return [2, 3, 4, 5];
    }
    return [1, 2, 3, 4, 5];
  }, []);

  const handleNext = useCallback(() => {
    const steps = getStepSequence();
    const idx = steps.indexOf(currentStep);

    // Save company info when leaving Step 1
    if (currentStep === 1) {
      const fromData = form.getValues("from");
      if (fromData.name) {
        saveCompany(fromData);
      }
    }

    // Save payment info when leaving Step 5
    if (currentStep === 5) {
      savePayment(form.getValues("payment"));
    }

    if (idx < steps.length - 1) {
      setCurrentStep(steps[idx + 1]);
    }
  }, [currentStep, form, getStepSequence]);

  const handleBack = useCallback(() => {
    const steps = getStepSequence();
    const idx = steps.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(steps[idx - 1]);
    }
  }, [currentStep, getStepSequence]);

  const handleDownloadPdf = useCallback(async () => {
    setIsGeneratingPdf(true);
    try {
      // Save payment before generating
      savePayment(form.getValues("payment"));

      const data = form.getValues();
      await generatePdf(data);

      // Increment counter
      const counter = loadCounter();
      saveCounter(counter + 1);

      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [form]);

  const handleDuplicate = useCallback(() => {
    const current = form.getValues();
    const counter = loadCounter();
    const newNumber = formatInvoiceNumber(counter);

    form.reset({
      ...current,
      invoiceNumber: newNumber,
      issuedDate: "",
      dueDate: "",
    });

    setCurrentStep(2);
    toast.success(`Duplicated! New invoice: ${newNumber}`);
  }, [form]);

  if (!mounted) {
    return (
      <main className="relative flex min-h-screen w-full flex-1">
        <div className="flex w-full items-center justify-center">
          <p className="text-sm text-black/40">Loading...</p>
        </div>
      </main>
    );
  }

  const steps = getStepSequence();
  const idx = steps.indexOf(currentStep);
  const canGoBack = idx > 0;
  const canGoNext = idx < steps.length - 1;
  const prevStep = canGoBack ? steps[idx - 1] : undefined;
  const nextStep = canGoNext ? steps[idx + 1] : undefined;

  return (
    <main className="relative flex min-h-screen w-full flex-1 flex-col invoice:flex-row overflow-y-auto">
      {/* Left Panel: Form */}
      <div className="w-full invoice:min-w-[502px] invoice:max-w-[30%] border-r border-black/[0.07] bg-page">
        <div className="flex h-full flex-1 justify-center p-6 invoice:p-12 bg-page">
          <div className="flex w-full max-w-[405px] flex-col">
            <InvoiceForm
              form={form}
              currentStep={currentStep}
              onNext={handleNext}
              onBack={handleBack}
              canGoBack={canGoBack}
              canGoNext={canGoNext}
              nextStepNumber={nextStep}
              prevStepNumber={prevStep}
              recentCurrencies={recentCurrencies}
              onCurrencyChange={handleCurrencyChange}
              onDownloadPdf={handleDownloadPdf}
              onDuplicate={handleDuplicate}
              isGeneratingPdf={isGeneratingPdf}
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <InvoicePreview invoice={invoice} activeStep={currentStep} />
    </main>
  );
}
