# Quick Reference - Invoice Generator

## TL;DR - Get Started

```bash
# 1. Run setup script
bash Setup_AI_Builder_Stack_pnpm.sh invoice-generator

# 2. Navigate to project
cd invoice-generator

# 3. Start building
pnpm dev
```

No API keys needed for MVP — it's all client-side.

---

## What Gets Installed

- Next.js 15 + TypeScript + Tailwind CSS
- Shadcn UI (12 components for invoice form)
- @react-pdf/renderer (PDF generation)
- React Hook Form + Zod (form validation)
- date-fns (date formatting)
- Git repository initialized

---

## Project Structure

```
invoice-generator/
├── app/
│   ├── page.tsx                    # Split-screen: form | preview
│   └── api/invoices/               # Future: agent API
├── components/
│   ├── ui/                         # Shadcn components
│   └── invoice/                    # Invoice-specific components
│       ├── invoice-form.tsx        # Left panel (multi-step form)
│       ├── invoice-preview.tsx     # Right panel (live preview)
│       ├── invoice-pdf.tsx         # PDF template
│       ├── company-step.tsx        # Step 1
│       ├── client-step.tsx         # Step 2
│       ├── items-step.tsx          # Step 3
│       └── payment-step.tsx        # Step 4
├── lib/invoice/
│   ├── types.ts                    # TypeScript types
│   ├── calculations.ts            # Math (subtotal, tax, total)
│   └── storage.ts                  # localStorage persistence
└── public/logos/                    # Company logos
```

---

## Key Libraries

| Library | Purpose | Docs |
|---------|---------|------|
| @react-pdf/renderer | Generate PDFs from React | https://react-pdf.org/ |
| react-hook-form | Form state management | https://react-hook-form.com/ |
| zod | Schema validation | https://zod.dev/ |
| shadcn/ui | UI components | https://ui.shadcn.com |
| date-fns | Date formatting | https://date-fns.org/ |

---

## Design Reference

Layout: Split-screen (like cryptoinvoice.new)
- Left: Multi-step form with "Next >" navigation
- Right: Live invoice preview on dotted background
- Invoice: White paper with header, FROM/TO, line items table, totals, payment footer

---

## Roadmap

**MVP**: Form + Preview + PDF Download (client-side only)
**Phase 2**: Supabase (save invoices) + Resend (email invoices)
**Phase 3**: API routes for agent/tool integration
