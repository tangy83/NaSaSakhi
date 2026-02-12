# Git Merge Guide - Merging to Main Repository

## Target Repository
**Main Repository:** https://github.com/tangy83/NaSaSakhi.git  
**Your Fork:** https://github.com/GeedikantiSunitha/NaSa-Sakhi.git

---

## 📋 Step-by-Step Guide

### Option 1: Using Pull Request (Recommended - For Collaboration)

This is the **recommended approach** as it allows code review before merging.

#### Step 1: Add Upstream Remote

Add the main repository as an "upstream" remote:

```bash
git remote add upstream https://github.com/tangy83/NaSaSakhi.git
```

Verify it was added:
```bash
git remote -v
```

You should see:
- `origin` - Your fork (GeedikantiSunitha/NaSa-Sakhi)
- `upstream` - Main repo (tangy83/NaSaSakhi)

#### Step 2: Fetch Latest from Upstream

Get the latest changes from the main repository:

```bash
git fetch upstream
```

#### Step 3: Create a Feature Branch

Create a new branch for your changes (don't push directly to main):

```bash
git checkout -b feature/frontend-registration-form
```

Or use a descriptive name:
```bash
git checkout -b feature/sunitha-frontend-implementation
```

#### Step 4: Ensure Your Changes Are Committed

Make sure all your changes are committed:

```bash
git status
```

If there are uncommitted changes:
```bash
git add .
git commit -m "Your commit message"
```

#### Step 5: Push Your Branch to Your Fork

Push your feature branch to your fork (origin):

```bash
git push origin feature/frontend-registration-form
```

If the branch doesn't exist on remote yet:
```bash
git push -u origin feature/frontend-registration-form
```

#### Step 6: Create Pull Request on GitHub

1. Go to: https://github.com/tangy83/NaSaSakhi
2. Click **"Pull requests"** tab
3. Click **"New pull request"**
4. Click **"compare across forks"**
5. Set:
   - **base repository:** `tangy83/NaSaSakhi`
   - **base branch:** `main` (or `master`)
   - **head repository:** `GeedikantiSunitha/NaSa-Sakhi`
   - **compare branch:** `feature/frontend-registration-form`
6. Click **"Create pull request"**
7. Fill in:
   - **Title:** "Frontend Registration Form Implementation"
   - **Description:** 
     ```
     ## Summary
     Complete implementation of 7-step organization registration form
     
     ## Features Implemented
     - All 7 registration steps (Organization, Contact, Services, Branches, Languages, Documents, Review)
     - Form validation with Zod schemas
     - Draft save/resume functionality
     - Mobile responsive design (375px+)
     - Accessibility enhancements (WCAG 2.1 AA)
     - Error handling and notifications
     - API integration layer
     
     ## Files Changed
     - 39+ new files
     - All form components
     - Validation schemas
     - State management hooks
     - API integration
     
     ## Testing
     - Manual testing checklist created (101 test cases)
     - Ready for testing
     ```
8. Click **"Create pull request"**

#### Step 7: Wait for Review and Merge

- Repository maintainer will review your PR
- Address any feedback
- Once approved, they will merge it to main

---

### Option 2: Direct Merge (If You Have Write Access)

**⚠️ Only use this if you have direct write access to the main repository.**

#### Step 1: Add Upstream Remote

```bash
git remote add upstream https://github.com/tangy83/NaSaSakhi.git
```

#### Step 2: Fetch and Merge Latest Changes

```bash
# Fetch latest from upstream
git fetch upstream

# Switch to main branch
git checkout main

# Merge upstream main into your main
git merge upstream/main
```

#### Step 3: Resolve Conflicts (if any)

If there are conflicts:
```bash
# See conflicts
git status

# Edit conflicted files
# Then:
git add .
git commit -m "Resolve merge conflicts"
```

#### Step 4: Push to Main Repository

```bash
git push upstream main
```

---

### Option 3: Sync Your Fork First, Then Create PR

If you want to ensure your fork is up-to-date before creating PR:

#### Step 1: Add Upstream

```bash
git remote add upstream https://github.com/tangy83/NaSaSakhi.git
```

#### Step 2: Fetch Upstream

```bash
git fetch upstream
```

#### Step 3: Update Your Main Branch

```bash
git checkout main
git merge upstream/main
```

#### Step 4: Push Updated Main to Your Fork

```bash
git push origin main
```

#### Step 5: Create Feature Branch and PR

Follow Option 1 steps 3-7.

---

## 🔧 Troubleshooting

### Issue: "Remote upstream already exists"

**Solution:**
```bash
git remote remove upstream
git remote add upstream https://github.com/tangy83/NaSaSakhi.git
```

### Issue: Merge Conflicts

**Solution:**
1. Identify conflicted files: `git status`
2. Open conflicted files and look for `<<<<<<<`, `=======`, `>>>>>>>`
3. Resolve conflicts manually
4. Stage resolved files: `git add .`
5. Complete merge: `git commit`

### Issue: "Permission denied"

**Solution:**
- You don't have write access to main repo
- Use **Option 1 (Pull Request)** instead

### Issue: "Repository not found"

**Solution:**
- Check repository URL is correct
- Ensure you have access to the repository
- Verify repository name: `NaSaSakhi` (case-sensitive)

---

## 📝 Best Practices

1. **Always create a feature branch** - Don't push directly to main
2. **Keep your fork updated** - Regularly sync with upstream
3. **Write clear commit messages** - Describe what and why
4. **Create descriptive PRs** - Help reviewers understand your changes
5. **Test before pushing** - Ensure code works locally

---

## ✅ Quick Checklist

Before creating PR:
- [ ] All changes committed
- [ ] Code tested locally
- [ ] No merge conflicts
- [ ] Feature branch created
- [ ] Branch pushed to your fork
- [ ] PR description written

---

## 🎯 Recommended Workflow Summary

```bash
# 1. Add upstream remote
git remote add upstream https://github.com/tangy83/NaSaSakhi.git

# 2. Fetch latest
git fetch upstream

# 3. Create feature branch
git checkout -b feature/frontend-registration-form

# 4. Ensure all changes committed
git add .
git commit -m "Complete frontend registration form implementation"

# 5. Push to your fork
git push -u origin feature/frontend-registration-form

# 6. Create PR on GitHub (manual step)
```

---

**Last Updated:** February 2026
