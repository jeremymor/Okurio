#!/bin/bash

echo "🚀 AI Builder Stack 2025 - Automated Setup"
echo "=========================================="
echo ""
echo "Stack: Next.js 15 (TypeScript) + Vercel + Supabase + Shadcn UI + Vercel AI SDK + Postman"
echo ""

# Check if project name is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide a project name"
    echo "Usage: bash setup-ai-builder-stack.sh my-project-name"
    exit 1
fi

PROJECT_NAME=$1

echo "📦 Creating Next.js 15 project with TypeScript: $PROJECT_NAME"
echo ""

# Create Next.js project with TypeScript
npx create-next-app@latest $PROJECT_NAME \
  --typescript \
  --eslint \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-git

cd $PROJECT_NAME

echo ""
echo "📥 Installing core dependencies..."
echo ""

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Vercel AI SDK
npm install ai @ai-sdk/openai @ai-sdk/anthropic

# Shadcn UI dependencies
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# UI Components
npm install react-hot-toast sonner

# Payments
npm install stripe @stripe/stripe-js

# Email
npm install resend

# Forms & Validation
npm install zod react-hook-form @hookform/resolvers

# Utilities
npm install date-fns

echo ""
echo "🎨 Initializing Shadcn UI..."
echo ""

# Initialize Shadcn with defaults
npx shadcn@latest init -d

# Install essential Shadcn components
echo ""
echo "📦 Installing Shadcn UI components..."
npx shadcn@latest add button -y
npx shadcn@latest add input -y
npx shadcn@latest add label -y
npx shadcn@latest add select -y
npx shadcn@latest add card -y
npx shadcn@latest add avatar -y
npx shadcn@latest add dropdown-menu -y
npx shadcn@latest add dialog -y
npx shadcn@latest add sheet -y
npx shadcn@latest add form -y
npx shadcn@latest add checkbox -y
npx shadcn@latest add textarea -y
npx shadcn@latest add separator -y
npx shadcn@latest add badge -y
npx shadcn@latest add skeleton -y
npx shadcn@latest add toast -y
npx shadcn@latest add sonner -y
npx shadcn@latest add table -y

echo ""
echo "📁 Creating project structure..."

# Create folder structure
mkdir -p app/api/test
mkdir -p app/auth/login
mkdir -p app/auth/signup
mkdir -p app/dashboard
mkdir -p lib/supabase
mkdir -p lib/stripe
mkdir -p lib/ai
mkdir -p types
mkdir -p utils
mkdir -p postman/collections
mkdir -p postman/environments

echo ""
echo "⚙️ Creating configuration files..."

# Create Supabase client files
cat > lib/supabase/client.ts << 'EOF'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
EOF

cat > lib/supabase/server.ts << 'EOF'
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
EOF

cat > lib/supabase/middleware.ts << 'EOF'
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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
EOF

# Create middleware
cat > middleware.ts << 'EOF'
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
EOF

# Update next.config.ts
cat > next.config.ts << 'EOF'
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
EOF

# Create example API route
cat > app/api/test/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return NextResponse.json({ 
      message: 'API is working!',
      authenticated: false 
    })
  }
  
  return NextResponse.json({
    message: 'API is working!',
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
    }
  })
}
EOF

# Create environment files
cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Vercel AI SDK
OPENAI_API_KEY=sk-xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Resend
RESEND_API_KEY=re_xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF

cat > .env.example << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Vercel AI SDK
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF

# Update package.json scripts
npx json -I -f package.json -e 'this.scripts["type-check"]="tsc --noEmit"' 2>/dev/null || \
  node -e "const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('package.json'));pkg.scripts['type-check']='tsc --noEmit';fs.writeFileSync('package.json',JSON.stringify(pkg,null,2));"

# Create Postman environment template
cat > postman/environments/local.postman_environment.json << 'EOF'
{
  "id": "local-env",
  "name": "Local Development",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:3000",
      "enabled": true
    },
    {
      "key": "api_url",
      "value": "{{base_url}}/api",
      "enabled": true
    },
    {
      "key": "supabase_url",
      "value": "your-supabase-url",
      "enabled": true
    },
    {
      "key": "supabase_anon_key",
      "value": "your-anon-key",
      "enabled": true
    },
    {
      "key": "access_token",
      "value": "",
      "enabled": true
    }
  ]
}
EOF

# Create Postman collection template
cat > postman/collections/api.postman_collection.json << 'EOF'
{
  "info": {
    "name": "API Collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Test API",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{api_url}}/test",
          "host": ["{{api_url}}"],
          "path": ["test"]
        }
      }
    }
  ]
}
EOF

# Create Postman README
cat > postman/README.md << 'EOF'
# Postman API Testing

## Setup

1. **Install Postman**: https://www.postman.com/downloads/
2. **Import Environment**: Import `environments/local.postman_environment.json`
3. **Import Collection**: Import `collections/api.postman_collection.json`
4. **Update Environment Variables**: Add your Supabase URL and keys

## Environment Variables

- `base_url`: Base URL of your app (http://localhost:3000 for local)
- `api_url`: API endpoint URL ({{base_url}}/api)
- `supabase_url`: Your Supabase project URL
- `supabase_anon_key`: Your Supabase anon/public key
- `access_token`: JWT token (auto-populated after login)

## Usage

1. Start dev server: `npm run dev`
2. Open Postman
3. Select "Local Development" environment
4. Run requests from the collection

## Adding New Requests

Export updated collections:
1. Collection → ... → Export
2. Save to `postman/collections/`
3. Commit to version control
EOF

# Update .gitignore
cat >> .gitignore << 'EOF'

# Environment variables
.env
.env.local
.env.*.local

# Vercel
.vercel

# Postman (keep templates, ignore personal data)
postman/**/*.backup
EOF

# Initialize git
git init
git add .
git commit -m "Initial commit: AI Builder Stack 2025 setup"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. cd $PROJECT_NAME"
echo "2. Edit .env.local with your API keys:"
echo "   - Supabase: https://supabase.com/dashboard (create project → get API keys)"
echo "   - OpenAI: https://platform.openai.com/api-keys"
echo "   - Stripe: https://dashboard.stripe.com/test/apikeys"
echo "   - Resend: https://resend.com/api-keys"
echo ""
echo "3. Install Postman: https://www.postman.com/downloads/"
echo "   - Import environment: postman/environments/local.postman_environment.json"
echo "   - Import collection: postman/collections/api.postman_collection.json"
echo ""
echo "4. Start development:"
echo "   npm run dev"
echo ""
echo "5. Test API endpoint in Postman:"
echo "   GET http://localhost:3000/api/test"
echo ""
echo "6. Deploy to Vercel:"
echo "   - Push to GitHub"
echo "   - Import repo in Vercel: https://vercel.com/new"
echo "   - Add environment variables from .env.local"
echo ""
echo "📖 Full documentation: PROPOSED_STACK_SETUP.md"
echo ""
echo "🎉 Happy building with the AI Builder Stack 2025!"
echo ""