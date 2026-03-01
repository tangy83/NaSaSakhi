# Quick Test Guide - Saathi Registration Form

## 🚀 Quick Start Testing

### 1. Start the Application
```bash
npm run dev
```
Open browser: http://localhost:3000/register/step1

### 2. Essential Test Scenarios (15 minutes)

#### ✅ Happy Path (Complete Registration)
1. **Step 1:** Fill organization name, select registration type, enter registration number, year (e.g., 2010)
2. **Step 2:** Enter primary contact (name, phone: 9876543210, email: test@example.com)
3. **Step 3:** Select at least 1 category and 1 resource
4. **Step 4:** Add 1 branch (address, select state/city, PIN: 123456)
5. **Step 5:** Select at least 1 language
6. **Step 6:** Upload registration certificate (PDF/JPEG/PNG, <5MB)
7. **Step 7:** Review and submit
8. **Success:** Verify success page shows registration ID

**Expected Result:** ✅ Complete flow works, redirects to success page

---

#### ⚠️ Validation Tests (5 minutes)

**Step 1 Validation:**
- Leave organization name empty → Click Next → ❌ Should show error
- Enter year 1799 → ❌ Should show "Year must be 1800 or later"
- Enter year 2027 → ❌ Should show "Year cannot be in the future"

**Step 2 Validation:**
- Enter invalid email (e.g., "test") → ❌ Should show email error
- Enter phone with 9 digits → ❌ Should show phone error
- Enter phone starting with 5 → ❌ Should show "must start with 6, 7, 8, or 9"

**Step 3 Validation:**
- Don't select any category → Click Next → ❌ Should show error
- Select category but no resources → Click Next → ❌ Should show error

**Step 6 Validation:**
- Try to upload .exe file → ❌ Should show file type error
- Try to upload 6MB file → ❌ Should show size error
- Don't upload registration certificate → Click Next → ❌ Should show error

---

#### 🔄 Navigation Tests (3 minutes)

1. **URL Navigation:**
   - Type `/register/step5` in address bar → ✅ Should load Step 5
   - Use browser back button → ✅ Should go to previous step
   - Use browser forward button → ✅ Should go to next step

2. **Button Navigation:**
   - Click "Next" on Step 1 → ✅ Should go to Step 2
   - Click "Back" on Step 2 → ✅ Should go to Step 1
   - Progress indicator → ✅ Should show correct step number

3. **Data Persistence:**
   - Fill Step 1 → Go to Step 2 → Go back to Step 1 → ✅ Data should be preserved

---

#### 📁 File Upload Tests (3 minutes)

1. **Registration Certificate (Required):**
   - Upload PDF file (<5MB) → ✅ Should upload successfully
   - Upload JPEG file (<5MB) → ✅ Should upload successfully
   - Upload PNG file (<5MB) → ✅ Should upload successfully
   - Try .exe file → ❌ Should show error
   - Try 6MB file → ❌ Should show size error

2. **Logo (Optional):**
   - Upload JPEG/PNG/SVG (<2MB) → ✅ Should upload successfully
   - Can skip (leave empty) → ✅ Should work

3. **Drag & Drop:**
   - Drag file onto upload area → ✅ Should work
   - Click upload area → ✅ File picker opens

---

#### 💾 Draft Save Tests (2 minutes)

1. **Auto-Save:**
   - Fill Step 1 → Wait 2 seconds → Check DevTools → Application → Local Storage → ✅ Should see `saathi_registration_draft`

2. **Manual Save:**
   - Click "Save Draft" button → ✅ Should save (check localStorage)

3. **Resume:**
   - Fill Step 1-3 → Close browser → Reopen → Go to `/register/step1` → ✅ Data should load

---

#### 📱 Mobile Test (5 minutes)

1. **Open Chrome DevTools** (F12)
2. **Toggle device toolbar** (Ctrl+Shift+M or Cmd+Shift+M)
3. **Set viewport to 375x667** (iPhone SE)
4. **Test:**
   - All steps are readable → ✅
   - Buttons are clickable → ✅
   - Forms don't overflow → ✅
   - File upload works → ✅

---

## 🐛 Common Issues to Check

### Issue: Form data not persisting
**Check:**
- [ ] localStorage is enabled in browser
- [ ] No errors in console
- [ ] `useFormState` hook is working

### Issue: Validation not working
**Check:**
- [ ] Zod schemas are imported correctly
- [ ] `zodResolver` is used in `useForm`
- [ ] Error messages appear below fields

### Issue: API calls failing
**Check:**
- [ ] `.env.local` is configured
- [ ] `NEXT_PUBLIC_USE_REAL_API=false` (using mocks)
- [ ] Network tab shows API calls
- [ ] Mock API functions exist

### Issue: File upload not working
**Check:**
- [ ] File size is within limits (5MB docs, 2MB logo)
- [ ] File type is allowed (PDF/JPEG/PNG for docs, JPEG/PNG/SVG for logo)
- [ ] Network tab shows upload request
- [ ] Mock upload function returns success

### Issue: Navigation not working
**Check:**
- [ ] URL changes when clicking Next/Back
- [ ] Browser back/forward works
- [ ] Progress indicator shows correct step
- [ ] No errors in console

---

## 📊 Test Coverage Checklist

### Must Test (P0 - Critical)
- [ ] Complete registration flow (all 7 steps)
- [ ] Validation on all required fields
- [ ] File upload (registration certificate)
- [ ] Form submission
- [ ] Success page
- [ ] URL navigation
- [ ] Data persistence

### Should Test (P1 - Important)
- [ ] Optional fields
- [ ] Multiple branches
- [ ] Multiple languages
- [ ] Logo upload
- [ ] Additional certificates
- [ ] Draft save/resume
- [ ] Mobile responsiveness

### Nice to Test (P2 - Optional)
- [ ] Browser compatibility
- [ ] Accessibility (keyboard navigation)
- [ ] Performance
- [ ] Edge cases

---

## 🔍 Debugging Tips

### Check Browser Console
```javascript
// Check if draft is saved
localStorage.getItem('saathi_registration_draft')

// Check current step
// Look for useFormState hook state in React DevTools
```

### Check Network Tab
- Look for API calls to `/api/reference/*`
- Look for upload calls to `/api/upload/*`
- Look for submission to `/api/registration/submit`
- Check response status codes (200 = success)

### Check React DevTools
- Inspect component state
- Check form data in `useFormState`
- Verify props are passed correctly

---

## ✅ Sign-off Checklist

Before marking as "Ready for Production":

- [ ] All 7 steps work end-to-end
- [ ] All validation works correctly
- [ ] File upload works (all file types)
- [ ] Form submission works
- [ ] Success page displays correctly
- [ ] URL navigation works
- [ ] Data persists correctly
- [ ] Mobile responsive (375px)
- [ ] No console errors
- [ ] No critical bugs found

---

## 📝 Test Report Template

**Test Date:** _______________  
**Tester:** _______________  
**Environment:** Local / Staging  
**Browser:** Chrome / Firefox / Safari / Edge  

**Results:**
- ✅ Passed: ___
- ❌ Failed: ___
- ⚠️ Blocked: ___

**Critical Issues:**
1. _________________________________________________

**Recommendation:** [ ] Ready for Production [ ] Needs Fixes [ ] Needs Retest
