# Cross-Platform Development Guide

This project is designed to work seamlessly across **Windows, macOS, and Linux** without requiring Docker Desktop.

## 🎯 Key Features

✅ **Cross-Platform Scripts** - Node.js scripts work on all platforms
✅ **Automatic Line Ending Management** - `.gitattributes` handles CRLF/LF
✅ **No Docker Desktop Required** - Direct installation or WSL2 on Windows
✅ **Consistent Code Style** - `.editorconfig` for all editors
✅ **Platform-Agnostic Paths** - Uses `path.join()` instead of hardcoded separators

## 🚀 Quick Start (Any Platform)

### 1. Prerequisites

**All platforms need:**
- Node.js 18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- Git (optional, recommended)
- PostgreSQL (for database)

### 2. Setup Project

```bash
# Clone repository
git clone https://github.com/tangy83/NaSaSakhi.git
cd NaSaSakhi

# Run cross-platform setup
npm run setup

# Generate secrets
npm run generate-secrets
```

### 3. Configure Environment

Edit the generated `.env` files with your settings:
- `apps/backend/.env.backend`
- `apps/frontend/.env.local`

### 4. Start Development

```bash
npm run dev
```

That's it! The project should work the same way on all platforms.

## 📋 Platform-Specific Guides

### Windows

See [WINDOWS-SETUP.md](WINDOWS-SETUP.md) for:
- Detailed Windows installation steps
- WSL2 setup (recommended)
- Troubleshooting common Windows issues
- PowerShell commands

### macOS

Standard Unix environment - follow main README.md

### Linux

Standard Unix environment - follow main README.md

## 🔧 Cross-Platform Solutions Implemented

### 1. Git Line Endings (`.gitattributes`)

Ensures all text files use Unix line endings (LF), preventing `^M` characters and script execution issues on Windows.

**What it does:**
- Normalizes all text files to LF
- Prevents Windows from converting to CRLF
- Shell scripts always have correct endings

### 2. Node.js Scripts Instead of Shell Scripts

All automation uses Node.js scripts that work on any platform:

| Script | Purpose | Platform Support |
|--------|---------|-----------------|
| `npm run setup` | Project initialization | ✅ All |
| `npm run generate-secrets` | Generate secure secrets | ✅ All |
| `npm run deploy` | Build and deploy | ✅ All |
| `npm run dev` | Start dev servers | ✅ All |

### 3. Path Handling

All file operations use Node.js `path` module:

```javascript
// ✅ Cross-platform
const filePath = path.join(__dirname, 'apps', 'backend', 'src');

// ❌ Platform-specific (don't do this)
const filePath = __dirname + '/apps/backend/src';  // Fails on Windows
const filePath = __dirname + '\\apps\\backend\\src';  // Fails on Unix
```

### 4. EditorConfig (`.editorconfig`)

Ensures consistent coding style across all editors (VS Code, WebStorm, Sublime, etc.):
- Indent with 2 spaces
- Unix line endings (LF)
- UTF-8 encoding
- Trim trailing whitespace

### 5. Dependency Management

npm workspaces work the same on all platforms:

```bash
# Install all workspace dependencies
npm install

# Run commands in specific workspace
npm run dev --workspace=apps/backend
npm run build --workspace=apps/frontend
```

## 🐛 Common Cross-Platform Issues

### Line Endings

**Problem:** Shell scripts fail with "command not found" or `^M` characters visible.

**Solution:** Already fixed with `.gitattributes`. If you cloned before it was added:

```bash
# Refresh git line endings
git rm --cached -r .
git reset --hard
```

### Path Separators

**Problem:** File paths with `/` or `\` hardcoded fail on some platforms.

**Solution:** We use `path.join()` everywhere. If you add new code, always use:

```javascript
const path = require('path');
const filePath = path.join('apps', 'backend', 'src', 'server.ts');
```

### Case Sensitivity

**Problem:** `import './Component'` works on Windows but fails on Linux because file is `component.tsx`.

**Solution:**
- Always match exact case in imports
- Use lowercase for file names (recommended)
- Test on Linux/Mac if possible

### PowerShell vs Bash

**Problem:** Scripts written for bash don't work in PowerShell.

**Solution:** We use Node.js scripts instead of shell scripts. They work everywhere.

### Native Dependencies

**Problem:** Some npm packages have native dependencies that need compilation.

**Solution:**
- We avoid packages with native dependencies where possible
- If needed, install build tools:
  - **Windows:** `npm install --global windows-build-tools`
  - **macOS:** Install Xcode Command Line Tools
  - **Linux:** Usually pre-installed

## 📦 Dependencies Without Docker Desktop

You don't need Docker Desktop for development. Here's how to run services:

### PostgreSQL

**Windows:**
- Install from [postgresql.org](https://www.postgresql.org/download/windows/)
- Or use WSL2: `sudo apt install postgresql`

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt install postgresql-15 postgresql-contrib-15
sudo systemctl start postgresql
```

### Redis (Future, if needed)

**Windows:** Use WSL2 or Windows binaries
**macOS:** `brew install redis`
**Linux:** `sudo apt install redis-server`

### Node.js Services

Frontend and backend are Node.js apps - no special requirements.

## 🧪 Testing Cross-Platform Compatibility

### For Contributors

If you're adding new features, test on multiple platforms if possible:

1. **Test on Windows** (or WSL2)
2. **Test on macOS** or **Linux**
3. **Check line endings:** `git diff --check`
4. **Use Node.js APIs** instead of shell commands
5. **Use path.join()** for file paths

### CI/CD

Consider adding GitHub Actions to test on all platforms:

```yaml
# .github/workflows/test.yml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
      - run: npm install
      - run: npm run build
```

## 🎨 Editor/IDE Support

### Visual Studio Code

Install these extensions:
- **ESLint** - Linting
- **Prettier** - Formatting
- **EditorConfig** - Respects `.editorconfig`
- **Prisma** - Schema support
- **WSL** (Windows only) - For WSL integration

### WebStorm / IntelliJ IDEA

Built-in support for `.editorconfig` and all our configurations.

### Sublime Text / Atom / Vim

Install EditorConfig plugin for your editor.

## 📚 Resources

- [EditorConfig](https://editorconfig.org/)
- [Git Attributes](https://git-scm.com/docs/gitattributes)
- [Node.js Path Module](https://nodejs.org/api/path.html)
- [WSL2 Setup](https://learn.microsoft.com/en-us/windows/wsl/install)

## 🆘 Getting Help

If you encounter platform-specific issues:

1. Check [WINDOWS-SETUP.md](WINDOWS-SETUP.md) for Windows
2. Check main [README.md](README.md) for general setup
3. Search GitHub issues
4. Create new issue with:
   - Platform (Windows/Mac/Linux)
   - Node.js version
   - Error message
   - Steps to reproduce

## ✅ Verification Checklist

Before pushing changes, verify:

- [ ] Code uses `path.join()` for file paths
- [ ] No shell-specific commands (use Node.js scripts)
- [ ] Line endings are correct (`git diff --check`)
- [ ] EditorConfig rules followed
- [ ] Works on at least 2 platforms (if possible)
- [ ] No hardcoded paths or platform assumptions

## 🎉 Success!

With these solutions in place, your entire team can work together seamlessly, regardless of their operating system. No Docker Desktop required!
