# Product Requirements Document — Invoice Generator

## 1. Overview

**Product**: Invoice Generator
**Type**: Web application (client-side first, server-side later)
**Goal**: A clean, modern invoice maker where a user sets up their business info, fills in a form, and downloads a PDF. Designed for future integration with agents and external tools.

**Design reference**: Inspired by the layout and UX of cryptoinvoice.new (without the crypto/web3 features). Split-screen form + live preview.

**Target users**: Small agency team (UK/Europe-based), invoicing domestic and international clients. Potential to become a product for others later.

**Business type**: Agency — mixed services, international clients, multiple currencies.

**Base country**: UK/Europe — default currency GBP, default VAT 20%, date format DD/MM/YYYY.

---

## 2. User Stories

### MVP (Phase 1)
- As a user, I can enter my company details (name, logo, address, tax ID) and have them saved for reuse.
- As a user, my company info and payment details auto-fill on repeat visits — I skip straight to the client step.
- As a user, I can enter my client's billing details.
- As a user, I can add line items (description, quantity, unit price) and see amounts calculated automatically.
- As a user, I can set invoice number (auto-incremented as INV-001), issue date, and due date.
- As a user, I can select a currency for the invoice from a quick-pick of recently used currencies or a full dropdown.
- As a user, I can set a tax percentage (default 20% VAT) and see a tax breakdown line on the invoice.
- As a user, I can set a discount percentage and see it reflected in the total.
- As a user, I can add payment details (bank name, account, sort code, IBAN, SWIFT) plus free-text instructions.
- As a user, I can add notes and terms to the invoice.
- As a user, I can see a live preview of the invoice that updates as I type.
- As a user, I can download the invoice as a PDF.
- As a user, I can duplicate the current invoice to create a new one with bumped invoice number and cleared dates.
- As a user, my company info and payment details persist across sessions (localStorage).

### Phase 2
- As a user, I can save invoices to a database (Supabase).
- As a user, I can browse my invoice history.
- As a user, I can manage a client directory.
- As a user, I can email an invoice directly to a client (Resend).
- As a user, I can pick an accent color to match my brand.
- As a user, I can save named invoice templates (e.g. "Monthly retainer - Client X").
- As a user, I can integrate with accounting software (Xero, QuickBooks).

### Phase 3
- As a developer/agent, I can create an invoice via API (`POST /api/invoices`).
- As a developer/agent, I can retrieve a PDF via API (`GET /api/invoices/:id/pdf`).
- As a user, I can connect the invoice generator with automation tools (Make.com, n8n).
- As a user, I can use Claude or other AI agents to generate invoices from natural language.

---

## 3. User Flow

### First-time user:
```
[Open app] → [Step 1: Your company] → [Step 2: Your client] → [Step 3: Invoice details (number, dates, currency)] → [Step 4: Line items] → [Step 5: Payment & notes] → [Download PDF]
```

### Returning user (company info saved):
```
[Open app] → [Step 2: Your client] → [Step 3: Invoice details] → [Step 4: Line items] → [Step 5: Payment & notes] → [Download PDF]
```

- Company info and payment details are pre-filled from localStorage — Step 1 is auto-skipped.
- Each step has a "Next >" button to advance and a "< Back" button to go back.
- The right-side preview updates live at every step.
- The "Download PDF" button appears on the final step (and optionally in the preview panel).
- "Duplicate invoice" button available after PDF download — copies all fields, bumps invoice number, clears dates.

---

## 4. Pages & Routes

| Route | Description |
|---|---|
| `/` | Main invoice page (split-screen: form + preview) |
| `/api/invoices` | Future: POST to create, GET to list (Phase 3) |
| `/api/invoices/[id]/pdf` | Future: GET to download PDF (Phase 3) |

MVP is a single-page app. All logic runs client-side.

---

## 5. Data Model

### Invoice

```typescript
interface Invoice {
  invoiceNumber: string        // e.g. "INV-001", auto-incremented
  issuedDate: string           // ISO date
  dueDate: string              // ISO date
  currency: string             // "GBP" default, user-selectable

  from: Company                // Sender (user's company)
  to: Company                  // Recipient (client)

  items: LineItem[]            // Line items (qty x price)

  taxRate: number              // Tax/VAT percentage (0-100), default 20
  discountRate: number         // Discount percentage (0-100), default 0

  notes: string                // Free text notes
  terms: string                // Payment terms

  payment: PaymentDetails      // Bank/payment info
}

interface Company {
  name: string
  email: string
  logo?: string                // Base64 data URL (auto-resized on upload)
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  taxId?: string               // VAT number for UK/EU
}

interface LineItem {
  id: string                   // UUID for React keys
  description: string
  quantity: number
  price: number                // Unit price
  amount: number               // Computed: quantity * price
}

interface PaymentDetails {
  bankName?: string
  accountName?: string
  accountNumber?: string
  sortCode?: string            // UK sort code
  iban?: string                // International
  swift?: string               // International
  instructions?: string        // Free text fallback
}
```

### Calculations

```typescript
subtotal = sum(items.map(i => i.quantity * i.price))
discountAmount = subtotal * (discountRate / 100)
taxableAmount = subtotal - discountAmount
taxAmount = taxableAmount * (taxRate / 100)
total = taxableAmount + taxAmount
```

### Invoice Preview Summary Display

```
Subtotal           £1,000.00
Discount (10%)      -£100.00
VAT (20%)            £180.00
────────────────────────────
Total              £1,080.00
```

---

## 6. Component Architecture

```
app/
  layout.tsx                    # Root layout, Inter font, metadata
  page.tsx                      # Main page — renders InvoiceBuilder

components/
  invoice/
    invoice-builder.tsx         # Top-level: manages state, renders form + preview
    invoice-form.tsx            # Left panel: multi-step form container
    invoice-preview.tsx         # Right panel: live preview wrapper (dotted bg)
    invoice-document.tsx        # The invoice "paper" shown in preview
    invoice-pdf.tsx             # @react-pdf/renderer PDF template
    steps/
      company-step.tsx          # Step 1: Your company (auto-skipped if saved)
      client-step.tsx           # Step 2: Your client
      details-step.tsx          # Step 3: Invoice #, dates, currency
      items-step.tsx            # Step 4: Line items
      payment-step.tsx          # Step 5: Payment details, notes, terms, download
    ui/
      form-row.tsx              # Reusable label-left / input-right row (54px height)
      step-navigation.tsx       # Next/Back buttons
      visor.tsx                 # Animated blue corner brackets on preview
      logo-upload.tsx           # Logo upload button (circular, 45x45 display)
      currency-picker.tsx       # Recent currencies + full dropdown

  ui/                           # Shadcn components
    button.tsx
    card.tsx
    input.tsx
    label.tsx
    select.tsx
    separator.tsx
    table.tsx
    textarea.tsx
    dialog.tsx
    form.tsx
    badge.tsx
    sonner.tsx (toast)

lib/
  invoice/
    types.ts                    # TypeScript interfaces (Invoice, Company, etc.)
    defaults.ts                 # Default invoice values, initial state
    calculations.ts             # Subtotal, discount, tax, total
    storage.ts                  # localStorage read/write for company info + payment
    format.ts                   # Currency formatting, date formatting (DD/MM/YYYY)
    currencies.ts               # Currency list + recently-used tracking
    pdf-generate.ts             # Wrapper to trigger client-side PDF download
  utils.ts                      # cn() helper, general utilities
```

---

## 7. UI/UX Design Specification

### 7.1 Layout

- **Split-screen**: Form panel (left) + Preview panel (right)
- Form panel: `min-width: 502px`, `max-width: 30%` on desktop
- Preview panel: fills remaining space
- **Desktop-first**: Focus on the split-screen desktop experience
- **Basic mobile**: Simple stacked layout (form above preview), not the fancy bottom-sheet
- Custom Tailwind breakpoint `invoice:` (~1024px+) switches from stacked to side-by-side

### 7.2 Color Palette

| Token | Value | Usage |
|---|---|---|
| `page-bg` | `#FDFDFD` | Page and form background |
| `card-bg` | `#FFFFFF` | Invoice card background |
| `accent` | `#0094FF` | Focus rings, caret, active visor brackets |
| `text-primary` | `#000000` | Main text |
| `text-muted` | `black/60` | Secondary text, placeholders |
| `text-invoice-light` | `rgba(0,25,59,0.4)` | Invoice section labels (INVOICE NO, FROM, etc.) |
| `text-invoice-dark` | `rgba(0,25,59,0.85)` | Invoice values |
| `border-invoice` | `rgba(0,25,59,0.08)` | Invoice internal borders |
| `border-form` | `black/[0.07]` | Form panel right border |
| `border-hover` | `black/20` | Form row border on hover |
| `logo-bg` | `#FAFAFA` | Logo upload button background |
| `logo-icon` | `#B2B2B2` | Logo upload plus icon |
| `step-pill-bg` | `#1A1A1A` | Step indicator pill background |
| `step-badge-bg` | `#494949` | Step number circle |

### 7.3 Typography

- **Font family**: Inter (or system sans-serif fallback)
- **Sizes**:
  - Form title (h2): `text-2xl` (24px), `font-semibold`, `tracking-[-0.42px]`
  - Section header (h3): `text-sm` (14px), `font-medium`
  - Form labels: `text-sm` (14px), `font-medium`
  - Form inputs: `text-sm` (14px), right-aligned
  - Invoice section labels: `text-xxs` (~10px), `font-semibold`, `uppercase`, `tracking-wider`
  - Invoice values: `text-xs` (12px), `font-medium`
  - Powered-by: `text-xxxs` (~8px)

### 7.4 Form Row Component

Each form field follows this pattern:
- Height: `54px` (3.375rem)
- Layout: flex, items-center, justify-between
- Label: left-aligned, `text-sm font-medium`
- Input: right-aligned, `text-sm`, transparent background
- Border: bottom only, light gray (`border-invoice`)
- Focus: border becomes `#0094FF`
- Hover (not focused): border becomes `black/20`
- Caret color: `#0094FF`

### 7.5 Invoice Preview Card

- Dimensions: `612.25px x 866px` (A4-like proportions)
- Border radius: `14px`
- Shadow: Layered box-shadow (see DESIGN_SYSTEM.md)
- Background: white
- Sections top-to-bottom:
  1. **Header bar** (56px): Invoice No | Issued | Due Date
  2. **FROM / TO** (2-column grid): Company details with logo
  3. **Line items** (grows): Description | Qty | Price | Amount table
  4. **Summary**: Subtotal, Discount, VAT, Total (with breakdown)
  5. **Payment footer** (156px): Payment Details | Instructions

### 7.6 Active Section Indicator ("Visor")

- Animated blue corner brackets highlighting the active invoice section
- Synced with current form step

### 7.7 Step Navigation

- Stepped form with auto-skip (skip company step if saved)
- Bottom of form panel: Back (left) | Next (right)
- "Next >" shows destination step name
- Arrow icon animates right on hover

### 7.8 Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| Mobile (default) | Stacked: form on top, preview below (basic) |
| `invoice` (1024px) | Side-by-side split-screen (primary experience) |

---

## 8. Tech Stack

### MVP Dependencies

| Package | Purpose |
|---|---|
| `next` (15.x) | Framework |
| `react`, `react-dom` | UI |
| `typescript` | Type safety |
| `tailwindcss` | Styling |
| `@react-pdf/renderer` | Client-side PDF generation |
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Zod integration with react-hook-form |
| `zod` | Schema validation |
| `date-fns` | Date formatting |
| `sonner` | Toast notifications |
| `lucide-react` | Icons |
| Shadcn UI components | button, card, input, label, select, separator, table, textarea, dialog, form, badge |

### Future Dependencies

| Package | Purpose | Phase |
|---|---|---|
| `@supabase/supabase-js` | Database | 2 |
| `@supabase/ssr` | Server-side Supabase | 2 |
| `resend` | Email invoices | 2 |
| `ai`, `@ai-sdk/anthropic` | Agent integration | 3 |

---

## 9. localStorage Schema

### Company Info (persisted)

Key: `invoice-generator:company`
```json
{
  "name": "Acme Inc",
  "email": "info@acme.inc",
  "logo": "data:image/png;base64,...",
  "address": {
    "street": "Mission Street, 79",
    "city": "San Francisco",
    "state": "California",
    "zip": "94016",
    "country": "United States"
  },
  "taxId": "GB123456789"
}
```

### Payment Details (persisted)

Key: `invoice-generator:payment`
```json
{
  "bankName": "Barclays",
  "accountName": "Acme Inc",
  "accountNumber": "12345678",
  "sortCode": "20-00-00",
  "iban": "GB29NWBK60161331926819",
  "swift": "BARCGB22",
  "instructions": ""
}
```

### Invoice Counter (persisted)

Key: `invoice-generator:counter`
```json
1
```

Format: `INV-001`, `INV-002`, etc.

### Recently Used Currencies (persisted)

Key: `invoice-generator:currencies`
```json
["GBP", "EUR", "USD"]
```

Default: `["GBP"]`. Updated each time user selects a currency. Max 4 recent.

---

## 10. Currency Support

### Quick-pick UI
- Show 3-4 recently used currencies as buttons (e.g. `[GBP] [EUR] [USD]`)
- "More" button opens full dropdown with search
- Recently used list saved to localStorage, auto-updated

### Currency List
- Include all major world currencies (~30-40 most common)
- Format: code + symbol + name (e.g. "GBP (£) — British Pound")
- Default: GBP

### Formatting
- Use Intl.NumberFormat for locale-aware currency display
- Symbol placement follows currency convention (£1,000 vs 1.000 €)

---

## 11. PDF Template

The PDF must match the preview as closely as possible. Using `@react-pdf/renderer`:

- Page size: A4
- Sections mirror the preview: header bar, FROM/TO, line items table, summary (subtotal, discount, VAT, total), payment footer
- Font: Helvetica (built into @react-pdf) or register Inter
- Colors and spacing match the preview design tokens
- Currency formatting matches the selected currency
- Date format: DD/MM/YYYY

---

## 12. Key UX Decisions (from interview)

| Decision | Choice | Rationale |
|---|---|---|
| Form approach | Stepped with auto-skip | Clean focus per step, skip company on repeat visits |
| Currency scope | Per invoice | One currency per invoice, not per line item |
| Currency picker | Recent + full list | Quick access to common currencies, full list available |
| Payment fields | Structured + free text | Bank fields for standard payments, free text for edge cases |
| Tax default | 20% (UK VAT) | Pre-filled, user can change. Saves a step. |
| Tax display | Full breakdown | Subtotal → Discount → VAT → Total. Required for compliance. |
| Discount | In MVP | Simple % field, shown in summary |
| Invoice number | INV-001 sequential | Auto-incremented, editable |
| Duplicate | In MVP | "New from this" button, copies fields, bumps number, clears dates |
| PDF generation | Client-side | No server needed for MVP, add server route in Phase 3 |
| Mobile | Desktop-first, basic mobile | Stacked layout on mobile, split-screen on desktop |
| Logo handling | Match reference (circular, ~45x45 display) | Auto-resize on upload to keep localStorage lean |
| Branding | Fixed for MVP | Add accent color picker in Phase 2 |
| API/Agent | Phase 3 | Not needed now, architecture supports it later |

---

## 13. Acceptance Criteria

### MVP Complete When:

- [ ] Split-screen layout renders correctly on desktop (1024px+)
- [ ] Basic stacked mobile layout works
- [ ] Step 1 (Your company): all fields work, data saves to localStorage
- [ ] Auto-skip Step 1 when company info is already saved
- [ ] Step 2 (Your client): all fields work
- [ ] Step 3 (Invoice details): invoice number (INV-001 auto), dates, currency picker with recent + full list
- [ ] Step 4 (Line items): add/remove items, qty x price, amounts auto-calculate
- [ ] Step 5 (Payment & notes): structured bank fields + free text, notes, terms, download button
- [ ] Payment details persist in localStorage
- [ ] Live preview updates in real-time as user types
- [ ] Summary shows: Subtotal, Discount (if >0), VAT with %, Total
- [ ] Active section highlighted on preview (visor brackets)
- [ ] PDF download works and matches preview layout
- [ ] PDF uses correct currency formatting and DD/MM/YYYY dates
- [ ] Company info persists across page reloads
- [ ] Invoice number auto-increments (INV-001, INV-002, ...)
- [ ] Duplicate invoice: copies fields, bumps number, clears dates
- [ ] Recently used currencies tracked and shown as quick-pick
- [ ] Clean, minimal design matching the reference

### Out of Scope for MVP:

- User authentication
- Database storage
- Email sending
- Invoice templates/themes
- Accent color customization
- Agent/API integration
- Multiple tax rates per line item
- Logo cropping/editing
- Accounting software integration
- Per-line-item currency

---

## 14. File Inventory (Context Folder)

| File | Purpose |
|---|---|
| `PRD.md` | This document — product requirements |
| `DESIGN_SYSTEM.md` | Detailed design tokens, component specs, CSS values |
| `0. README.txt` | Project overview and architecture |
| `1, Proposed_Stack_Setup.md` | Setup guide (adapted for invoice project) |
| `QUICK_REFERENCE.md` | Quick start reference |
| `cryptoinvoice-rendered.html` | Rendered HTML from reference site (design source) |
| `4. Stack_Analysis.md` | General stack rationale |
| `Setup_AI_Builder_Stack_pnpm.sh` | Automated project scaffolding |
