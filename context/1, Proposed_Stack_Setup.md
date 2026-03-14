# Invoice Generator - Setup Guide

## 🎯 Stack Overview

```
Core:          Next.js 15 (TypeScript) + Vercel + Shadcn UI + Tailwind CSS
PDF:           @react-pdf/renderer (React components → PDF)
Forms:         React Hook Form + Zod validation
Future:        Supabase (save invoices/clients) + Resend (email) + Agent API
```

---

## 🚀 Quick Start - Automated Setup

```bash
bash setup-ai-builder-stack.sh my-project-name
```

This script will set up everything automatically. Continue reading for manual setup or customization.

---

## 📋 Prerequisites

### Required Tools
1. **Node.js 18+** - https://nodejs.org/
2. **Git** - https://git-scm.com/
3. **Cursor IDE** - https://cursor.sh/ (or VSCode as fallback)
4. **Postman** - https://www.postman.com/downloads/

### Required Accounts (All have generous free tiers)
1. **GitHub** - https://github.com/
2. **Vercel** - https://vercel.com/ (sign up with GitHub)
3. **Supabase** - https://supabase.com/ (sign up with GitHub)
4. **Stripe** - https://stripe.com/
5. **Resend** - https://resend.com/

### Optional but Recommended
1. **v0.dev** - https://v0.dev/ (Vercel account)
2. **Postman Account** - For cloud sync of API collections

---

## 🛠️ Manual Setup Steps

### Step 1: Create Next.js Project with TypeScript

```bash
npx create-next-app@latest my-project-name \
  --typescript \
  --eslint \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd my-project-name
```

When prompted:
- TypeScript? **Yes**
- ESLint? **Yes**
- Tailwind CSS? **Yes**
- `src/` directory? **No**
- App Router? **Yes**
- Customize import alias? **Yes** (use `@/*`)

---

### Step 2: Install Core Dependencies

```bash
# PDF Generation (core feature)
pnpm add @react-pdf/renderer

# Shadcn UI dependencies
pnpm add @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# UI Components
pnpm add sonner

# Forms & Validation
pnpm add zod react-hook-form @hookform/resolvers

# Utilities
pnpm add date-fns

# --- FUTURE (not needed for MVP) ---
# Supabase (save invoices/clients)
# pnpm add @supabase/supabase-js @supabase/ssr
#
# Email (send invoices)
# pnpm add resend
#
# AI/Agent integration
# pnpm add ai @ai-sdk/openai @ai-sdk/anthropic
```

---

### Step 3: Initialize Shadcn UI

```bash
npx shadcn@latest init
```

Configuration:
- Style: **Default**
- Base color: **Slate** (or your preference)
- CSS variables: **Yes**

Install components needed for invoice form:
```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add badge
```

---

### Step 4: Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### Step 5: Setup Supabase

#### 5.1 Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose organization and region
4. Set database password (save it!)
5. Wait for project to be ready (~2 minutes)

#### 5.2 Get API Keys
1. Go to Project Settings → API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (for admin operations)

#### 5.3 Create Supabase Client Files

Create `lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

Create `lib/supabase/server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component
          }
        },
      },
    }
  )
}
```

Create `lib/supabase/middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  return supabaseResponse
}
```

---

### Step 6: Setup Environment Variables

Create `.env.local`:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# --- FUTURE (uncomment when needed) ---

# Supabase (save invoices/clients)
# NEXT_PUBLIC_SUPABASE_URL=your-project-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (email invoices)
# RESEND_API_KEY=re_xxxxx
```

Note: The invoice generator MVP works entirely client-side.
No API keys needed to start — just run `pnpm dev` and go.

---

### Step 7: Update Next.js Configuration

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
```

---

### Step 8: Create Middleware for Auth

Create `middleware.ts`:

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

### Step 9: Create Folder Structure

```bash
mkdir -p app/api/invoices
mkdir -p components/ui
mkdir -p components/invoice
mkdir -p lib/invoice
mkdir -p lib/supabase          # Future: save/load invoices
mkdir -p types
mkdir -p utils
mkdir -p public/logos           # For uploaded company logos
```

Invoice-specific folder structure:
```
app/
  page.tsx                      # Main split-screen invoice page
  api/invoices/                 # Future: API for agent integration
    route.ts                    # POST create, GET list
    [id]/route.ts               # GET by id, PDF download
components/
  ui/                           # Shadcn components
  invoice/
    invoice-form.tsx            # Left panel - multi-step form
    invoice-preview.tsx         # Right panel - live preview
    invoice-pdf.tsx             # PDF template (@react-pdf)
    company-step.tsx            # Step 1: Your company info
    client-step.tsx             # Step 2: Client info
    items-step.tsx              # Step 3: Line items
    payment-step.tsx            # Step 4: Payment/bank details
    summary-step.tsx            # Step 5: Notes & terms
lib/
  invoice/
    types.ts                    # Invoice, LineItem, Company types
    defaults.ts                 # Default values & auto-increment
    calculations.ts             # Subtotal, tax, discount, total
    pdf-generator.ts            # PDF generation utility
    storage.ts                  # localStorage persistence
types/
  index.ts                      # Shared TypeScript types
```

---

### Step 10: Update package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

---

### Step 11: Create Invoice API Route (Future Agent Integration)

Create `app/api/invoices/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

// POST /api/invoices - Create invoice from JSON (for agents/tools)
export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validate invoice data with Zod schema
  // Generate PDF
  // Return PDF or invoice ID

  return NextResponse.json({
    message: 'Invoice created',
    invoice: body,
  })
}

// GET /api/invoices - List invoices (future)
export async function GET() {
  return NextResponse.json({
    message: 'Invoice API ready for agent integration',
  })
}
```

This API route is the foundation for connecting with other tools and agents later.

---

### Step 13: Setup Git

```bash
# Initialize git
git init

# Create .gitignore
echo "node_modules
.next
.env
.env.local
.vercel
*.log
.DS_Store" > .gitignore

# Initial commit
git add .
git commit -m "Initial commit: AI Builder Stack 2025"

# Create GitHub repo and push
gh repo create my-project-name --public --source=. --push
# OR manually create on GitHub and:
git remote add origin https://github.com/username/my-project-name.git
git push -u origin main
```

---

### Step 14: Deploy to Vercel

#### Option 1: CLI
```bash
npm i -g vercel
vercel
```

#### Option 2: GitHub Integration
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure environment variables (copy from .env.local)
4. Deploy!

---

## 🔐 API Keys (Future - Not Needed for MVP)

The invoice generator MVP runs entirely client-side. No API keys needed.

When you're ready to add backend features:

### Supabase (save invoices & clients)
1. Dashboard → Project Settings → API
2. Copy Project URL and anon key

### Resend (email invoices to clients)
1. https://resend.com/api-keys
2. Create API key
3. Verify domain for production emails

---

## 🧪 Testing Your Setup

### 1. Start Dev Server
```bash
pnpm dev
# Open http://localhost:3000
```

### 2. Test PDF Generation
```typescript
// Quick test: app/test-pdf/page.tsx
'use client'
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer'

const TestDoc = () => (
  <Document>
    <Page size="A4">
      <Text>Invoice Generator - PDF Working!</Text>
    </Page>
  </Document>
)

export default function TestPDF() {
  return (
    <PDFDownloadLink document={<TestDoc />} fileName="test.pdf">
      {({ loading }) => loading ? 'Generating...' : 'Download Test PDF'}
    </PDFDownloadLink>
  )
}
```

### 3. Test Shadcn Components
```typescript
// app/components-test/page.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ComponentsTest() {
  return (
    <div className="p-8 space-y-4">
      <Label>Company Name</Label>
      <Input placeholder="Acme Inc" />
      <Button>Generate Invoice</Button>
    </div>
  )
}
```

---

## 🎯 Next Steps After Setup

### MVP (Build First)
1. **Invoice Form** — Multi-step form matching the design
   - Company info (saved to localStorage)
   - Client info
   - Line items (description, qty, price)
   - Payment details (bank info, terms)

2. **Live Preview** — Right panel showing invoice as you type

3. **PDF Export** — Download button using @react-pdf/renderer

### Phase 2 (Add Later)
4. **Supabase Integration**
   - Save invoices to database
   - Client directory
   - Invoice history & numbering

5. **Email Integration (Resend)**
   - Send invoice PDF to client directly

6. **Agent/API Integration**
   - API routes for programmatic invoice creation
   - MCP server or tool definition for Claude
   - Webhook support for automation (Make.com, n8n)

7. **Deploy to Vercel**
   - Connect GitHub repo
   - Setup custom domain

---

## 💰 Cost Breakdown

| Service | Free Tier | Cost After Free |
|---------|-----------|-----------------|
| **Vercel** | Hobby (unlimited) | Pro $20/month |
| **Supabase** | 500MB DB, 1GB storage | Pro $25/month |
| **Resend** | 100 emails/day | $20/month (50k emails) |

**Total to start: $0** — MVP runs entirely client-side, no services needed

---

## 🔒 Security Checklist

- [ ] Never commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Enable Supabase RLS on all tables
- [ ] Verify Stripe webhook signatures
- [ ] Use HTTPS in production
- [ ] Implement rate limiting on API routes
- [ ] Validate all user inputs with Zod
- [ ] Keep dependencies updated

---

## 🐛 Common Issues & Fixes

**Issue:** `Module not found: Can't resolve '@/components/ui/button'`
**Fix:** Run `npx shadcn@latest add button`

**Issue:** Supabase auth not persisting
**Fix:** Check middleware.ts is configured correctly

**Issue:** TypeScript errors with Supabase
**Fix:** Generate types: `npm run supabase:types`

**Issue:** Postman requests failing with CORS
**Fix:** Add CORS headers to API routes or use Postman Desktop Agent

**Issue:** Vercel deployment environment variables
**Fix:** Add all .env.local variables in Vercel dashboard

---

## 📖 Documentation Links

- **Next.js**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Shadcn UI**: https://ui.shadcn.com
- **@react-pdf/renderer**: https://react-pdf.org/
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/

### Future Integration Docs
- **Supabase**: https://supabase.com/docs
- **Resend**: https://resend.com/docs

---

**Last Updated:** March 2026
**Project:** Invoice Generator
**Next.js Version:** 15.x
