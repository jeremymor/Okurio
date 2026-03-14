# Design System — Invoice Generator

Extracted from cryptoinvoice.new rendered HTML. This is the single source of truth
for replicating the design.

---

## 1. Tailwind Config Extensions

Add these to `tailwind.config.ts`:

```typescript
const config = {
  theme: {
    extend: {
      colors: {
        'page': '#FDFDFD',
        'accent': '#0094FF',
        'accent-glow': '#24B0FF',
        'invoice': {
          DEFAULT: 'rgba(0, 25, 59, 0.08)',   // border-invoice (light gray dividers)
          light: 'rgba(0, 25, 59, 0.4)',       // text-invoice-light (section labels)
          dark: 'rgba(0, 25, 59, 0.85)',       // text-invoice-dark (values)
        },
        'logo-bg': '#FAFAFA',
        'logo-icon': '#B2B2B2',
        'step-pill': '#1A1A1A',
        'step-badge': '#494949',
      },
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '1' }],     // 10px — invoice labels
        'xxxs': ['0.5rem', { lineHeight: '1' }],      // 8px — powered-by
      },
      screens: {
        'invoice': '1024px',   // custom breakpoint for side-by-side layout
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system',
               'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue',
               'Arial', 'sans-serif'],
      },
    },
  },
}
```

---

## 2. Layout Structure

### Main Container
```
<main> — relative flex min-h-screen w-full flex-1 overflow-y-auto
```

### Left Panel (Form Sidebar)
```
Outer:  w-full invoice:min-w-[502px] invoice:max-w-[30%] bg-page border-r border-black/[0.07]
Inner:  flex h-full flex-1 justify-center p-6 invoice:p-12 bg-page
Content: flex w-full max-w-[405px] flex-col
```

Mobile behavior: slides up from bottom as overlay (`pt-[calc(100vh-16rem)]`, rounded-t-2xl)
Desktop: fixed sidebar on left

### Right Panel (Preview)
```
Container: flex h-full w-full flex-1 flex-col items-center bg-page p-6
           invoice:relative invoice:justify-center
```

Has decorative background with Perlin noise mask over dot pattern SVG.

---

## 3. Form Row Spec

Every form field uses this structure:

```html
<label class="group flex h-[3.375rem] items-center justify-between
              border-b border-invoice transition-all
              focus-within:border-accent
              [&:hover:not(:focus-within)]:border-black/20">
  <p class="mr-2 whitespace-nowrap text-sm font-medium">{Label}</p>
  <input class="h-full w-full bg-page text-right text-sm
                caret-accent focus-visible:outline-none" />
</label>
```

| Property | Value |
|---|---|
| Row height | `3.375rem` (54px) |
| Label | left, `text-sm font-medium`, no-wrap |
| Input | right-aligned, `text-sm`, transparent bg |
| Border | bottom only, `border-invoice` color |
| Focus | border → `#0094FF` |
| Hover | border → `black/20` |
| Caret | `#0094FF` |
| Spacing | label has `mr-2`, input fills remaining space |

---

## 4. Invoice Preview Card

### Card Container
```
Width:   612.25px
Height:  866px (min-height)
Radius:  rounded-[14px]
BG:      white
Scale:   scale-50 (mobile), md:scale-[0.8], invoice:scale-100
Shadow:  0 0 0 1px rgba(0,25,59,.05),
         0 1px 1px 0 rgba(0,25,59,.04),
         0 3px 3px 0 rgba(0,25,59,.03),
         0 6px 4px 0 rgba(0,25,59,.02),
         0 11px 4px 0 rgba(0,25,59,.01),
         0 32px 24px -12px rgba(0,0,59,.06)
```

### Section A: Header Bar
```
Height:  max-h-[56px]
Layout:  flex items-center justify-between border-b border-invoice px-8
Left:    INVOICE NO label + value
Right:   ISSUED date + DUE DATE date (min-w-[44%], spaced with ml-6)
Labels:  text-xxs font-semibold uppercase text-invoice-light
Values:  text-xs font-medium
```

### Section B: FROM / TO
```
Layout:  grid grid-cols-2 divide-x divide-invoice
Each:    p-8 py-6
Label:   text-xxs font-semibold uppercase text-invoice-light, pb-2.5
Logo:    45x45 rounded-full placeholder
Name:    160x20 placeholder block
Email:   140x16 placeholder block
Address: 120x16, 80x16, 50x16 placeholder blocks
Gap:     mb-4 (logo), mb-1.5 (text lines)
```

When data is filled in, placeholders are replaced with actual text:
- Name: `text-xs font-medium`
- Email/address lines: `text-xs text-invoice-light`

### Section C: Line Items
```
Layout:  flex grow flex-col, p-3 px-8 py-6
Header:  grid with columns: Description (wide) | Qty | Price | Amount
         text-xxs font-semibold uppercase tracking-wider text-invoice-light
Rows:    min-h-[49px], border-b border-invoice, py-4 text-xs
         Values: font-medium text-invoice-dark
         Amount: flex justify-end
Column grid: grid-cols-[308px,1fr] then nested grid-cols-[85px,1fr,1fr]
```

### Section D: Subtotal / Total
```
Layout:  grid grid-cols-[calc(50%+34px),1fr]
Left:    empty spacer
Right:   grid min-h-[49px] grid-cols-3 items-center border-b border-invoice py-3
Subtotal label: text-xs font-medium text-invoice-light
Subtotal value: text-xs font-medium, right-aligned
Total label:    text-xs font-medium
Total value:    text-xs font-medium (slightly bolder)
```

### Section E: Payment Footer
```
Height:  --height: 156px
Border:  border-t border-invoice
Layout:  two columns
Left:    "PAYABLE IN" section (token info — we replace with bank details)
Right:   "INSTRUCTIONS" section
Labels:  text-xxs font-semibold uppercase tracking-wider text-invoice-light
Values:  text-xs font-medium
```

For our version, replace crypto fields with:
- Left: "PAYMENT DETAILS" — Bank name, Account #, Routing #
- Right: "INSTRUCTIONS" — IBAN, SWIFT, or free-text instructions

---

## 5. Visor (Active Section Indicator)

Blue corner brackets that highlight the active section on the invoice preview.

```
Border:  2px solid #0094FF
Position: absolute, overlaid on invoice card
Corners: top-left + bottom-right (or all four corners)
Animation: keyframe animations for appear/active states
           - visorAppear
           - visorTopLeftActive
           - visorBottomRightActive
```

Each invoice section (header, from/to, items, payment) is wrapped in a group that
shows the visor when its corresponding form step is active.

---

## 6. Step Navigation

### Next / Back Buttons
```
Container: grid grid-cols-2 justify-between gap-3 py-8 text-sm
           invoice:pb-0 invoice:pt-4, positioned at mt-auto (bottom of form)
```

### Next Button (right-aligned)
```
Layout:  flex flex-col items-end space-y-1 rounded-md px-3 py-2
Hover:   bg-black/[0.02]
Focus:   1.5px border #0094FF
Text 1:  "Next >" — text-black/60
Text 2:  step destination name — font-medium
Arrow:   SVG, stroke-black/60, translates right 3px on hover
```

### Back Button (left-aligned)
```
Same structure, mirrored. "< Back" + previous step name.
```

---

## 7. Step Indicator Pills

Appear on hover over invoice preview sections:

```
Container: rounded-full bg-step-pill pl-1 pr-2.5
           opacity-0 → opacity-100 on group-hover
           translate-y from -10px to 0
Badge:     rounded-full bg-step-badge text-white font-bold
Label:     text-white font-semibold ml-1
Shadow:    0px 2px 4px rgba(0,0,0,0.15), 0px 2px 3.6px rgba(0,0,0,0.03)
```

---

## 8. Logo Upload Button

```
Size:    28x28 (wrapper), inner icon area
Shape:   rounded-full
BG:      #FAFAFA
Border:  1px solid rgba(0,0,0,0.08)
Icon:    Plus (+) in #B2B2B2
Shadow:  0px 2px 10px rgb(0 0 0 / 0.1) on hover
```

Accepts: `image/*`
Stores as: base64 data URL

---

## 9. Section Title Styles

```
Form title (h2):     text-2xl font-semibold tracking-[-0.42px] pb-3
Section header (h3): text-sm font-medium text-invoice-light pb-2
Helper text:         text-sm text-black/40
```

---

## 10. Responsive Breakpoints

| Name | Width | Behavior |
|---|---|---|
| default | 0px | Form = bottom sheet, preview = full screen, card scale-50 |
| `sm` | 640px | Input scale normalizes to 100% |
| `md` | 768px | Card scales to 80% |
| `invoice` | 1024px | Side-by-side layout, card scale 100%, sidebar visible |

---

## 11. Shadows Reference

### Invoice Card
```css
box-shadow:
  0 0 0 1px rgba(0,25,59,.05),
  0 1px 1px 0 rgba(0,25,59,.04),
  0 3px 3px 0 rgba(0,25,59,.03),
  0 6px 4px 0 rgba(0,25,59,.02),
  0 11px 4px 0 rgba(0,25,59,.01),
  0 32px 24px -12px rgba(0,0,59,.06);
```

### Form Panel (mobile)
```css
box-shadow:
  0px 0px 0px 1px rgba(0,0,0,0.04),
  0px -1px 1px -0.5px rgba(0,0,0,0.04),
  0px -3px 3px -1.5px rgba(0,0,0,0.04),
  0px -6px 6px -3px rgba(0,0,0,0.04),
  0px -12px 12px -6px rgba(0,0,0,0.04),
  0px -24px 24px -12px rgba(0,0,0,0.04);
```

---

## 12. Decorative (Nice-to-Have)

### Preview Background
- Dot pattern SVG tiled as background
- Perlin noise PNG used as mask-image for organic texture
- Subtle, low-contrast

### Invoice Card Border Glow
- Animated conic gradient (from `transparent` through `#00C2FF` at 20%, back to transparent)
- Rotates via CSS `--angle` custom property
- Very subtle, appears on hover/focus

### Focus Gradient Line
- 1px height, 200px wide, centered under email input
- Linear gradient: transparent → `#24B0FF` → transparent
- Appears on focus, opacity-0 by default

These decorative elements are enhancement-only. Skip for MVP if needed.
