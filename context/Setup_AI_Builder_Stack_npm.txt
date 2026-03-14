#!/bin/bash

# Exit on error, undefined variables, and pipe failures
set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}❌${NC} $1"
}

# Cleanup function for rollback
cleanup_on_error() {
    log_error "Setup failed! Rolling back changes..."
    if [ -d "$PROJECT_NAME" ]; then
        log_warning "Removing partial installation: $PROJECT_NAME"
        rm -rf "$PROJECT_NAME"
    fi
    exit 1
}

# Set trap to catch errors
trap cleanup_on_error ERR

echo "🚀 AI Builder Stack 2025 - Automated Setup (npm)"
echo "=========================================="
echo ""
echo "Stack: Next.js 15 (TypeScript) + Vercel + Supabase + Shadcn UI + Vercel AI SDK + Postman"
echo ""

# Check if project name is provided
if [ -z "${1:-}" ]; then
    log_error "Please provide a project name"
    echo "Usage: bash Setup_AI_Builder_Stack_npm.sh my-project-name"
    exit 1
fi

PROJECT_NAME=$1

# Validate project name
if [[ ! "$PROJECT_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    log_error "Invalid project name. Use only letters, numbers, hyphens, and underscores."
    exit 1
fi

# Check if directory already exists
if [ -d "$PROJECT_NAME" ]; then
    log_error "Directory '$PROJECT_NAME' already exists. Please choose a different name or remove the existing directory."
    exit 1
fi

log_info "Validating prerequisites..."

# Check for required tools
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "$1 is not installed. Please install it first."
        echo "Visit: $2"
        exit 1
    else
        log_success "$1 found: $(command -v "$1")"
    fi
}

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18 or higher required. Current version: $(node -v)"
        exit 1
    fi
    log_success "Node.js found: $(node -v)"
else
    log_error "Node.js is not installed."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

check_command "npm" "https://nodejs.org/"
check_command "git" "https://git-scm.com/"

log_success "All prerequisites validated!"
echo ""

log_info "Creating Next.js 15 project with TypeScript: $PROJECT_NAME"
echo ""

# Create Next.js project with TypeScript
if ! npx -y create-next-app@latest "$PROJECT_NAME" \
  --typescript \
  --eslint \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-git; then
    log_error "Failed to create Next.js project"
    exit 1
fi

log_success "Next.js project created successfully"

cd "$PROJECT_NAME" || {
    log_error "Failed to enter project directory"
    exit 1
}

echo ""
log_info "Installing core dependencies..."
echo ""

# Function to install packages with error checking
install_packages() {
    local category=$1
    shift
    log_info "Installing $category..."
    if ! npm install "$@"; then
        log_error "Failed to install $category"
        exit 1
    fi
    log_success "$category installed"
}

# Supabase
install_packages "Supabase" @supabase/supabase-js @supabase/ssr

# Vercel AI SDK
install_packages "Vercel AI SDK" ai @ai-sdk/openai @ai-sdk/anthropic

# Shadcn UI dependencies
install_packages "Shadcn UI dependencies" @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# UI Components
install_packages "UI Components" react-hot-toast sonner

# Payments
install_packages "Stripe" stripe @stripe/stripe-js

# Email
install_packages "Resend" resend

# Forms & Validation
install_packages "Forms & Validation" zod react-hook-form @hookform/resolvers

# Utilities
install_packages "Utilities" date-fns

log_success "All core dependencies installed!"

echo ""
log_info "Initializing Shadcn UI..."
echo ""

# Initialize Shadcn with defaults
if ! npx -y shadcn@latest init -d; then
    log_error "Failed to initialize Shadcn UI"
    exit 1
fi
log_success "Shadcn UI initialized"

# Install essential Shadcn components
echo ""
log_info "Installing Shadcn UI components..."

# Array of components to install
COMPONENTS=(
    "button"
    "input"
    "label"
    "select"
    "card"
    "avatar"
    "dropdown-menu"
    "dialog"
    "sheet"
    "form"
    "checkbox"
    "textarea"
    "separator"
    "badge"
    "skeleton"
    "toast"
    "sonner"
    "table"
)

# Install each component with error checking
for component in "${COMPONENTS[@]}"; do
    log_info "Installing $component..."
    if ! npx -y shadcn@latest add "$component" -y; then
        log_warning "Failed to install $component (non-critical, continuing...)"
    else
        log_success "$component installed"
    fi
done

log_success "Shadcn UI components installed!"

echo ""
log_info "Creating project structure..."

# Create folder structure with error checking
create_dir() {
    if ! mkdir -p "$1"; then
        log_error "Failed to create directory: $1"
        exit 1
    fi
}

create_dir "app/api/test"
create_dir "app/auth/login"
create_dir "app/auth/signup"
create_dir "app/dashboard"
create_dir "lib/supabase"
create_dir "lib/stripe"
create_dir "lib/ai"
create_dir "types"
create_dir "utils"
create_dir "postman/collections"
create_dir "postman/environments"

log_success "Project structure created"

echo ""
log_info "Creating configuration files..."

# Create Supabase client files
log_info "Creating Supabase client configuration..."
cat > lib/supabase/client.ts << 'EOF'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
EOF

if [ ! -f "lib/supabase/client.ts" ]; then
    log_error "Failed to create lib/supabase/client.ts"
    exit 1
fi
log_success "Created lib/supabase/client.ts"

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

if [ ! -f "lib/supabase/server.ts" ]; then
    log_error "Failed to create lib/supabase/server.ts"
    exit 1
fi
log_success "Created lib/supabase/server.ts"

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

if [ ! -f "lib/supabase/middleware.ts" ]; then
    log_error "Failed to create lib/supabase/middleware.ts"
    exit 1
fi
log_success "Created lib/supabase/middleware.ts"

log_success "Supabase configuration files created"

# Create middleware
log_info "Creating Next.js middleware..."
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

if [ ! -f "middleware.ts" ]; then
    log_error "Failed to create middleware.ts"
    exit 1
fi
log_success "Created middleware.ts"

# Update next.config.ts
log_info "Creating Next.js configuration..."
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

if [ ! -f "next.config.ts" ]; then
    log_error "Failed to create next.config.ts"
    exit 1
fi
log_success "Created next.config.ts"

# Create example API route
log_info "Creating example API route..."
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

if [ ! -f "app/api/test/route.ts" ]; then
    log_error "Failed to create app/api/test/route.ts"
    exit 1
fi
log_success "Created app/api/test/route.ts"

# Create environment files
log_info "Creating environment configuration files..."
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

if [ ! -f ".env.local" ]; then
    log_error "Failed to create .env.local"
    exit 1
fi
log_success "Created .env.local"

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

if [ ! -f ".env.example" ]; then
    log_error "Failed to create .env.example"
    exit 1
fi
log_success "Created .env.example"

# Update package.json scripts
log_info "Updating package.json scripts..."
if ! node -e "const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('package.json'));pkg.scripts['type-check']='tsc --noEmit';fs.writeFileSync('package.json',JSON.stringify(pkg,null,2));"; then
    log_warning "Failed to add type-check script (non-critical)"
else
    log_success "Added type-check script to package.json"
fi

# Create Postman files
log_info "Creating Postman configuration files..."

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

if [ ! -f "postman/environments/local.postman_environment.json" ]; then
    log_error "Failed to create Postman environment file"
    exit 1
fi
log_success "Created Postman environment configuration"

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

if [ ! -f "postman/collections/api.postman_collection.json" ]; then
    log_error "Failed to create Postman collection file"
    exit 1
fi
log_success "Created Postman collection configuration"

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

if [ ! -f "postman/README.md" ]; then
    log_error "Failed to create Postman README"
    exit 1
fi
log_success "Created Postman README"

# Update .gitignore
log_info "Updating .gitignore..."
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

log_success "Updated .gitignore"

# Initialize git
log_info "Initializing Git repository..."
if ! git init; then
    log_error "Failed to initialize git repository"
    exit 1
fi
log_success "Git initialized"

log_info "Creating initial commit..."
if ! git add .; then
    log_error "Failed to stage files"
    exit 1
fi

if ! git commit -m "Initial commit: AI Builder Stack 2025 setup"; then
    log_error "Failed to create initial commit"
    exit 1
fi
log_success "Initial commit created"

# Disable trap since setup completed successfully
trap - ERR

echo ""
log_success "Setup completed successfully! 🎉"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
log_info "📋 Next steps:"
echo ""
echo "1. Navigate to your project:"
echo "   ${GREEN}cd $PROJECT_NAME${NC}"
echo ""
echo "2. Edit .env.local with your API keys:"
echo "   ${BLUE}•${NC} Supabase: https://supabase.com/dashboard"
echo "   ${BLUE}•${NC} OpenAI: https://platform.openai.com/api-keys"
echo "   ${BLUE}•${NC} Stripe: https://dashboard.stripe.com/test/apikeys"
echo "   ${BLUE}•${NC} Resend: https://resend.com/api-keys"
echo ""
echo "3. Install Postman: https://www.postman.com/downloads/"
echo "   ${BLUE}•${NC} Import environment: postman/environments/local.postman_environment.json"
echo "   ${BLUE}•${NC} Import collection: postman/collections/api.postman_collection.json"
echo ""
echo "4. Start development:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "5. Test API endpoint:"
echo "   ${BLUE}GET${NC} http://localhost:3000/api/test"
echo ""
echo "6. Deploy to Vercel:"
echo "   ${BLUE}•${NC} Push to GitHub: ${GREEN}git remote add origin <your-repo>${NC}"
echo "   ${BLUE}•${NC} Import in Vercel: https://vercel.com/new"
echo "   ${BLUE}•${NC} Add environment variables from .env.local"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
log_info "📖 Full documentation: 1, Proposed_Stack_Setup.md"
log_info "🧪 Postman guide: 3. Postman_Quick_Start.md"
echo ""
log_success "Happy building with the AI Builder Stack 2025! 🚀"
echo ""

