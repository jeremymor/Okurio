# Testing Guide for Setup Scripts

This guide provides comprehensive test scenarios for both setup scripts to ensure they're robust and handle all edge cases properly.

## Setup Scripts Overview

1. **Setup_AI_Builder_Stack_npm.sh** - Uses npm package manager
2. **Setup_AI_Builder_Stack_pnpm.sh** - Uses pnpm package manager

Both scripts have identical error handling and validation features.

## Prerequisites for Testing

Before testing, ensure you have:
- Access to a Linux/Mac machine or WSL on Windows
- Ability to install/uninstall Node.js temporarily
- Network connection
- Write permissions in the test directory

---

## Test Scenarios

### ✅ Test 1: Happy Path (Successful Installation)

**Purpose:** Verify script completes successfully with all prerequisites met.

**Steps:**
```bash
# Test npm version
bash Setup_AI_Builder_Stack_npm.sh test-project-npm

# Test pnpm version (in a different directory)
bash Setup_AI_Builder_Stack_pnpm.sh test-project-pnpm
```

**Expected Results:**
- ✅ All prerequisites validated
- ✅ Next.js project created
- ✅ All dependencies installed
- ✅ Shadcn UI initialized
- ✅ 18 Shadcn components installed
- ✅ Project structure created
- ✅ All configuration files created
- ✅ Git repository initialized
- ✅ Initial commit created
- ✅ Success message displayed

**Verification:**
```bash
# Check project was created
ls -la test-project-npm/
ls -la test-project-pnpm/

# Check key files exist
ls test-project-npm/lib/supabase/
ls test-project-npm/app/api/test/
ls test-project-npm/postman/

# Check git was initialized
cd test-project-npm && git log
cd ../test-project-pnpm && git log

# Try to run the dev server
cd test-project-npm && npm run dev
# (Ctrl+C to stop)

cd ../test-project-pnpm && pnpm dev
# (Ctrl+C to stop)
```

**Cleanup:**
```bash
rm -rf test-project-npm test-project-pnpm
```

---

### ❌ Test 2: Missing Node.js

**Purpose:** Verify script fails gracefully when Node.js is not installed.

**Steps:**
```bash
# Temporarily hide node (requires sudo)
sudo mv /usr/bin/node /usr/bin/node.backup

# Try to run script
bash Setup_AI_Builder_Stack_npm.sh test-fail-node
```

**Expected Results:**
- ❌ Error message: "Node.js is not installed"
- ❌ Helpful link displayed: https://nodejs.org/
- ❌ Script exits with code 1
- ❌ No project directory created

**Cleanup:**
```bash
# Restore node
sudo mv /usr/bin/node.backup /usr/bin/node
```

---

### ❌ Test 3: Old Node.js Version

**Purpose:** Verify script checks Node.js version requirement (18+).

**Steps:**
```bash
# Install Node.js 16 (if you have nvm)
nvm install 16
nvm use 16

# Try to run script
bash Setup_AI_Builder_Stack_npm.sh test-fail-oldnode
```

**Expected Results:**
- ❌ Error message: "Node.js version 18 or higher required. Current version: v16.x.x"
- ❌ Script exits with code 1
- ❌ No project directory created

**Cleanup:**
```bash
nvm use 18  # or your default version
```

---

### ❌ Test 4: Missing npm

**Purpose:** Verify npm version checks for npm availability.

**Steps:**
```bash
# Temporarily hide npm
sudo mv /usr/bin/npm /usr/bin/npm.backup

# Try to run npm version
bash Setup_AI_Builder_Stack_npm.sh test-fail-npm
```

**Expected Results:**
- ❌ Error message: "npm is not installed"
- ❌ Helpful link displayed: https://nodejs.org/
- ❌ Script exits with code 1

**Cleanup:**
```bash
sudo mv /usr/bin/npm.backup /usr/bin/npm
```

---

### ❌ Test 5: Missing pnpm

**Purpose:** Verify pnpm version checks for pnpm availability.

**Steps:**
```bash
# Uninstall pnpm if installed
npm uninstall -g pnpm

# Try to run pnpm version
bash Setup_AI_Builder_Stack_pnpm.sh test-fail-pnpm
```

**Expected Results:**
- ❌ Error message: "pnpm is not installed"
- ❌ Helpful link displayed: https://pnpm.io/installation
- ❌ Script exits with code 1

**Cleanup:**
```bash
npm install -g pnpm
```

---

### ❌ Test 6: Missing git

**Purpose:** Verify script checks for git installation.

**Steps:**
```bash
# Temporarily hide git
sudo mv /usr/bin/git /usr/bin/git.backup

# Try to run script
bash Setup_AI_Builder_Stack_npm.sh test-fail-git
```

**Expected Results:**
- ❌ Error message: "git is not installed"
- ❌ Helpful link displayed: https://git-scm.com/
- ❌ Script exits with code 1

**Cleanup:**
```bash
sudo mv /usr/bin/git.backup /usr/bin/git
```

---

### ❌ Test 7: Invalid Project Name

**Purpose:** Verify script validates project name format.

**Steps:**
```bash
# Test with spaces
bash Setup_AI_Builder_Stack_npm.sh "my project"

# Test with special characters
bash Setup_AI_Builder_Stack_npm.sh "my@project!"

# Test with dots
bash Setup_AI_Builder_Stack_npm.sh "my.project"
```

**Expected Results:**
- ❌ Error message: "Invalid project name. Use only letters, numbers, hyphens, and underscores."
- ❌ Script exits with code 1
- ❌ No project directory created

---

### ❌ Test 8: Existing Directory

**Purpose:** Verify script prevents overwriting existing directories.

**Steps:**
```bash
# Create a directory
mkdir existing-project

# Try to create project with same name
bash Setup_AI_Builder_Stack_npm.sh existing-project
```

**Expected Results:**
- ❌ Error message: "Directory 'existing-project' already exists. Please choose a different name or remove the existing directory."
- ❌ Script exits with code 1
- ❌ Original directory remains unchanged

**Cleanup:**
```bash
rm -rf existing-project
```

---

### ❌ Test 9: No Project Name Provided

**Purpose:** Verify script requires a project name argument.

**Steps:**
```bash
# Run without argument
bash Setup_AI_Builder_Stack_npm.sh
```

**Expected Results:**
- ❌ Error message: "Please provide a project name"
- ❌ Usage instructions displayed
- ❌ Script exits with code 1

---

### 🔄 Test 10: Network Failure Mid-Installation

**Purpose:** Verify automatic rollback when installation fails.

**Steps:**
```bash
# Start script
bash Setup_AI_Builder_Stack_npm.sh test-rollback

# In another terminal, disconnect network or kill the process after project creation but before completion
# (Press Ctrl+C after you see "Installing core dependencies...")
```

**Expected Results:**
- ❌ Error message: "Setup failed! Rolling back changes..."
- ⚠️ Warning: "Removing partial installation: test-rollback"
- ✅ Partial project directory removed automatically
- ❌ Script exits with code 1

**Verification:**
```bash
# Verify directory was removed
ls test-rollback  # should not exist
```

---

### ✅ Test 11: Valid Project Names

**Purpose:** Verify various valid project name formats work.

**Steps:**
```bash
# Test with hyphens
bash Setup_AI_Builder_Stack_npm.sh my-awesome-project
rm -rf my-awesome-project

# Test with underscores
bash Setup_AI_Builder_Stack_npm.sh my_awesome_project
rm -rf my_awesome_project

# Test with numbers
bash Setup_AI_Builder_Stack_npm.sh project123
rm -rf project123

# Test with mixed
bash Setup_AI_Builder_Stack_npm.sh my-project_v2
rm -rf my-project_v2
```

**Expected Results:**
- ✅ All project names accepted
- ✅ Projects created successfully

---

### ✅ Test 12: File Creation Verification

**Purpose:** Verify all expected files are created.

**Steps:**
```bash
bash Setup_AI_Builder_Stack_npm.sh verify-files-test
```

**Expected Files Checklist:**
```bash
cd verify-files-test

# Core files
[ -f "package.json" ] && echo "✅ package.json" || echo "❌ package.json"
[ -f "next.config.ts" ] && echo "✅ next.config.ts" || echo "❌ next.config.ts"
[ -f "tsconfig.json" ] && echo "✅ tsconfig.json" || echo "❌ tsconfig.json"
[ -f "tailwind.config.ts" ] && echo "✅ tailwind.config.ts" || echo "❌ tailwind.config.ts"
[ -f "middleware.ts" ] && echo "✅ middleware.ts" || echo "❌ middleware.ts"

# Environment files
[ -f ".env.local" ] && echo "✅ .env.local" || echo "❌ .env.local"
[ -f ".env.example" ] && echo "✅ .env.example" || echo "❌ .env.example"

# Supabase files
[ -f "lib/supabase/client.ts" ] && echo "✅ client.ts" || echo "❌ client.ts"
[ -f "lib/supabase/server.ts" ] && echo "✅ server.ts" || echo "❌ server.ts"
[ -f "lib/supabase/middleware.ts" ] && echo "✅ middleware.ts" || echo "❌ middleware.ts"

# API routes
[ -f "app/api/test/route.ts" ] && echo "✅ test route" || echo "❌ test route"

# Postman files
[ -f "postman/environments/local.postman_environment.json" ] && echo "✅ postman env" || echo "❌ postman env"
[ -f "postman/collections/api.postman_collection.json" ] && echo "✅ postman collection" || echo "❌ postman collection"
[ -f "postman/README.md" ] && echo "✅ postman readme" || echo "❌ postman readme"

# Git
[ -d ".git" ] && echo "✅ git initialized" || echo "❌ git not initialized"

cd ..
```

**Cleanup:**
```bash
rm -rf verify-files-test
```

---

### ✅ Test 13: Components Installation

**Purpose:** Verify Shadcn components are installed correctly.

**Steps:**
```bash
bash Setup_AI_Builder_Stack_npm.sh components-test
```

**Expected Components:**
```bash
cd components-test

# Check components directory
ls components/ui/

# Should contain:
# button.tsx, input.tsx, label.tsx, select.tsx, card.tsx, avatar.tsx,
# dropdown-menu.tsx, dialog.tsx, sheet.tsx, form.tsx, checkbox.tsx,
# textarea.tsx, separator.tsx, badge.tsx, skeleton.tsx, toast.tsx,
# sonner.tsx, table.tsx

cd ..
```

**Cleanup:**
```bash
rm -rf components-test
```

---

### ✅ Test 14: Git Initialization

**Purpose:** Verify git is properly initialized with initial commit.

**Steps:**
```bash
bash Setup_AI_Builder_Stack_npm.sh git-test
cd git-test
```

**Verification:**
```bash
# Check git initialized
git status

# Check initial commit exists
git log

# Verify commit message
git log --oneline | grep "Initial commit: AI Builder Stack 2025 setup"

# Check all files are committed
git status --short  # should be empty
```

**Expected Results:**
- ✅ Git repository initialized
- ✅ Initial commit created
- ✅ Commit message correct
- ✅ All files committed (clean working tree)

**Cleanup:**
```bash
cd ..
rm -rf git-test
```

---

### ✅ Test 15: Package Manager Verification

**Purpose:** Verify correct package manager is used in each script.

**Steps:**
```bash
# For npm version
bash Setup_AI_Builder_Stack_npm.sh npm-check
cd npm-check
cat package.json | grep -A5 "scripts"

# For pnpm version  
cd ..
bash Setup_AI_Builder_Stack_pnpm.sh pnpm-check
cd pnpm-check

# Check if pnpm-lock.yaml exists (pnpm signature)
ls pnpm-lock.yaml
```

**Expected Results:**
- ✅ npm version: package-lock.json exists, scripts reference npm
- ✅ pnpm version: pnpm-lock.yaml exists, Postman README references pnpm

**Cleanup:**
```bash
cd ..
rm -rf npm-check pnpm-check
```

---

## Testing Checklist

Use this checklist to track your testing:

- [ ] Test 1: Happy Path - npm version
- [ ] Test 1: Happy Path - pnpm version
- [ ] Test 2: Missing Node.js
- [ ] Test 3: Old Node.js version
- [ ] Test 4: Missing npm
- [ ] Test 5: Missing pnpm
- [ ] Test 6: Missing git
- [ ] Test 7: Invalid project names
- [ ] Test 8: Existing directory
- [ ] Test 9: No project name
- [ ] Test 10: Network failure/rollback
- [ ] Test 11: Valid project names
- [ ] Test 12: File creation verification
- [ ] Test 13: Components installation
- [ ] Test 14: Git initialization
- [ ] Test 15: Package manager verification

---

## Automated Test Script

You can create an automated test script to run multiple tests:

```bash
#!/bin/bash

# test-setup-scripts.sh
echo "Running automated tests for setup scripts..."

PASS=0
FAIL=0

# Test valid project name
bash Setup_AI_Builder_Stack_npm.sh test-auto && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
rm -rf test-auto

# Test invalid project name (should fail)
bash Setup_AI_Builder_Stack_npm.sh "test auto" && FAIL=$((FAIL+1)) || PASS=$((PASS+1))

# Test existing directory (should fail)
mkdir test-existing
bash Setup_AI_Builder_Stack_npm.sh test-existing && FAIL=$((FAIL+1)) || PASS=$((PASS+1))
rm -rf test-existing

echo ""
echo "Test Results:"
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
```

---

## Performance Testing

### Test Installation Time

```bash
# Measure npm version
time bash Setup_AI_Builder_Stack_npm.sh perf-test-npm

# Measure pnpm version  
time bash Setup_AI_Builder_Stack_pnpm.sh perf-test-pnpm

# Compare results
# pnpm is typically faster due to better caching
```

**Expected Times:**
- npm version: 4-6 minutes (depending on network)
- pnpm version: 3-5 minutes (typically faster)

---

## Troubleshooting Test Failures

### If a test fails unexpectedly:

1. **Check logs:** Scripts provide detailed colored output
2. **Verify prerequisites:** Ensure Node 18+, npm/pnpm, git are installed
3. **Check permissions:** Ensure write permissions in test directory
4. **Network issues:** Retry if network was unstable
5. **Clean state:** Remove partial installations before retesting

### Common Issues:

**Issue:** Script hangs during Shadcn installation
- **Cause:** Shadcn prompting for input
- **Fix:** Ensure `-y` flags are present in script

**Issue:** "Permission denied" error
- **Cause:** Script not executable
- **Fix:** Run `chmod +x Setup_AI_Builder_Stack_npm.sh`

**Issue:** Rollback doesn't remove directory
- **Cause:** Directory in use or permission issue
- **Fix:** Manually remove with `rm -rf project-name`

---

## Success Criteria

Both scripts pass all tests if:

✅ All prerequisites are validated correctly
✅ Invalid inputs are rejected with clear messages
✅ Successful installations complete without errors
✅ All files and directories are created
✅ Git is properly initialized
✅ Rollback works on failure
✅ Scripts use correct package manager (npm vs pnpm)
✅ Scripts exit with appropriate codes (0 for success, 1 for failure)

---

## Continuous Testing

Recommended testing schedule:
- **Before release:** Run all 15 tests
- **After updates:** Run happy path + relevant changed tests
- **Monthly:** Full test suite to catch environment changes
- **Before important projects:** Quick happy path verification

---

## Reporting Issues

If you find bugs during testing:

1. Document the test scenario
2. Include error messages
3. Note your environment (OS, Node version, etc.)
4. Include steps to reproduce
5. Check if other script version has same issue

---

**Testing completed:** Mark todos as complete after successful testing.

