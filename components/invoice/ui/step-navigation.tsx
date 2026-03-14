"use client";

import { cn } from "@/lib/utils";
import { STEP_NAMES, type FormStep } from "@/lib/invoice/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: FormStep;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  nextStepNumber?: FormStep;
  prevStepNumber?: FormStep;
}

export function StepNavigation({
  onNext,
  onBack,
  canGoBack,
  canGoNext,
  nextStepNumber,
  prevStepNumber,
}: StepNavigationProps) {
  return (
    <div className="mt-auto grid grid-cols-2 justify-between gap-3 py-8 text-sm invoice:pb-0 invoice:pt-4">
      {canGoBack && prevStepNumber ? (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "group flex flex-col items-start space-y-1 rounded-md px-3 py-2",
            "hover:bg-black/[0.02] focus:outline-none focus:ring-1.5 focus:ring-accent"
          )}
        >
          <span className="flex items-center text-black/60">
            <ChevronLeft className="mr-1 h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            Back
          </span>
          <span className="font-medium">{STEP_NAMES[prevStepNumber]}</span>
        </button>
      ) : (
        <div />
      )}
      {canGoNext && nextStepNumber ? (
        <button
          type="button"
          onClick={onNext}
          className={cn(
            "group flex flex-col items-end space-y-1 rounded-md px-3 py-2",
            "hover:bg-black/[0.02] focus:outline-none focus:ring-1.5 focus:ring-accent"
          )}
        >
          <span className="flex items-center text-black/60">
            Next
            <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="font-medium">{STEP_NAMES[nextStepNumber]}</span>
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
