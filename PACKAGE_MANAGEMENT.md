# Package Management Guide

This document explains how package versions are locked down in this project for consistent, reproducible builds.

## 🔒 What's Been Locked Down

### 1. **Package Versions**
- All `package.json` dependencies use **exact versions** (no `^` or `~`)
- Versions match currently installed packages (as of Sept 20, 2025)

### 2. **NPM Configuration (`.npmrc`)**
- `save-exact=true` - New packages install with exact versions
- `package-lock=true` - Prevents accidental lock file changes
- `engine-strict=true` - Enforces Node.js version requirements

### 3. **Engine Requirements**
- Node.js: `>=18.0.0`
- NPM: `>=9.0.0`

## 📦 Current Locked Versions

### Dependencies
- `@opennextjs/cloudflare`: `1.8.3`
- `date-fns`: `4.1.0`
- `next`: `15.5.3`
- `next-themes`: `0.4.6`
- `react`: `19.1.0`
- `react-day-picker`: `9.10.0`
- `react-dom`: `19.1.0`
- `react-hook-form`: `7.62.0`
- `recharts`: `3.2.1`

### Dev Dependencies
- `@eslint/eslintrc`: `3.3.1`
- `@tailwindcss/postcss`: `4.1.13`
- `@types/node`: `20.19.17`
- `@types/react`: `19.1.13`
- `@types/react-dom`: `19.1.9`
- `eslint`: `9.36.0`
- `eslint-config-next`: `15.4.6`
- `tailwindcss`: `4.1.13`
- `typescript`: `5.9.2`
- `wrangler`: `4.38.0`

## 🛠️ NPM Scripts for Package Management

### Production Installation
```bash
# For production/CI environments
npm run install:ci
# Equivalent to: npm ci
```

### Clean Installation
```bash
# If you need to reset node_modules completely
npm run install:clean
# Equivalent to: rm -rf node_modules package-lock.json && npm install
```

### Security & Updates
```bash
# Check for security vulnerabilities
npm run audit

# Check which packages have updates available
npm run outdated
# or
npm run update:check
```

## 🔄 How to Update Packages

### Option 1: Selective Updates (Recommended)
```bash
# Update a specific package
npm install package-name@latest

# Example: Update Next.js
npm install next@latest
```

### Option 2: Check All Outdated
```bash
# See what's outdated
npm run outdated

# Manually update packages you want in package.json
# Then run:
npm install
```

### Option 3: Major Updates (Use with caution)
```bash
# For major version updates, test thoroughly
npm install react@latest react-dom@latest
npm run build
npm run test # if you have tests
```

## 🚨 Important Rules

### DO ✅
- **Always commit `package-lock.json`** changes
- **Test builds after any package updates**
- **Update one package at a time** for easier debugging
- **Check for breaking changes** in package changelogs
- **Run `npm audit`** regularly for security updates

### DON'T ❌
- **Don't use `npm update`** - it ignores exact versions
- **Don't delete `package-lock.json`** without good reason
- **Don't install packages without exact versions**
- **Don't update multiple major versions at once**

## 🏗️ CI/CD Considerations

### GitHub Actions / CI Setup
```yaml
# Use npm ci for faster, reproducible installs
- name: Install dependencies
  run: npm ci

# Check for security issues
- name: Security audit
  run: npm audit --audit-level=moderate
```

### Docker
```dockerfile
# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci --only=production
```

## 🔍 Troubleshooting

### "Package-lock.json is out of sync"
```bash
npm run install:clean
```

### "Engine requirements not met"
Update your Node.js version to >= 18.0.0

### New team member setup
```bash
# They should run:
npm ci
# NOT: npm install
```

## 📈 Benefits of This Approach

1. **Reproducible Builds** - Same versions everywhere
2. **Faster CI** - `npm ci` is faster than `npm install`
3. **Fewer Bugs** - No surprise updates breaking things
4. **Security** - You control when/how updates happen
5. **Team Consistency** - Everyone uses identical dependencies

## 🗓️ Maintenance Schedule

- **Weekly**: Run `npm audit` 
- **Monthly**: Check `npm outdated` for updates
- **Quarterly**: Consider major package updates
- **As needed**: Security updates immediately
