# Setup Scripts - Complete Guide

## Overview

Your AI Builder Stack 2025 now has **two production-ready, robust setup scripts** with comprehensive error handling, validation, and automatic rollback capabilities.

---

## 📁 Available Scripts

### 1. Setup_AI_Builder_Stack_npm.sh
**Package Manager:** npm  
**Best For:** Traditional Node.js workflows, maximum compatibility

```bash
bash Setup_AI_Builder_Stack_npm.sh my-project-name
```

### 2. Setup_AI_Builder_Stack_pnpm.sh
**Package Manager:** pnpm  
**Best For:** Faster installations, better disk space efficiency, follows your user rules

```bash
bash Setup_AI_Builder_Stack_pnpm.sh my-project-name
```

### 3. Setup_AI_Builder_Stack.sh (Original)
**Status:** Kept as backup  
**Note:** Original version without enhancements - not recommended for production use

---

## 🎯 Key Features

Both enhanced scripts include:

### ✅ Comprehensive Error Handling
- `set -euo pipefail` for strict error checking
- Automatic error trap with rollback mechanism
- Exit code validation after every critical operation
- No silent failures

### ✅ Prerequisite Validation
- Checks Node.js version (requires 18+)
- Validates package manager (npm or pnpm)
- Verifies git installation
- Shows helpful installation links if tools are missing

### ✅ Input Validation
- Project name format validation (alphanumeric, hyphens, underscores)
- Existing directory detection
- Prevents accidental overwrites
- All variables properly quoted

### ✅ Color-Coded Logging
- 🔵 Blue: Informational messages
- ✅ Green: Success messages
- ⚠️ Yellow: Warnings (non-critical)
- ❌ Red: Errors (critical failures)

### ✅ File Creation Verification
- Validates every configuration file was created
- Checks directory creation success
- Ensures no silent failures

### ✅ Automatic Rollback
- Detects installation failures
- Automatically removes partial installation
- Leaves system in clean state

### ✅ Non-Interactive Execution
- All prompts disabled with `-y` flags
- Can run in CI/CD pipelines
- Never hangs waiting for input

---

## 🚀 Quick Start

### Prerequisites

Check you have everything installed:

```bash
# Check Node.js (must be 18+)
node --version

# Check npm (for npm version)
npm --version

# Check pnpm (for pnpm version)
pnpm --version
# If not installed: npm install -g pnpm

# Check git
git --version
```

### Installation

```bash
# Clone or navigate to your setup docs
cd "0000. Setup Docs"

# Make script executable
chmod +x Setup_AI_Builder_Stack_npm.sh
chmod +x Setup_AI_Builder_Stack_pnpm.sh

# Run your preferred version
bash Setup_AI_Builder_Stack_npm.sh my-awesome-app
# OR
bash Setup_AI_Builder_Stack_pnpm.sh my-awesome-app

# Navigate to your new project
cd my-awesome-app

# Add your API keys to .env.local
nano .env.local  # or use your favorite editor

# Start development
npm run dev  # or pnpm dev
```

---

## 📊 What Gets Installed

### Core Stack
- ✅ Next.js 15 with TypeScript
- ✅ Tailwind CSS
- ✅ ESLint configuration
- ✅ App Router structure

### Backend Services
- ✅ Supabase (Database + Auth + Storage)
  - Browser client configuration
  - Server client configuration
  - Middleware integration
- ✅ Supabase authentication middleware

### UI Framework
- ✅ Shadcn UI (18 components)
  - button, input, label, select, card, avatar
  - dropdown-menu, dialog, sheet, form
  - checkbox, textarea, separator, badge
  - skeleton, toast, sonner, table
- ✅ Radix UI primitives
- ✅ Lucide icons

### AI Integration
- ✅ Vercel AI SDK
- ✅ OpenAI adapter
- ✅ Anthropic adapter

### Payment & Communication
- ✅ Stripe integration
- ✅ Resend email service

### Forms & Validation
- ✅ Zod validation library
- ✅ React Hook Form
- ✅ Form resolvers

### API Testing
- ✅ Postman environment configuration
- ✅ Postman collection template
- ✅ Example API route

### Development Tools
- ✅ TypeScript type checking script
- ✅ Git repository with initial commit
- ✅ Comprehensive .gitignore

---

## 📁 Project Structure

```
your-project/
├── app/
│   ├── api/
│   │   └── test/          # Example API route
│   ├── auth/
│   │   ├── login/         # Auth pages
│   │   └── signup/
│   └── dashboard/         # Dashboard pages
├── components/
│   └── ui/                # Shadcn components (18 components)
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Browser Supabase client
│   │   ├── server.ts      # Server Supabase client
│   │   └── middleware.ts  # Auth middleware
│   ├── stripe/            # Stripe utilities
│   └── ai/                # AI utilities
├── postman/
│   ├── collections/       # API test collections
│   ├── environments/      # Environment configs
│   └── README.md
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
├── .env.local            # Your API keys (gitignored)
├── .env.example          # Template for .env.local
├── middleware.ts         # Next.js middleware
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

---

## 🔧 Configuration

### Environment Variables

Edit `.env.local` with your API keys:

```bash
# Supabase (get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Vercel AI SDK
OPENAI_API_KEY=sk-xxxxx              # https://platform.openai.com/api-keys
ANTHROPIC_API_KEY=sk-ant-xxxxx       # https://console.anthropic.com/

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Resend (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Postman Setup

1. Download Postman: https://www.postman.com/downloads/
2. Import environment: `postman/environments/local.postman_environment.json`
3. Import collection: `postman/collections/api.postman_collection.json`
4. Update environment variables with your Supabase keys
5. Test the example API: GET `{{api_url}}/test`

---

## 🧪 Testing

See **TESTING_GUIDE.md** for comprehensive testing scenarios including:

- ✅ Happy path testing
- ❌ Error handling testing
- 🔄 Rollback testing
- ⚡ Performance testing
- 🔍 File verification testing

Quick test:
```bash
# Test npm version
bash Setup_AI_Builder_Stack_npm.sh test-project
cd test-project
npm run dev

# Test pnpm version
bash Setup_AI_Builder_Stack_pnpm.sh test-project-pnpm
cd test-project-pnpm
pnpm dev
```

---

## 🔄 Differences Between npm and pnpm Versions

| Feature | npm Version | pnpm Version |
|---------|------------|--------------|
| **Package Manager** | npm | pnpm |
| **Create Command** | `npx -y create-next-app` | `pnpm create next-app` |
| **Install Command** | `npm install` | `pnpm install` |
| **Run Commands** | `npx -y` | `pnpm dlx` |
| **Lock File** | package-lock.json | pnpm-lock.yaml |
| **Dev Server** | `npm run dev` | `pnpm dev` |
| **Installation Speed** | Standard | ~2x faster |
| **Disk Usage** | Standard | ~50% less space |
| **Postman README** | References npm | References pnpm |

**Both versions:**
- Have identical error handling
- Create the same project structure
- Install the same dependencies
- Include the same configuration files

---

## 💡 Best Practices

### Choosing Between npm and pnpm

**Use npm version if:**
- Working with legacy projects
- Team unfamiliar with pnpm
- Maximum compatibility needed
- CI/CD uses npm

**Use pnpm version if:**
- Want faster installations
- Need better disk space efficiency
- Following modern best practices
- Your user rules specify pnpm (as yours do)

### After Installation

1. **Set up Supabase first:**
   - Create project at https://supabase.com/dashboard
   - Get API keys
   - Update .env.local

2. **Test the setup:**
   ```bash
   # Start dev server
   npm run dev  # or pnpm dev
   
   # Test API endpoint
   curl http://localhost:3000/api/test
   ```

3. **Configure Postman:**
   - Import templates
   - Update environment variables
   - Test API endpoints

4. **Create your database schema:**
   - Design tables in Supabase
   - Enable RLS policies
   - Generate TypeScript types

5. **Deploy to Vercel:**
   ```bash
   git remote add origin <your-repo>
   git push -u origin main
   # Then import in Vercel dashboard
   ```

---

## 🐛 Troubleshooting

### Script fails immediately

**Check prerequisites:**
```bash
node --version  # Must be 18+
npm --version   # For npm version
pnpm --version  # For pnpm version
git --version   # Must be installed
```

### "Directory already exists" error

```bash
# Remove existing directory or use different name
rm -rf my-project-name
# Or
bash Setup_AI_Builder_Stack_npm.sh my-project-name-v2
```

### "Permission denied"

```bash
chmod +x Setup_AI_Builder_Stack_npm.sh
chmod +x Setup_AI_Builder_Stack_pnpm.sh
```

### Script hangs during installation

- Check your internet connection
- Ensure non-interactive flags are working
- Try Ctrl+C and restart

### Partial installation after failure

**Don't worry!** The script automatically:
- Detects the failure
- Rolls back changes
- Removes the partial installation

If rollback fails:
```bash
rm -rf project-name
```

---

## 📚 Additional Documentation

- **TESTING_GUIDE.md** - Comprehensive testing scenarios
- **1, Proposed_Stack_Setup.md** - Detailed stack documentation
- **3. Postman_Quick_Start.md** - Postman setup and usage
- **4. Stack_Analysis.md** - Stack choice rationale

---

## 🎉 Success!

After running the script, you should have:

✅ A fully configured Next.js 15 project  
✅ All dependencies installed  
✅ Supabase integration ready  
✅ 18 Shadcn UI components  
✅ API testing with Postman  
✅ Git repository initialized  
✅ Example API route working  
✅ Environment files configured  

**Time saved:** 4-6 hours of manual setup!

---

## 🤝 Maintenance

### Updating the Scripts

If you need to modify the scripts:

1. Test changes thoroughly (see TESTING_GUIDE.md)
2. Update both npm and pnpm versions
3. Keep error handling consistent
4. Maintain backward compatibility when possible
5. Document any breaking changes

### Version History

- **v2.0** (Current) - Comprehensive error handling, validation, rollback
- **v1.0** - Original basic script

---

## 📝 Summary

You now have **production-ready setup scripts** that are:

- ✅ Robust - Comprehensive error handling
- ✅ Safe - Automatic rollback on failure
- ✅ Validated - Checks prerequisites
- ✅ User-friendly - Color-coded output
- ✅ Reliable - File creation verification
- ✅ Flexible - npm and pnpm versions
- ✅ Tested - Comprehensive test scenarios
- ✅ Documented - Complete guides

**Ready to build your next project in minutes instead of hours!** 🚀

