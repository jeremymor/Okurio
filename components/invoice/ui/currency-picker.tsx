"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CURRENCIES, getCurrencyByCode } from "@/lib/invoice/currencies";
import { ChevronDown } from "lucide-react";

interface CurrencyPickerProps {
  value: string;
  recentCurrencies: string[];
  onChange: (code: string) => void;
}

export function CurrencyPicker({
  value,
  recentCurrencies,
  onChange,
}: CurrencyPickerProps) {
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="border-b border-invoice pb-3">
      <p className="mb-2 text-sm font-medium">Currency</p>
      <div className="flex flex-wrap gap-2">
        {recentCurrencies.map((code) => {
          const currency = getCurrencyByCode(code);
          if (!currency) return null;
          return (
            <button
              key={code}
              type="button"
              onClick={() => onChange(code)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                value === code
                  ? "border-accent bg-accent/10 text-accent font-medium"
                  : "border-invoice hover:border-black/20"
              )}
            >
              {currency.code}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 rounded-md border border-invoice px-3 py-1.5 text-sm hover:border-black/20"
        >
          More
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform",
              showAll && "rotate-180"
            )}
          />
        </button>
      </div>

      {showAll && (
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search currencies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 w-full rounded-md border border-invoice bg-transparent px-3 py-2 text-sm caret-accent focus:border-accent focus:outline-none"
          />
          <div className="max-h-48 overflow-y-auto rounded-md border border-invoice">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setShowAll(false);
                  setSearch("");
                }}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-black/[0.02]",
                  value === c.code && "bg-accent/5 font-medium text-accent"
                )}
              >
                <span>
                  {c.code} ({c.symbol})
                </span>
                <span className="text-black/40">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
