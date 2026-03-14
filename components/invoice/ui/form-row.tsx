"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface FormRowProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FormRow = forwardRef<HTMLInputElement, FormRowProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label
        className={cn(
          "group flex h-[3.375rem] items-center justify-between",
          "border-b border-invoice transition-all",
          "focus-within:border-accent",
          "[&:hover:not(:focus-within)]:border-black/20",
          className
        )}
      >
        <p className="mr-2 whitespace-nowrap text-sm font-medium">{label}</p>
        <input
          ref={ref}
          className="h-full w-full bg-transparent text-right text-sm caret-accent focus-visible:outline-none"
          {...props}
        />
      </label>
    );
  }
);

FormRow.displayName = "FormRow";

interface FormRowTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const FormRowTextarea = forwardRef<
  HTMLTextAreaElement,
  FormRowTextareaProps
>(({ label, className, ...props }, ref) => {
  return (
    <label
      className={cn(
        "group flex min-h-[3.375rem] items-start justify-between py-3",
        "border-b border-invoice transition-all",
        "focus-within:border-accent",
        "[&:hover:not(:focus-within)]:border-black/20",
        className
      )}
    >
      <p className="mr-2 mt-0.5 whitespace-nowrap text-sm font-medium">
        {label}
      </p>
      <textarea
        ref={ref}
        className="h-full min-h-[60px] w-full resize-none bg-transparent text-right text-sm caret-accent focus-visible:outline-none"
        {...props}
      />
    </label>
  );
});

FormRowTextarea.displayName = "FormRowTextarea";
