# NASA Sakhi Registration Form - Manual Testing Checklist

**Date:** _______________  
**Tester:** _______________  
**Environment:** [ ] Local (localhost:3000) [ ] Staging  
**Browser:** _______________  
**Viewport:** [ ] Desktop [ ] Tablet [ ] Mobile (375px)

---

## Pre-Testing Setup

- [ ] Development server is running (`npm run dev`)
- [ ] Browser console is open (F12) - check for errors
- [ ] Network tab is open - verify API calls
- [ ] `.env.local` is configured correctly
- [ ] `NEXT_PUBLIC_USE_REAL_API=false` (using mock APIs)

---

## 1. Navigation & Routing Tests

### 1.1 Direct URL Access
- [ ] Navigate to `/register/step1` → Should load Step 1
- [ ] Navigate to `/register/step2` → Should load Step 2
- [ ] Navigate to `/register/step3` → Should load Step 3
- [ ] Navigate to `/register/step4` → Should load Step 4
- [ ] Navigate to `/register/step5` → Should load Step 5
- [ ] Navigate to `/register/step6` → Should load Step 6
- [ ] Navigate to `/register/step7` → Should load Step 7
- [ ] Navigate to `/register/invalid` → Should redirect to step1 or show 404

### 1.2 Step Navigation (Next/Back Buttons)
- [ ] Step 1 → Click "Next" → Should navigate to `/register/step2`
- [ ] Step 2 → Click "Next" → Should navigate to `/register/step3`
- [ ] Step 3 → Click "Next" → Should navigate to `/register/step4`
- [ ] Step 4 → Click "Next" → Should navigate to `/register/step5`
- [ ] Step 5 → Click "Next" → Should navigate to `/register/step6`
- [ ] Step 6 → Click "Next" → Should navigate to `/register/step7`
- [ ] Step 2 → Click "Back" → Should navigate to `/register/step1`
- [ ] Step 7 → Click "Back" → Should navigate to `/register/step6`
- [ ] Step 1 → "Back" button should not be visible

### 1.3 Browser Navigation
- [ ] Use browser back button from Step 2 → Should go to Step 1
- [ ] Use browser forward button → Should go to Step 2
- [ ] Browser back/forward should maintain form data
- [ ] Refresh page on Step 3 → Should stay on Step 3 with data preserved

### 1.4 Progress Indicator
- [ ] Progress indicator shows "Step 1 of 7" on Step 1
- [ ] Progress indicator shows "Step 2 of 7" on Step 2
- [ ] Progress indicator shows "Step 7 of 7" on Step 7
- [ ] Completed steps show checkmark (✓)
- [ ] Current step is highlighted in blue
- [ ] Future steps are grayed out

---

## 2. Step 1: Organization Details

### 2.1 Form Fields Display
- [ ] Organization Name field is visible
- [ ] Registration Type dropdown is visible
- [ ] Registration Number field is visible
- [ ] Year Established field is visible
- [ ] Religious Affiliation dropdown is visible (optional)
- [ ] Social Categories checkboxes are visible (optional)
- [ ] All required fields are marked with red asterisk (*)

### 2.2 Data Loading
- [ ] Religious affiliations load from API (check Network tab)
- [ ] Social categories load from API (check Network tab)
- [ ] Loading state shows while fetching data
- [ ] Dropdowns populate with data after loading

### 2.3 Validation - Organization Name
- [ ] Leave empty → Click Next → Shows error "Organization name is required"
- [ ] Enter "AB" (2 chars) → Click Next → Shows error "must be at least 3 characters"
- [ ] Enter valid name (3-100 chars) → Error disappears
- [ ] Enter 101+ characters → Shows error "cannot exceed 100 characters"

### 2.4 Validation - Registration Type
- [ ] Leave empty → Click Next → Shows error "Please select a registration type"
- [ ] Select "NGO" → Error disappears
- [ ] All 5 options available: NGO, Trust, Government, Private, Other

### 2.5 Validation - Registration Number
- [ ] Leave empty → Click Next → Shows error "Registration number is required"
- [ ] Enter valid number → Error disappears
- [ ] Enter 51+ characters → Shows error "cannot exceed 50 characters"

### 2.6 Validation - Year Established
- [ ] Leave empty → Click Next → Shows error "Year of establishment is required"
- [ ] Enter 1799 → Shows error "Year must be 1800 or later"
- [ ] Enter 2027 (future year) → Shows error "Year cannot be in the future"
- [ ] Enter valid year (1800-2026) → Error disappears

### 2.7 Optional Fields
- [ ] Religious Affiliation can be left empty
- [ ] Social Categories can be left empty
- [ ] Can select multiple social categories
- [ ] Can deselect social categories

### 2.8 Form Submission
- [ ] Fill all required fields → Click Next → Navigates to Step 2
- [ ] Data persists when navigating back from Step 2
- [ ] Click "Save Draft" → Shows confirmation (if implemented)
- [ ] Draft saves to localStorage (check DevTools → Application → Local Storage)

---

## 3. Step 2: Contact Information

### 3.1 Form Fields Display
- [ ] Primary Contact Name field visible
- [ ] Primary Contact Phone field visible
- [ ] Primary Contact Email field visible
- [ ] Secondary Contact toggle/checkbox visible
- [ ] Website URL field visible (optional)
- [ ] Social media fields visible (optional)

### 3.2 Primary Contact Validation
- [ ] Name empty → Click Next → Shows error
- [ ] Phone empty → Click Next → Shows error
- [ ] Email empty → Click Next → Shows error
- [ ] Invalid email format → Shows error "Please enter a valid email address"
- [ ] Phone with 9 digits → Shows error "must be 10 digits"
- [ ] Phone starting with 5 → Shows error "must start with 6, 7, 8, or 9"
- [ ] Valid phone (10 digits, starts with 6/7/8/9) → Error disappears

### 3.3 Secondary Contact
- [ ] Toggle secondary contact → Fields appear
- [ ] Secondary contact fields are optional
- [ ] Can toggle secondary contact off → Fields hide
- [ ] Secondary contact validation works (if filled)

### 3.4 Optional Fields
- [ ] Website URL can be left empty
- [ ] Invalid URL format → Shows error (if validation implemented)
- [ ] Facebook URL can be left empty
- [ ] Instagram handle can be left empty
- [ ] Twitter handle can be left empty

### 3.5 Form Submission
- [ ] Fill required fields → Click Next → Navigates to Step 3
- [ ] Data persists when navigating back
- [ ] Save Draft works

---

## 4. Step 3: Service Categories & Resources

### 4.1 Data Loading
- [ ] Categories load from API
- [ ] Resources load from API
- [ ] Loading state shows while fetching
- [ ] Categories grouped by target group (Children/Women)

### 4.2 Category Selection
- [ ] Can select multiple categories
- [ ] Can deselect categories
- [ ] Resources filter based on selected categories
- [ ] No categories selected → Click Next → Shows error "Please select at least one service category"

### 4.3 Resource Selection
- [ ] Resources shown only for selected categories
- [ ] Can select multiple resources
- [ ] Can deselect resources
- [ ] No resources selected → Click Next → Shows error "Please select at least one service resource"
- [ ] Resources update when categories change

### 4.4 Form Submission
- [ ] Select at least 1 category and 1 resource → Click Next → Navigates to Step 4
- [ ] Data persists when navigating back
- [ ] Save Draft works

---

## 5. Step 4: Branch Locations

### 5.1 Initial State
- [ ] At least one branch form is visible
- [ ] "Add Branch" button is visible
- [ ] Cannot remove the only branch

### 5.2 Branch Fields
- [ ] Address field visible
- [ ] City dropdown visible
- [ ] State dropdown visible
- [ ] PIN code field visible
- [ ] Operating hours toggle visible

### 5.3 Data Loading
- [ ] States load from API
- [ ] Cities load from API
- [ ] Cities filter based on selected state
- [ ] Loading states work correctly

### 5.3 Branch Validation
- [ ] Address empty → Click Next → Shows error
- [ ] State not selected → Click Next → Shows error
- [ ] City not selected → Click Next → Shows error
- [ ] PIN code empty → Click Next → Shows error
- [ ] PIN code with 5 digits → Shows error "must be exactly 6 digits"
- [ ] Valid PIN code (6 digits) → Error disappears

### 5.4 Operating Hours (Optional)
- [ ] Can toggle operating hours on/off
- [ ] When enabled, day checkboxes appear
- [ ] Can select multiple days
- [ ] Opening time and closing time fields appear
- [ ] Closing time before opening time → Shows error (if validation implemented)

### 5.5 Add/Remove Branches
- [ ] Click "Add Branch" → New branch form appears
- [ ] Can add up to multiple branches (check max limit if any)
- [ ] Click "Remove Branch" → Branch is removed
- [ ] Cannot remove the only branch
- [ ] Each branch maintains its own data

### 5.6 Form Submission
- [ ] Fill at least one branch → Click Next → Navigates to Step 5
- [ ] Multiple branches persist correctly
- [ ] Data persists when navigating back
- [ ] Save Draft works

---

## 6. Step 5: Language Preferences

### 6.1 Data Loading
- [ ] Languages load from API
- [ ] Only active languages are shown
- [ ] Loading state works correctly

### 6.2 Language Selection
- [ ] Search field is visible
- [ ] Can search languages by name
- [ ] Can search languages by code
- [ ] Search filters languages in real-time
- [ ] Can select multiple languages
- [ ] Selected languages show as badges/chips
- [ ] Can deselect languages
- [ ] No languages selected → Click Next → Shows error "Please select at least one language"

### 6.3 Form Submission
- [ ] Select at least 1 language → Click Next → Navigates to Step 6
- [ ] Data persists when navigating back
- [ ] Save Draft works

---

## 7. Step 6: Document Uploads

### 7.1 Registration Certificate (Required)
- [ ] File upload area is visible
- [ ] Drag and drop works
- [ ] Click to upload works
- [ ] File size validation (max 5MB)
  - [ ] Upload 6MB file → Shows error "File exceeds 5MB limit"
- [ ] File type validation
  - [ ] Upload .exe file → Shows error "Only PDF, JPEG, and PNG files are allowed"
  - [ ] Upload .pdf → Works
  - [ ] Upload .jpg → Works
  - [ ] Upload .png → Works
- [ ] Upload progress indicator shows
- [ ] File preview appears after upload
- [ ] "View" button works (opens file in new tab)
- [ ] "Remove" button works
- [ ] Empty → Click Next → Shows error "Registration certificate is required"

### 7.2 Logo (Optional)
- [ ] File upload area is visible
- [ ] Drag and drop works
- [ ] Click to upload works
- [ ] File size validation (max 2MB)
  - [ ] Upload 3MB file → Shows error "File exceeds 2MB limit"
- [ ] File type validation
  - [ ] Upload .pdf → Shows error "Only JPEG, PNG, and SVG files are allowed"
  - [ ] Upload .jpg → Works
  - [ ] Upload .png → Works
  - [ ] Upload .svg → Works
- [ ] Can be left empty
- [ ] Image preview shows after upload

### 7.3 Additional Certificates (Optional)
- [ ] "Add Certificate" button is visible
- [ ] Can add up to 3 additional certificates
- [ ] Cannot add more than 3 certificates
- [ ] Each certificate has its own upload area
- [ ] Can remove individual certificates
- [ ] Validation works for each certificate

### 7.4 Form Submission
- [ ] Upload registration certificate → Click Next → Navigates to Step 7
- [ ] All uploaded files persist when navigating back
- [ ] Save Draft works (file URLs saved)

---

## 8. Step 7: Review & Submit

### 8.1 Data Display
- [ ] All Step 1 data is displayed correctly
- [ ] All Step 2 data is displayed correctly
- [ ] All Step 3 data is displayed correctly (categories/resources names, not IDs)
- [ ] All Step 4 data is displayed correctly (city/state names, not IDs)
- [ ] All Step 5 data is displayed correctly (language names, not IDs)
- [ ] All Step 6 data is displayed correctly (file URLs/names)

### 8.2 Edit Functionality
- [ ] "Edit" button on Step 1 section → Navigates to Step 1
- [ ] "Edit" button on Step 2 section → Navigates to Step 2
- [ ] "Edit" button on Step 3 section → Navigates to Step 3
- [ ] "Edit" button on Step 4 section → Navigates to Step 4
- [ ] "Edit" button on Step 5 section → Navigates to Step 5
- [ ] "Edit" button on Step 6 section → Navigates to Step 6
- [ ] After editing, can navigate back to Step 7
- [ ] Updated data reflects in Step 7

### 8.3 Form Submission
- [ ] "Submit Registration" button is visible
- [ ] Click Submit → Shows loading state
- [ ] API call is made to `/api/registration/submit` (check Network tab)
- [ ] On success → Shows success message
- [ ] On success → Redirects to `/register/success` after 3 seconds
- [ ] Registration ID is displayed
- [ ] Draft is cleared after successful submission
- [ ] On error → Shows error message
- [ ] Can retry submission after error

---

## 9. Success Page

### 9.1 Display
- [ ] Success page loads at `/register/success`
- [ ] Success icon/message is visible
- [ ] Registration ID is displayed
- [ ] "What happens next?" section is visible
- [ ] Next steps are listed
- [ ] "Copy" button for registration ID works

### 9.2 Navigation
- [ ] "Return to Homepage" button works
- [ ] "Register Another Organization" button works
- [ ] "Register Another" clears draft and navigates to Step 1

---

## 10. Draft Save/Resume

### 10.1 Auto-Save
- [ ] Form data auto-saves to localStorage (check DevTools)
- [ ] Auto-save happens after 2 seconds of inactivity
- [ ] Auto-save happens on step navigation
- [ ] Draft data structure is correct (JSON format)

### 10.2 Manual Save
- [ ] "Save Draft" button is visible on all steps
- [ ] Click "Save Draft" → Draft is saved
- [ ] Success message appears (if implemented)

### 10.3 Resume Draft
- [ ] Close browser and reopen
- [ ] Navigate to `/register/step1`
- [ ] Draft data loads automatically
- [ ] Form fields are pre-filled with saved data
- [ ] Can continue from where left off

### 10.4 Clear Draft
- [ ] After successful submission, draft is cleared
- [ ] "Register Another" clears draft
- [ ] Manual clear works (if implemented)

---

## 11. Error Handling

### 11.1 Network Errors
- [ ] Disable network → Try to load categories → Shows error or graceful fallback
- [ ] Disable network → Try to submit → Shows error message
- [ ] Re-enable network → Retry works

### 11.2 API Errors
- [ ] Mock API returns error → Error message displays
- [ ] File upload fails → Error message displays
- [ ] Submission fails → Error message displays
- [ ] Can retry after error

### 11.3 Validation Errors
- [ ] All validation errors are clear and actionable
- [ ] Errors appear below the field
- [ ] Errors disappear when field is corrected
- [ ] Multiple errors show for multiple invalid fields

---

## 12. Mobile Responsiveness (375px Viewport)

### 12.1 Layout
- [ ] All steps are readable on mobile
- [ ] Forms don't overflow horizontally
- [ ] Text is readable (not too small)
- [ ] Buttons are touch-friendly (≥44x44px)

### 12.2 Navigation
- [ ] Progress indicator is visible and readable
- [ ] Back/Next buttons are easily clickable
- [ ] Save Draft button is accessible

### 12.3 Form Fields
- [ ] Input fields are full width
- [ ] Dropdowns are easy to use
- [ ] Checkboxes are easy to tap
- [ ] File upload area is accessible

### 12.4 File Upload
- [ ] Drag and drop works on mobile (if supported)
- [ ] File picker opens correctly
- [ ] Upload progress is visible
- [ ] Preview images are sized correctly

---

## 13. Accessibility

### 13.1 Keyboard Navigation
- [ ] Can tab through all form fields
- [ ] Can submit form with Enter key
- [ ] Focus indicators are visible
- [ ] Can navigate without mouse

### 13.2 Screen Reader
- [ ] All fields have proper labels
- [ ] Error messages are announced
- [ ] Required fields are indicated
- [ ] Progress indicator is accessible

### 13.3 Visual
- [ ] Color contrast is sufficient
- [ ] Error messages are visible (red text)
- [ ] Success messages are visible (green text)
- [ ] Focus states are clear

---

## 14. Performance

### 14.1 Loading Times
- [ ] Initial page load is fast (<2 seconds)
- [ ] API calls complete in reasonable time
- [ ] File uploads show progress
- [ ] No unnecessary re-renders

### 14.2 Data Persistence
- [ ] Form data persists during navigation
- [ ] No data loss on page refresh
- [ ] Draft saves reliably

---

## 15. Browser Compatibility

### 15.1 Chrome
- [ ] All features work correctly
- [ ] No console errors

### 15.2 Firefox
- [ ] All features work correctly
- [ ] No console errors

### 15.3 Safari (if available)
- [ ] All features work correctly
- [ ] No console errors

### 15.4 Edge (if available)
- [ ] All features work correctly
- [ ] No console errors

---

## 16. Edge Cases

### 16.1 Empty Form
- [ ] Can navigate through all steps without filling data
- [ ] Validation prevents submission
- [ ] Can go back and fill data

### 16.2 Maximum Data
- [ ] Enter maximum length text → Works
- [ ] Select all categories/resources → Works
- [ ] Add maximum branches → Works
- [ ] Select all languages → Works
- [ ] Upload maximum files → Works

### 16.3 Special Characters
- [ ] Enter special characters in text fields → Works
- [ ] Enter Unicode characters (Hindi, etc.) → Works
- [ ] Enter emojis → Works (or handled gracefully)

### 16.4 Rapid Navigation
- [ ] Click Next rapidly → Works correctly
- [ ] Click Back rapidly → Works correctly
- [ ] No race conditions

---

## Test Results Summary

**Total Tests:** _______________  
**Passed:** _______________  
**Failed:** _______________  
**Blocked:** _______________  

### Critical Issues Found:
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Minor Issues Found:
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Notes:
_________________________________________________
_________________________________________________
_________________________________________________

---

## Sign-off

**Tester Name:** _______________  
**Date:** _______________  
**Status:** [ ] Pass [ ] Fail [ ] Needs Retest  
**Comments:** _________________________________________________
