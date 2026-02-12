# NASA Sakhi - Manual Testing Checklist
## Organization Registration Portal

**Version:** 1.0  
**Date:** February 2026  
**Tester:** _______________  
**Test Environment:** _______________  
**Browser:** _______________  
**Device:** _______________  

---

## 📋 Pre-Testing Setup

### Environment Configuration
- [ ] `.env.local` file is configured correctly
- [ ] `NEXT_PUBLIC_API_URL` is set (or mock mode is enabled)
- [ ] `NEXT_PUBLIC_USE_REAL_API` is set appropriately
- [ ] Development server is running (`npm run dev`)
- [ ] Application loads at `http://localhost:3000`

### Test Data Preparation
- [ ] Valid organization name ready
- [ ] Valid email address ready
- [ ] Valid phone number ready (10 digits)
- [ ] Test documents ready (PDF, JPEG, PNG)
- [ ] Test logo ready (JPEG, PNG, SVG)

---

## 🧪 Test Suite 1: Navigation & Progress Indicator

### Test Case 1.1: Initial Page Load
**Steps:**
1. Navigate to `http://localhost:3000/register/step1`
2. Observe the page

**Expected Results:**
- [ ] Progress indicator shows "Step 1 of 7"
- [ ] Progress bar shows ~14% (1/7)
- [ ] "Organization" step is highlighted/active
- [ ] "Back" button is NOT visible (first step)
- [ ] "Next" button is visible
- [ ] "Save Draft" button is visible
- [ ] Skip link is available (press Tab to see)

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 1.2: Progress Indicator - Mobile View
**Steps:**
1. Open browser DevTools
2. Set viewport to 375px width (mobile)
3. Navigate to any step

**Expected Results:**
- [ ] Progress indicator shows simplified view
- [ ] Shows "Step X of 7" text
- [ ] Shows current step title
- [ ] Progress bar is visible
- [ ] Full step list is hidden on mobile

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 1.3: Progress Indicator - Desktop View
**Steps:**
1. Set viewport to 1024px+ width (desktop)
2. Navigate through steps

**Expected Results:**
- [ ] All 7 steps are visible
- [ ] Completed steps show checkmark (✓)
- [ ] Current step is highlighted
- [ ] Future steps are grayed out
- [ ] Connector lines show progress

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 2: Step 1 - Organization Details

### Test Case 2.1: Valid Form Submission
**Steps:**
1. Navigate to Step 1
2. Fill in all required fields:
   - Organization Name: "Test NGO Organization"
   - Registration Type: Select "NGO"
   - Registration Number: "REG123456"
   - Year Established: "2010"
3. Click "Next: Contact Information"

**Expected Results:**
- [ ] Form submits successfully
- [ ] Navigates to Step 2
- [ ] Progress indicator updates to "Step 2 of 7"
- [ ] No validation errors shown
- [ ] Data persists (can go back and see it)

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 2.2: Organization Name Validation
**Steps:**
1. Navigate to Step 1
2. Leave Organization Name empty
3. Click outside the field (blur)
4. Try to click "Next"

**Expected Results:**
- [ ] Error message appears: "Organization name must be at least 3 characters"
- [ ] Input border turns red
- [ ] Form does not submit
- [ ] Focus moves to first error field (if accessibility enabled)

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 2.3: Organization Name - Too Short
**Steps:**
1. Enter "AB" in Organization Name (2 characters)
2. Click "Next"

**Expected Results:**
- [ ] Error: "Organization name must be at least 3 characters"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 2.4: Organization Name - Too Long
**Steps:**
1. Enter 101+ characters in Organization Name
2. Click "Next"

**Expected Results:**
- [ ] Error: "Organization name cannot exceed 100 characters"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 2.5: Registration Type - Required
**Steps:**
1. Fill all fields except Registration Type
2. Click "Next"

**Expected Results:**
- [ ] Error: "Please select a registration type"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 2.6: Year Established - Validation
**Steps:**
1. Enter year "1799" (before 1800)
2. Click "Next"

**Expected Results:**
- [ ] Error: "Year must be 1800 or later"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 2.7: Year Established - Future Year
**Steps:**
1. Enter year "2030" (future year)
2. Click "Next"

**Expected Results:**
- [ ] Error: "Year cannot be in the future"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 2.8: Optional Fields (Faith, Social Categories)
**Steps:**
1. Fill required fields only
2. Leave Faith and Social Categories empty
3. Click "Next"

**Expected Results:**
- [ ] Form submits successfully
- [ ] No errors for optional fields
- [ ] Navigates to Step 2

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 2.9: Multiple Social Categories Selection
**Steps:**
1. Select multiple social categories
2. Click "Next"

**Expected Results:**
- [ ] All selected categories are saved
- [ ] Form submits successfully

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 3: Step 2 - Contact Information

### Test Case 3.1: Valid Form Submission
**Steps:**
1. Fill in all required fields:
   - Primary Contact Name: "John Doe"
   - Primary Contact Phone: "9876543210"
   - Primary Contact Email: "john@example.com"
2. Click "Next: Services"

**Expected Results:**
- [ ] Form submits successfully
- [ ] Navigates to Step 3
- [ ] Data persists

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 3.2: Email Validation - Invalid Format
**Steps:**
1. Enter "invalid-email" in Primary Contact Email
2. Click "Next"

**Expected Results:**
- [ ] Error: "Please enter a valid email address"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 3.3: Phone Number Validation - Invalid Format
**Steps:**
1. Enter "12345" (less than 10 digits) in Primary Contact Phone
2. Click "Next"

**Expected Results:**
- [ ] Error: "Phone number must be exactly 10 digits"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 3.4: Phone Number - Invalid Starting Digit
**Steps:**
1. Enter "1234567890" (starts with 1, not 6/7/8/9)
2. Click "Next"

**Expected Results:**
- [ ] Error: "Phone number must start with 6, 7, 8, or 9"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 3.5: Secondary Contact - Optional
**Steps:**
1. Fill primary contact only
2. Do NOT click "Add Secondary Contact"
3. Click "Next"

**Expected Results:**
- [ ] Form submits successfully
- [ ] No errors for missing secondary contact

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 3.6: Secondary Contact - Add/Remove
**Steps:**
1. Click "Add Secondary Contact"
2. Fill secondary contact fields
3. Click "Remove Secondary Contact"
4. Click "Next"

**Expected Results:**
- [ ] Secondary contact section appears when clicked
- [ ] Secondary contact section disappears when removed
- [ ] Form submits successfully without secondary contact

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 3.7: Website URL - Optional
**Steps:**
1. Leave Website URL empty
2. Click "Next"

**Expected Results:**
- [ ] Form submits successfully
- [ ] No errors for empty website URL

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 3.8: Website URL - Invalid Format
**Steps:**
1. Enter "not-a-url" in Website URL
2. Click "Next"

**Expected Results:**
- [ ] Error: "Please enter a valid URL"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 4: Step 3 - Service Categories & Resources

### Test Case 4.1: Load Categories and Resources
**Steps:**
1. Navigate to Step 3
2. Wait for page to load

**Expected Results:**
- [ ] Loading spinner appears initially
- [ ] Categories load successfully
- [ ] Categories are grouped (For Children / For Women)
- [ ] Resources are visible
- [ ] No errors shown

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 4.2: Select Category - Resources Filter
**Steps:**
1. Select a category (e.g., "Education")
2. Observe resources list

**Expected Results:**
- [ ] Resources filter to show only resources for selected category
- [ ] Resources list updates dynamically
- [ ] Unselected category resources are hidden

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 4.3: Select Multiple Categories
**Steps:**
1. Select 2-3 categories
2. Observe resources list

**Expected Results:**
- [ ] Resources from all selected categories are shown
- [ ] Resources are properly filtered
- [ ] No duplicate resources

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 4.4: Select Resources
**Steps:**
1. Select at least one category
2. Select at least one resource from that category
3. Click "Next: Branch Locations"

**Expected Results:**
- [ ] Form submits successfully
- [ ] Navigates to Step 4
- [ ] Selected resources are saved

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 4.5: Validation - No Category Selected
**Steps:**
1. Do NOT select any category
2. Click "Next"

**Expected Results:**
- [ ] Error: "Please select at least one service category"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 4.6: Validation - No Resource Selected
**Steps:**
1. Select a category
2. Do NOT select any resource
3. Click "Next"

**Expected Results:**
- [ ] Error: "Please select at least one resource for each selected category"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 4.7: Deselect Category - Resources Clear
**Steps:**
1. Select a category and some resources
2. Deselect the category
3. Observe resources

**Expected Results:**
- [ ] Resources for deselected category are cleared
- [ ] Resources list updates

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 5: Step 4 - Branch Locations

### Test Case 5.1: Load States and Cities
**Steps:**
1. Navigate to Step 4
2. Wait for page to load

**Expected Results:**
- [ ] Loading spinner appears initially
- [ ] States dropdown populates
- [ ] Cities dropdown is empty initially
- [ ] No errors shown

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 5.2: Select State - Cities Filter
**Steps:**
1. Select a state from dropdown
2. Observe cities dropdown

**Expected Results:**
- [ ] Cities dropdown populates with cities from selected state
- [ ] Cities filter correctly
- [ ] Cities dropdown is enabled

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 5.3: Add First Branch
**Steps:**
1. Fill in branch details:
   - Address Line 1: "123 Main Street"
   - City: Select a city
   - State: Select a state
   - PIN Code: "123456"
2. Click "Next: Language Preferences"

**Expected Results:**
- [ ] Form submits successfully
- [ ] Navigates to Step 5
- [ ] Branch data is saved

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 5.4: Add Multiple Branches
**Steps:**
1. Fill first branch
2. Click "+ Add Another Branch"
3. Fill second branch
4. Click "Next"

**Expected Results:**
- [ ] Second branch section appears
- [ ] Both branches are saved
- [ ] Form submits successfully

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 5.5: Remove Branch
**Steps:**
1. Add 2 branches
2. Click "Remove Branch" on second branch

**Expected Results:**
- [ ] Second branch is removed
- [ ] Only first branch remains
- [ ] "Remove Branch" button hidden when only 1 branch

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 5.6: Address Line 1 - Validation
**Steps:**
1. Enter "Short" (less than 10 characters) in Address Line 1
2. Click "Next"

**Expected Results:**
- [ ] Error: "Address must be at least 10 characters"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 5.7: PIN Code - Validation
**Steps:**
1. Enter "12345" (5 digits) in PIN Code
2. Click "Next"

**Expected Results:**
- [ ] Error: "PIN code must be exactly 6 digits"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 5.8: Operating Hours - Optional
**Steps:**
1. Fill branch details
2. Do NOT add operating hours
3. Click "Next"

**Expected Results:**
- [ ] Form submits successfully
- [ ] No errors for missing operating hours

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 5.9: Operating Hours - Add Hours
**Steps:**
1. Click "Add Hours" button
2. Observe operating hours section

**Expected Results:**
- [ ] Operating hours section appears
- [ ] All 7 days are shown
- [ ] Each day has "Closed" checkbox and time inputs
- [ ] Button text changes to "Hide Hours"

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 5.10: Operating Hours - Set Times
**Steps:**
1. Click "Add Hours"
2. Uncheck "Closed" for Monday
3. Set Open Time: "09:00"
4. Set Close Time: "17:00"
5. Click "Next"

**Expected Results:**
- [ ] Times are saved
- [ ] Form submits successfully
- [ ] Operating hours data persists

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 6: Step 5 - Language Preferences

### Test Case 6.1: Load Languages
**Steps:**
1. Navigate to Step 5
2. Wait for page to load

**Expected Results:**
- [ ] Loading spinner appears initially
- [ ] Languages list loads successfully
- [ ] Search box is visible
- [ ] No errors shown

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 6.2: Search Languages
**Steps:**
1. Type "Hindi" in search box
2. Observe language list

**Expected Results:**
- [ ] Language list filters to show only "Hindi"
- [ ] Filtering happens in real-time
- [ ] Search is case-insensitive

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 6.3: Clear Search
**Steps:**
1. Type in search box
2. Click clear button (X)

**Expected Results:**
- [ ] Search box clears
- [ ] All languages are shown again
- [ ] No languages selected

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 6.4: Select Languages
**Steps:**
1. Select 3-5 languages
2. Click "Next: Document Uploads"

**Expected Results:**
- [ ] Selected languages are checked
- [ ] Form submits successfully
- [ ] Navigates to Step 6
- [ ] Selected languages are saved

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 6.5: Validation - No Language Selected
**Steps:**
1. Do NOT select any language
2. Click "Next"

**Expected Results:**
- [ ] Error: "Please select at least one language"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 6.6: Deselect Language
**Steps:**
1. Select a language
2. Click to deselect it

**Expected Results:**
- [ ] Language is unchecked
- [ ] Selection count updates

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 7: Step 6 - Document Uploads

### Test Case 7.1: Upload Registration Certificate
**Steps:**
1. Navigate to Step 6
2. Click "Click to upload" for Registration Certificate
3. Select a PDF file (< 5MB)
4. Wait for upload

**Expected Results:**
- [ ] File uploads successfully
- [ ] Progress bar shows during upload
- [ ] File preview appears after upload
- [ ] "View" and "Remove" buttons appear
- [ ] File URL is saved

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 7.2: Upload Registration Certificate - Drag and Drop
**Steps:**
1. Drag a PDF file onto the upload area
2. Drop it

**Expected Results:**
- [ ] File uploads successfully
- [ ] Drag area highlights when dragging over
- [ ] File preview appears

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 7.3: File Size Validation - Too Large
**Steps:**
1. Try to upload a file > 5MB
2. Select the file

**Expected Results:**
- [ ] Error: "File exceeds 5MB limit. Please compress or select a different file."
- [ ] File does not upload
- [ ] Error message is clear

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 7.4: File Type Validation - Invalid
**Steps:**
1. Try to upload a .txt or .docx file
2. Select the file

**Expected Results:**
- [ ] Error: "Only PDF, JPEG, and PNG files are allowed."
- [ ] File does not upload

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 7.5: Remove Uploaded File
**Steps:**
1. Upload a file
2. Click "Remove" button

**Expected Results:**
- [ ] File is removed
- [ ] Upload area appears again
- [ ] File URL is cleared

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 7.6: Upload Logo - Optional
**Steps:**
1. Upload Registration Certificate
2. Do NOT upload logo
3. Click "Next: Review & Submit"

**Expected Results:**
- [ ] Form submits successfully
- [ ] No errors for missing logo
- [ ] Navigates to Step 7

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 7.7: Upload Logo - Valid
**Steps:**
1. Upload Registration Certificate
2. Upload a logo (JPEG/PNG/SVG, < 2MB)
3. Click "Next"

**Expected Results:**
- [ ] Logo uploads successfully
- [ ] Logo preview appears (if image)
- [ ] Form submits successfully

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 7.8: Logo - File Size Validation
**Steps:**
1. Try to upload a logo > 2MB

**Expected Results:**
- [ ] Error: "File exceeds 2MB limit. Please compress or select a different file."
- [ ] File does not upload

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 7.9: Additional Certificates - Add
**Steps:**
1. Upload Registration Certificate
2. Click "+ Add Additional Certificate"
3. Upload a certificate

**Expected Results:**
- [ ] Additional certificate section appears
- [ ] File uploads successfully
- [ ] Certificate is saved

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 7.10: Additional Certificates - Maximum (3)
**Steps:**
1. Add 3 additional certificates
2. Try to add a 4th

**Expected Results:**
- [ ] "Add Additional Certificate" button is disabled/hidden
- [ ] Message shows: "Maximum of 3 additional certificates reached"
- [ ] Cannot add more than 3

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 7.11: Additional Certificates - Remove
**Steps:**
1. Add 2 additional certificates
2. Click "Remove" on one

**Expected Results:**
- [ ] Certificate is removed
- [ ] Can add another certificate
- [ ] Remaining certificates are preserved

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 7.12: Validation - Registration Certificate Required
**Steps:**
1. Do NOT upload Registration Certificate
2. Click "Next"

**Expected Results:**
- [ ] Error: "Registration certificate is required"
- [ ] Form does not submit

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 8: Step 7 - Review & Submit

### Test Case 8.1: Review All Data
**Steps:**
1. Navigate to Step 7
2. Review all sections

**Expected Results:**
- [ ] All 6 previous steps' data is displayed
- [ ] Organization details are shown
- [ ] Contact information is shown
- [ ] Services are shown
- [ ] Branches are shown
- [ ] Languages are shown
- [ ] Documents are shown
- [ ] All data is accurate

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 8.2: Edit Button - Navigate to Step
**Steps:**
1. Click "Edit" button on any section (e.g., Organization Details)
2. Observe navigation

**Expected Results:**
- [ ] Navigates to the corresponding step
- [ ] Form data is pre-filled
- [ ] Can make changes and return

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 8.3: Submit Registration
**Steps:**
1. Review all data
2. Click "Submit Registration"
3. Wait for submission

**Expected Results:**
- [ ] Loading state appears ("Submitting...")
- [ ] Registration submits successfully
- [ ] Navigates to success page
- [ ] Success message is shown

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 8.4: Submit - Error Handling
**Steps:**
1. Disconnect internet (or simulate API error)
2. Click "Submit Registration"

**Expected Results:**
- [ ] Error message appears
- [ ] Error is user-friendly
- [ ] Retry option is available
- [ ] Form data is preserved

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 9: Draft Save & Resume

### Test Case 9.1: Manual Save Draft
**Steps:**
1. Fill Step 1 partially
2. Click "Save Draft" button
3. Observe indicator

**Expected Results:**
- [ ] "Saving draft..." indicator appears
- [ ] Success toast: "Draft saved at [time]"
- [ ] "Draft saved at [time]" indicator appears
- [ ] Draft is saved to backend (if API enabled)

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 9.2: Auto-Save (Every 2 Minutes)
**Steps:**
1. Fill some form data
2. Wait 2 minutes without interacting
3. Observe draft indicator

**Expected Results:**
- [ ] Draft saves automatically after 2 minutes
- [ ] "Draft saved at [time]" indicator appears
- [ ] Success toast appears
- [ ] No interruption to user

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 9.3: Resume Draft - Load from Token
**Steps:**
1. Save a draft (note the token from test page or API response)
2. Navigate to `/register/resume?token=YOUR_TOKEN`
3. Observe page

**Expected Results:**
- [ ] Loading spinner appears
- [ ] Draft data loads successfully
- [ ] Draft preview shows:
  - Created/Updated timestamps
  - Progress percentage
  - Summary of filled data
- [ ] "Continue Draft" and "Start Fresh" buttons appear

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 9.4: Resume Draft - Continue
**Steps:**
1. Load draft from token
2. Click "Continue Draft"

**Expected Results:**
- [ ] Draft data loads into form
- [ ] Navigates to last completed step
- [ ] All previous data is pre-filled
- [ ] Can continue from where left off

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 9.5: Resume Draft - Start Fresh
**Steps:**
1. Load draft from token
2. Click "Start Fresh"

**Expected Results:**
- [ ] Draft is cleared
- [ ] Navigates to Step 1
- [ ] Form is empty
- [ ] Can start new registration

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 9.6: Resume Draft - Invalid Token
**Steps:**
1. Navigate to `/register/resume?token=INVALID_TOKEN`
2. Observe page

**Expected Results:**
- [ ] Error message: "Draft not found" or "Invalid token"
- [ ] Error is user-friendly
- [ ] Option to start fresh is available

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 9.7: Resume Draft - Expired Token
**Steps:**
1. Use an expired token (if expiry is implemented)
2. Try to load draft

**Expected Results:**
- [ ] Error message: "Draft link has expired"
- [ ] Option to start fresh is available

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 10: Navigation & Back Button

### Test Case 10.1: Back Button - Navigate Previous Step
**Steps:**
1. Complete Step 1, go to Step 2
2. Click "Back" button

**Expected Results:**
- [ ] Navigates to Step 1
- [ ] Progress indicator updates
- [ ] Form data is preserved
- [ ] Can edit and continue

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 10.2: Back Button - Not on First Step
**Steps:**
1. Navigate to Step 1

**Expected Results:**
- [ ] "Back" button is NOT visible
- [ ] Only "Next" and "Save Draft" buttons visible

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 10.3: Direct URL Navigation
**Steps:**
1. Manually navigate to `/register/step3` in browser
2. Observe behavior

**Expected Results:**
- [ ] If previous steps not completed: Redirects to Step 1 or shows validation
- [ ] If previous steps completed: Shows Step 3 with data
- [ ] Progress indicator shows correct step

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 10.4: Browser Back Button
**Steps:**
1. Navigate through steps 1 → 2 → 3
2. Click browser back button

**Expected Results:**
- [ ] Navigates to previous step
- [ ] Form data is preserved
- [ ] Progress indicator updates

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 11: Mobile Responsiveness

### Test Case 11.1: Mobile Viewport (375px)
**Steps:**
1. Set viewport to 375px width
2. Navigate through all steps

**Expected Results:**
- [ ] All content fits within viewport
- [ ] No horizontal scrolling
- [ ] Text is readable
- [ ] Buttons are touch-friendly (44x44px minimum)
- [ ] Forms stack vertically
- [ ] Progress indicator shows simplified view

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 11.2: Mobile - Form Inputs
**Steps:**
1. Set viewport to 375px
2. Test all form inputs

**Expected Results:**
- [ ] Inputs are full-width or appropriately sized
- [ ] Inputs have `text-base` (prevents iOS zoom)
- [ ] Touch targets are 44x44px minimum
- [ ] Labels are visible and clear

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 11.3: Mobile - Buttons
**Steps:**
1. Set viewport to 375px
2. Test all buttons

**Expected Results:**
- [ ] Buttons stack vertically on mobile
- [ ] Primary button is full-width
- [ ] All buttons are 44x44px minimum
- [ ] Buttons are easily tappable

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 11.4: Mobile - File Upload
**Steps:**
1. Set viewport to 375px
2. Test file upload component

**Expected Results:**
- [ ] Upload area is appropriately sized
- [ ] Drag-and-drop works on mobile
- [ ] File selection works
- [ ] Preview is responsive

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 11.5: Mobile - Toast Notifications
**Steps:**
1. Set viewport to 375px
2. Trigger a toast (save draft, error, etc.)

**Expected Results:**
- [ ] Toast appears in visible area
- [ ] Toast is readable
- [ ] Toast doesn't overlap content
- [ ] Toast is dismissible

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 12: Accessibility

### Test Case 12.1: Keyboard Navigation
**Steps:**
1. Use only keyboard (Tab, Enter, Space, Arrow keys)
2. Navigate through entire form

**Expected Results:**
- [ ] All interactive elements are focusable
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Can complete entire form with keyboard
- [ ] Skip link works (Tab on page load)

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 12.2: Screen Reader - Labels
**Steps:**
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate through form

**Expected Results:**
- [ ] All inputs have descriptive labels
- [ ] Required fields are announced
- [ ] Error messages are announced
- [ ] Progress is announced
- [ ] Buttons have descriptive labels

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 12.3: ARIA Attributes
**Steps:**
1. Inspect form elements with DevTools
2. Check ARIA attributes

**Expected Results:**
- [ ] `aria-label` on buttons
- [ ] `aria-describedby` on inputs
- [ ] `aria-invalid` on error fields
- [ ] `aria-live` on dynamic content
- [ ] `aria-expanded` on collapsible sections

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 12.4: Focus Management - Error Fields
**Steps:**
1. Submit form with errors
2. Observe focus behavior

**Expected Results:**
- [ ] Focus moves to first error field
- [ ] Error field is scrolled into view
- [ ] Error message is announced

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 12.5: Color Contrast
**Steps:**
1. Check text colors against backgrounds
2. Use contrast checker tool

**Expected Results:**
- [ ] Text contrast ratio ≥ 4.5:1
- [ ] Error text is readable
- [ ] Success text is readable
- [ ] All text meets WCAG AA standards

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 13: Error Handling & Notifications

### Test Case 13.1: Network Error
**Steps:**
1. Disconnect internet
2. Try to submit form or save draft

**Expected Results:**
- [ ] Error message: "Network error. Please check your internet connection and try again."
- [ ] Error is user-friendly
- [ ] Retry option is available
- [ ] Form data is preserved

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 13.2: API Error - 500
**Steps:**
1. Simulate 500 error (if possible)
2. Try to submit form

**Expected Results:**
- [ ] Error message is shown
- [ ] Error is user-friendly (not technical)
- [ ] Retry option is available

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 13.3: Loading States
**Steps:**
1. Trigger API calls (load categories, submit form, etc.)
2. Observe loading states

**Expected Results:**
- [ ] Loading spinner appears
- [ ] Loading text is shown
- [ ] Buttons are disabled during loading
- [ ] User knows system is working

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 13.4: Success Notifications
**Steps:**
1. Save draft successfully
2. Submit form successfully

**Expected Results:**
- [ ] Success toast appears
- [ ] Success message is clear
- [ ] Toast auto-dismisses after 3-5 seconds
- [ ] Toast is dismissible manually

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 13.5: Retry Logic
**Steps:**
1. Trigger an API error
2. Click retry button (if available)

**Expected Results:**
- [ ] Retry attempts the operation again
- [ ] Loading state shows during retry
- [ ] Success/error handled appropriately

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 14: Success Page

### Test Case 14.1: Success Page Display
**Steps:**
1. Complete registration successfully
2. Observe success page

**Expected Results:**
- [ ] Success message is shown
- [ ] Registration ID/reference is displayed (if available)
- [ ] Next steps are explained
- [ ] Page is visually appealing

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 14.2: Success Page - Mobile
**Steps:**
1. Complete registration on mobile viewport
2. Observe success page

**Expected Results:**
- [ ] Success page is responsive
- [ ] Content is readable
- [ ] No layout issues

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 🧪 Test Suite 15: API Integration (If Real API Enabled)

### Test Case 15.1: Fetch Categories
**Steps:**
1. Enable real API mode
2. Navigate to Step 3

**Expected Results:**
- [ ] Categories load from real API
- [ ] No errors
- [ ] Data is correct

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 15.2: Save Draft to Backend
**Steps:**
1. Enable real API mode
2. Save a draft
3. Check backend/database

**Expected Results:**
- [ ] Draft is saved to backend
- [ ] Token is returned
- [ ] Draft can be retrieved

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 15.3: Submit Registration
**Steps:**
1. Enable real API mode
2. Complete and submit registration

**Expected Results:**
- [ ] Registration is submitted to backend
- [ ] Success response is received
- [ ] Data is stored correctly

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

### Test Case 15.4: File Upload to Backend
**Steps:**
1. Enable real API mode
2. Upload a file

**Expected Results:**
- [ ] File is uploaded to backend/storage
- [ ] File URL is returned
- [ ] File is accessible

**Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _______________

---

## 📊 Test Summary

### Overall Test Results

| Test Suite | Total Cases | Passed | Failed | Skipped |
|------------|-------------|--------|--------|---------|
| Navigation & Progress | 3 | | | |
| Step 1 - Organization | 9 | | | |
| Step 2 - Contact | 8 | | | |
| Step 3 - Services | 7 | | | |
| Step 4 - Branches | 10 | | | |
| Step 5 - Languages | 6 | | | |
| Step 6 - Documents | 12 | | | |
| Step 7 - Review | 4 | | | |
| Draft Save & Resume | 7 | | | |
| Navigation & Back | 4 | | | |
| Mobile Responsiveness | 5 | | | |
| Accessibility | 5 | | | |
| Error Handling | 5 | | | |
| Success Page | 2 | | | |
| API Integration | 4 | | | |
| **TOTAL** | **101** | | | |

### Critical Issues Found

1. _______________
2. _______________
3. _______________

### Minor Issues Found

1. _______________
2. _______________
3. _______________

### Recommendations

1. _______________
2. _______________
3. _______________

---

## ✅ Sign-off

**Tester Name:** _______________  
**Date:** _______________  
**Status:** ⬜ Pass / ⬜ Fail / ⬜ Needs Rework  
**Comments:** _______________

---

**Last Updated:** February 2026
