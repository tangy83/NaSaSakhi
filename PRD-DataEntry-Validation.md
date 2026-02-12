# PRD Segment: Data Entry & Validation
## NASA Sakhi - Organization Registration Portal

**Version:** 1.0
**Date:** February 2, 2026
**Focus Area:** Data Entry, Form Validation, and Data Quality
**Extracted From:** Main PRD v1.0

---

## Table of Contents

1. [Overview](#overview)
2. [User Goals - Data Entry Perspective](#user-goals)
3. [Data Entry Requirements](#data-entry-requirements)
4. [Validation Requirements](#validation-requirements)
5. [Form Field Specifications](#form-field-specifications)
6. [Error Handling](#error-handling)
7. [Data Quality Assurance](#data-quality-assurance)
8. [Success Metrics](#success-metrics)
9. [User Stories](#user-stories)

---

## 1. Overview

This document segments the data entry and validation requirements for the NASA Sakhi organization registration portal. It focuses on the user-facing data collection process, validation rules, error handling, and data quality measures.

**Key Objectives:**
- Enable organizations to complete registration in <20 minutes
- Maintain >95% data accuracy through robust validation
- Achieve >70% form completion rate
- Ensure data quality for 121 migrated organizations + new registrations

---

## 2. User Goals - Data Entry Perspective

### For Organizations (Data Entry Users)

**Primary Goals:**
- Complete registration in <20 minutes (median time)
- Provide accurate information without confusion
- Save progress and resume later if interrupted
- Understand validation errors and how to fix them
- Enter data in their preferred language (30 languages supported)
- Upload required documents easily

**Pain Points to Address:**
- Complex forms with unclear requirements
- Losing data due to timeouts or crashes
- Validation errors that don't explain what's wrong
- Language barriers (English-only forms)
- Unclear which fields are required vs optional
- File upload failures without clear error messages

**User Needs:**
- Clear, simple form labels and help text
- Real-time validation feedback
- Progress indicators (know which step they're on)
- Auto-save functionality
- Ability to skip optional fields
- Visual confirmation when data is saved

---

### For Administrators (Data Review Users)

**Primary Goals:**
- Review submissions efficiently (target: <48 hours per submission)
- Validate organization authenticity
- Identify incomplete or inaccurate data quickly
- Monitor data quality metrics across all submissions

**Pain Points to Address:**
- Incomplete submissions requiring back-and-forth communication
- Duplicate organization entries
- Missing or invalid verification documents
- Inconsistent data formats (phone numbers, addresses)

**User Needs:**
- Clear view of validation status for each submission
- Ability to request specific missing information
- Automated duplicate detection
- Data completeness indicators

---

## 3. Data Entry Requirements

### FR-1: Multi-Step Registration Form

**Priority:** P0 (Must Have)

**Description:** Organizations complete registration through a wizard-style 7-step form with clear progress indication and data persistence.

---

#### **Step 1: Organization Details**

**Required Fields:**
- Organization name (text, 100 chars max)
  - Supports multilingual input (Unicode)
  - Validation: Non-empty, min 3 characters

- Registration type (dropdown, single-select)
  - Options: NGO, Trust, Government, Private, Other
  - Validation: Must select one option

- Registration number/certificate (text, 50 chars max)
  - Validation: Non-empty, alphanumeric + hyphens allowed
  - Format: Country-specific validation (India: varies by state)

- Year of establishment (number picker)
  - Validation: Between 1800 and current year
  - Input type: 4-digit year

**Optional Fields:**
- Faith/religious affiliation (dropdown, single-select)
  - Options: Loaded from database (Faith table)
  - Default: "Prefer not to say"

- Social category served (dropdown, multi-select)
  - Options: Loaded from database (SocialCategory table)
  - Help text: "Select all that apply"

**Step Completion Criteria:**
- All required fields filled
- All validations pass
- No blocking errors

---

#### **Step 2: Contact Information**

**Required Fields:**

**Primary Contact:**
- Contact name (text, 100 chars max)
  - Validation: Non-empty, min 2 characters
  - Format: Letters, spaces, hyphens, apostrophes only

- Phone number (text, formatted input)
  - Validation: Exactly 10 digits (Indian format)
  - Format: Auto-format as +91-XXXXX-XXXXX
  - Must be valid Indian mobile/landline number

- Email address (text, email input)
  - Validation: Valid email format (RFC 5322)
  - Max 100 characters
  - Unique check: Warn if email already exists in system

**Optional Fields:**

**Secondary Contact:**
- Contact name (text, 100 chars max)
- Phone number (10 digits)
- Email address (valid email format)

**Online Presence:**
- Website URL (text, URL input)
  - Validation: Valid URL format (http/https)
  - Auto-prepend "https://" if missing

- Facebook URL (text, URL input)
  - Validation: Must be facebook.com domain
  - Help text: "Paste your Facebook page URL"

- Instagram handle (text)
  - Validation: Alphanumeric + underscore, no spaces
  - Auto-prepend "@" if missing

- Twitter/X handle (text)
  - Validation: Alphanumeric + underscore, no spaces
  - Max 15 characters

**Step Completion Criteria:**
- All required primary contact fields filled
- Phone and email validations pass
- If secondary contact is started, name is required

---

#### **Step 3: Service Categories & Resources**

**Purpose:** Organizations select which services they provide from a standardized taxonomy.

**Service Categories (14 total):**

**For Children (7):**
1. Education Support
2. Child Protection
3. Healthcare
4. Nutrition
5. Recreation
6. Skill Development
7. Legal Aid for Children

**For Women (7):**
1. Women's Healthcare
2. Legal Support for Women
3. Skill Training
4. Shelter/Safe Housing
5. Counseling Services
6. Economic Empowerment
7. Awareness Programs

**Data Entry Flow:**

1. **Category Selection** (required, multi-select)
   - Display all 14 categories with checkboxes
   - Validation: Must select at least 1 category
   - Help text: "Select all categories where you provide services"
   - Visual grouping: "Services for Children" and "Services for Women"

2. **Resource Selection** (required, multi-select per category)
   - After selecting a category, show associated resources
   - Each category has 4-8 specific resources (76 total across all categories)
   - Validation: Must select at least 1 resource per selected category
   - Search/filter capability: Type to filter resource list
   - Help text: "Select specific services you offer in [Category Name]"

**Example:**
- If user selects "Women's Healthcare", show resources like:
  - Maternal health services
  - Reproductive health services
  - General health checkups
  - Mental health services
  - Preventive care programs
  - [etc.]

**Validation Rules:**
- Minimum: 1 category + 1 resource
- Maximum: All 14 categories (no limit on resources)
- Error if category selected but no resources chosen
- Warning if >10 categories selected: "Are you sure you offer this many services?"

**Step Completion Criteria:**
- At least 1 category selected
- Each selected category has ≥1 resource selected
- No validation errors

---

#### **Step 4: Branch Locations**

**Purpose:** Organizations specify physical locations where services are provided.

**Data Entry:** Dynamic form - can add/remove multiple branches

**Branch Entry (repeatable):**

**Required Fields per Branch:**

1. **Address Line 1** (text, 200 chars max)
   - Validation: Non-empty, min 10 characters
   - Help text: "Building number, street name"
   - Example: "123 MG Road, Koramangala"

2. **Address Line 2** (text, 200 chars max, optional)
   - Help text: "Landmark, area, locality"
   - Example: "Near Forum Mall"

3. **City** (dropdown with autocomplete, searchable)
   - Options: Loaded from database (City table)
   - Validation: Must select from list (no free text)
   - Search functionality: Type to filter cities
   - Shows state name alongside city for clarity

4. **State** (dropdown, single-select)
   - Options: All 28 Indian states + 8 Union Territories
   - Auto-populated based on selected city
   - Can be manually changed if needed

5. **PIN Code** (text, formatted input)
   - Validation: Exactly 6 digits
   - Format: Numbers only, no spaces/hyphens
   - Real-time validation: Check if PIN exists in Indian postal system
   - Auto-suggest city/state based on PIN code

6. **Country** (dropdown, default: India)
   - Default: India (locked for MVP)
   - Future: Support other countries

**Optional Fields per Branch:**

7. **Geographic Coordinates** (hidden in MVP, future feature)
   - Latitude (decimal, -90 to 90)
   - Longitude (decimal, -180 to 180)
   - Future: Map picker interface

8. **Branch Operating Hours** (time picker, day-wise)
   - For each day of week (Mon-Sun):
     - Checkbox: "Open on [Day]" (checked by default)
     - If open: Opening time (HH:MM AM/PM)
     - If open: Closing time (HH:MM AM/PM)
     - If closed: Show "Closed" badge
   - Validation: Closing time must be after opening time
   - Quick actions:
     - "Copy to all days"
     - "Clear all"
     - "Same as previous branch"

**Branch Management:**
- **Add Branch:** "Add Another Branch" button (max 50 branches)
- **Remove Branch:** Delete icon on each branch (min 1 branch required)
- **Reorder:** Drag-and-drop to reorder branches (optional)
- **Duplicate:** "Copy from Branch 1" option for easier data entry

**Validation Rules:**
- Minimum: 1 branch required
- Maximum: 50 branches (soft limit, can be increased)
- Each branch must have complete address (Address 1, City, State, PIN)
- PIN code must match selected city/state (cross-validation)
- If operating hours provided, opening < closing time
- Duplicate detection: Warn if same address entered twice

**Step Completion Criteria:**
- At least 1 branch with complete address
- All PIN codes are 6 digits
- No validation errors on any branch

---

#### **Step 5: Language Preferences**

**Purpose:** Specify which languages the organization can communicate in.

**Supported Languages (30):**
Hindi, English, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Sanskrit, Konkani, Nepali, Sindhi, Dogri, Kashmiri, Manipuri, Bodo, Santali, Meitei, Tulu, Bhojpuri, Magahi, Haryanvi, Rajasthani, Chhattisgarhi

**Data Entry:**
- Multi-select checkboxes (grouped by region)
- Validation: Must select at least 1 language
- Default: English and Hindi pre-selected
- Help text: "Select all languages in which you can provide services"

**Visual Organization:**
- Group 1: Major languages (Hindi, English, Bengali, Telugu, Marathi, Tamil)
- Group 2: Regional languages (by state)
- Search bar: Type to filter languages

**Validation Rules:**
- Minimum: 1 language required
- Maximum: All 30 languages (no upper limit)
- Suggested: Automatically suggest languages based on organization's state

**Step Completion Criteria:**
- At least 1 language selected

---

#### **Step 6: Document Uploads**

**Purpose:** Upload verification documents and organization branding.

**Required Uploads:**

1. **Registration Certificate** (1 file required)
   - File types: PDF, JPEG, PNG
   - Max size: 5MB
   - Validation:
     - File type whitelist enforced
     - File size check before upload
     - Virus/malware scanning on upload
   - Preview: Show thumbnail after upload
   - Actions: View, Replace, Remove

**Optional Uploads:**

2. **Organization Logo** (1 file optional)
   - File types: JPEG, PNG, SVG
   - Max size: 2MB
   - Recommended dimensions: 500x500px (square)
   - Validation:
     - Image format check
     - Aspect ratio warning if not square
   - Preview: Show image preview after upload

3. **Additional Certifications** (max 3 files, optional)
   - File types: PDF, JPEG, PNG
   - Max size: 5MB each
   - Examples: Trust deed, 80G certificate, FCRA registration
   - Preview: Show file name + size after upload

**Upload Behavior:**
- Drag-and-drop support
- Click to browse file picker
- Progress bar during upload
- Success/error notification after upload
- Automatic upload on file selection (no separate upload button)

**Validation Rules:**
- Registration certificate is mandatory
- File type must be in whitelist (reject .exe, .zip, etc.)
- File size within limits (reject >5MB for docs, >2MB for logo)
- Total storage per organization: 20MB max

**Error Handling:**
- File too large: "File exceeds 5MB limit. Please compress or select a different file."
- Invalid type: "Only PDF, JPEG, and PNG files are allowed."
- Upload failed: "Upload failed. Please check your connection and try again."
- Virus detected: "File upload blocked for security reasons. Please contact support."

**Step Completion Criteria:**
- Registration certificate uploaded successfully
- All uploaded files pass validation
- No upload errors

---

#### **Step 7: Review & Submit**

**Purpose:** Final review of all entered data before submission.

**Display Format:**
- Read-only summary of all 6 previous steps
- Organized in expandable/collapsible sections
- Edit buttons for each section (navigates back to that step)

**Summary Sections:**

1. **Organization Details**
   - Name, type, registration number, year
   - Faith, social category (if provided)
   - Edit button → returns to Step 1

2. **Contact Information**
   - Primary contact (name, phone, email)
   - Secondary contact (if provided)
   - Social media links (if provided)
   - Edit button → returns to Step 2

3. **Services Offered**
   - List of selected categories
   - Resources under each category (collapsed by default)
   - Edit button → returns to Step 3

4. **Branch Locations** (X branches)
   - Each branch shown as a card:
     - Full address
     - Operating hours (if provided)
   - Edit button → returns to Step 4

5. **Languages**
   - Comma-separated list of languages
   - Edit button → returns to Step 5

6. **Uploaded Documents**
   - Registration certificate (with download/preview link)
   - Logo (with preview)
   - Additional documents (with download links)
   - Edit button → returns to Step 6

**Final Actions:**

1. **Terms & Conditions** (required checkbox)
   - Text: "I confirm that all information provided is accurate and I agree to the [Terms & Conditions](link)"
   - Validation: Must be checked to enable submit
   - Link opens terms in new tab

2. **Submit Button**
   - Disabled until terms are checked
   - Text: "Submit Registration"
   - Confirmation modal: "Are you sure you want to submit? You can edit later if needed."

**Post-Submission:**
- Show success message
- Display submission ID
- Send confirmation email
- Redirect to status page

**Step Completion Criteria:**
- User reviews all information
- Terms & conditions checkbox is checked
- User clicks Submit button
- Confirmation modal accepted

---

### FR-3: Draft Saving & Resume

**Priority:** P1 (Should Have)

**Purpose:** Allow users to save incomplete forms and resume later, reducing abandonment.

**Auto-Save Functionality:**
- Trigger: Every 2 minutes while user is active
- Trigger: On step navigation (moving between steps)
- Trigger: On field blur (after user leaves a field)
- Indicator: Small "Saved" message with timestamp
- No user action required

**Manual Save:**
- "Save Draft" button visible on all steps
- Location: Top-right corner, always accessible
- Click action: Immediately saves current progress
- Feedback: "Draft saved successfully" toast notification

**Draft Management:**
- Storage: Database (associated with user session/email)
- Expiry: 30 days from last update
- Email reminder: Sent 25 days after last update ("Draft expiring soon")

**Resume Functionality:**
- Auto-resume: If user returns with same session, auto-load draft
- Email link: Send "Resume Registration" link to user's email
- Link format: `/register/resume?token=[secure-token]`
- Token validation: Single-use, expires after 30 days
- On resume: Load to last completed step

**Data Persistence:**
- All form fields saved (except file uploads in progress)
- Completed file uploads saved
- Step progression saved
- Validation errors cleared (re-validate on resume)

**User Experience:**
- Clear indication: "You have a draft in progress. Continue or start fresh?"
- Preview: Show draft creation date and last updated timestamp
- Option to discard draft and start over

---

## 4. Validation Requirements

### FR-2: Form Validation & Error Handling

**Priority:** P0 (Must Have)

**Validation Strategy:** Multi-layered validation approach

---

### 4.1 Client-Side Validation (Real-Time)

**Purpose:** Immediate feedback to users before submission

**Validation Triggers:**
1. **On Blur** (when user leaves a field)
   - Validate individual field
   - Show error message below field if invalid
   - Show success checkmark if valid

2. **On Change** (as user types)
   - For specific fields only:
     - Email: Check format as user types
     - Phone: Auto-format and validate length
     - PIN code: Validate length (6 digits)
   - Debounce: Wait 500ms after last keystroke

3. **On Submit** (per step or final submission)
   - Validate all fields on current step
   - Prevent progression if errors exist
   - Scroll to first error
   - Focus on first invalid field

**Validation Rules by Field Type:**

#### Text Fields (Names, Addresses)
- **Min length:** Varies by field (e.g., organization name: 3 chars)
- **Max length:** Enforced (e.g., 100 chars for names)
- **Character restrictions:**
  - Names: Letters, spaces, hyphens, apostrophes only
  - Addresses: Letters, numbers, spaces, common punctuation
- **Trim whitespace:** Auto-trim leading/trailing spaces
- **Required check:** Non-empty after trimming

#### Email Fields
- **Format validation:** RFC 5322 email format
  - Regex pattern: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- **Domain validation:** Check for common typos (gmail.con → gmail.com)
- **Uniqueness:** Warn if email already exists (not blocking, just warning)
- **Required:** For primary contact

#### Phone Number Fields
- **Format:** Indian phone numbers
  - Mobile: 10 digits starting with 6/7/8/9
  - Landline: 10 digits with STD code
- **Auto-formatting:** Add +91 prefix, format as +91-XXXXX-XXXXX
- **Validation:** Exactly 10 digits
- **Duplicate check:** Warn if phone already exists

#### PIN Code Fields
- **Format:** Exactly 6 digits
- **Validation:** Check against Indian PIN code database
- **Cross-validation:** Verify PIN matches selected city/state
- **Auto-suggest:** Suggest city/state based on PIN code

#### Year Fields
- **Range:** Between 1800 and current year
- **Format:** 4-digit number
- **Validation:** Cannot be in future

#### URL Fields
- **Format:** Valid URL structure
  - Pattern: `^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`
- **Auto-fix:** Prepend https:// if missing
- **Domain-specific:**
  - Facebook: Must contain facebook.com
  - Instagram: Must contain instagram.com
- **Optional:** Can be left blank

#### File Upload Fields
- **File type:** Whitelist validation
  - Documents: .pdf, .jpg, .jpeg, .png
  - Logo: .jpg, .jpeg, .png, .svg
  - Reject: .exe, .zip, .doc, .docx, etc.
- **File size:**
  - Documents: Max 5MB
  - Logo: Max 2MB
- **Virus scan:** Server-side scanning on upload
- **Required:** Registration certificate is mandatory

---

### 4.2 Server-Side Validation (Security Layer)

**Purpose:** Enforce validation rules on backend, prevent bypass of client-side checks

**Validation Points:**
1. **On draft save:** Validate saved data structure
2. **On step progression:** Re-validate previous steps
3. **On final submission:** Comprehensive validation of entire form

**Server Validation Rules:**
- **Re-validate all client-side rules** (never trust client)
- **Business logic validation:**
  - Check if organization name + city already exists (duplicate)
  - Verify registration number format for selected type
  - Ensure selected resources belong to selected categories
  - Verify city belongs to selected state
- **Authorization checks:**
  - User has permission to submit/edit
  - Draft belongs to authenticated user
- **Rate limiting:**
  - Max 5 submissions per IP per hour
  - Max 3 draft saves per minute

**Response Format:**
- **Success:** `{ success: true, data: {...} }`
- **Validation errors:** `{ success: false, errors: [{field, message}] }`
- **System errors:** `{ success: false, error: "System error message" }`

---

### 4.3 Validation Error Messages

**Principle:** Clear, actionable, non-technical language

**Error Message Templates:**

| Field | Error Condition | Error Message |
|-------|----------------|---------------|
| Organization Name | Empty | "Organization name is required" |
| Organization Name | Too short (< 3 chars) | "Organization name must be at least 3 characters" |
| Organization Name | Too long (> 100 chars) | "Organization name cannot exceed 100 characters" |
| Email | Empty (required) | "Email address is required" |
| Email | Invalid format | "Please enter a valid email address (e.g., name@example.com)" |
| Email | Already exists | "This email is already registered. [Sign in instead?]" |
| Phone | Empty (required) | "Phone number is required" |
| Phone | Invalid format | "Please enter a valid 10-digit phone number" |
| Phone | Invalid digits | "Phone number must start with 6, 7, 8, or 9" |
| PIN Code | Empty (required) | "PIN code is required" |
| PIN Code | Invalid length | "PIN code must be exactly 6 digits" |
| PIN Code | Doesn't match city | "This PIN code doesn't match the selected city. Please check." |
| Service Category | None selected | "Please select at least one service category" |
| Service Resource | None selected | "Please select at least one service resource for [Category Name]" |
| File Upload | File too large | "File size exceeds [X]MB limit. Please compress or choose a smaller file." |
| File Upload | Invalid type | "Only PDF, JPEG, and PNG files are allowed." |
| File Upload | Upload failed | "Upload failed. Please check your internet connection and try again." |
| File Upload | Virus detected | "File upload blocked for security reasons. Please contact support." |
| Registration Cert | Missing | "Registration certificate is required to proceed" |
| Branch Address | Empty | "Branch address is required" |
| Branch Address | Too short | "Please enter a complete address (at least 10 characters)" |
| City | Not selected | "Please select a city from the list" |
| State | Not selected | "Please select a state" |
| Language | None selected | "Please select at least one language" |
| Operating Hours | Invalid | "Closing time must be after opening time" |
| Terms & Conditions | Not checked | "You must agree to the terms and conditions to proceed" |

**Error Display:**
- **Location:** Below the invalid field (inline)
- **Style:** Red text with error icon
- **Accessibility:** ARIA labels for screen readers
- **Multiple errors:** Show all errors for a field simultaneously
- **Error summary:** At top of step if multiple fields have errors

---

### 4.4 Duplicate Detection

**Priority:** P1 (Should Have)

**Purpose:** Prevent duplicate organizations from being registered

**Detection Logic:**

**Level 1: Exact Match (Blocking)**
- Organization name (case-insensitive) + City = exact match
- Action: Block submission, show error
- Message: "An organization with this name already exists in [City]. If this is your organization, please [contact support]."

**Level 2: Fuzzy Match (Warning)**
- Organization name similarity > 85% (Levenshtein distance)
- Same city
- Action: Show warning, allow proceed
- Message: "We found a similar organization: '[Similar Org Name]'. Is this the same organization? [Yes, use existing] [No, continue]"

**Level 3: Contact Match (Warning)**
- Same email address or phone number
- Action: Show warning, allow proceed
- Message: "This email/phone is already registered with '[Org Name]'. Are you sure this is a different organization?"

**Admin Review:**
- All warnings logged for admin review
- Admin can merge duplicates or mark as "not duplicate"

---

## 5. Form Field Specifications

### Complete Field Reference Table

| Step | Field Name | Type | Required | Max Length | Validation Rules | Default Value |
|------|-----------|------|----------|------------|------------------|---------------|
| **1. Organization Details** |
| 1 | Organization Name | Text | Yes | 100 | Min 3 chars, no special chars | - |
| 1 | Registration Type | Dropdown | Yes | - | One of: NGO, Trust, Govt, Private, Other | - |
| 1 | Registration Number | Text | Yes | 50 | Alphanumeric + hyphens | - |
| 1 | Year of Establishment | Number | Yes | 4 | 1800 ≤ year ≤ current year | - |
| 1 | Faith/Religion | Dropdown | No | - | From database list | "Prefer not to say" |
| 1 | Social Category | Multi-select | No | - | From database list | [] |
| **2. Contact Information** |
| 2 | Primary Contact Name | Text | Yes | 100 | Min 2 chars, letters only | - |
| 2 | Primary Contact Phone | Tel | Yes | 10 | Exactly 10 digits, starts with 6/7/8/9 | - |
| 2 | Primary Contact Email | Email | Yes | 100 | Valid email format | - |
| 2 | Secondary Contact Name | Text | No | 100 | Min 2 chars, letters only | - |
| 2 | Secondary Contact Phone | Tel | No | 10 | Exactly 10 digits | - |
| 2 | Secondary Contact Email | Email | No | 100 | Valid email format | - |
| 2 | Website URL | URL | No | 200 | Valid URL format | - |
| 2 | Facebook URL | URL | No | 200 | Must contain facebook.com | - |
| 2 | Instagram Handle | Text | No | 30 | Alphanumeric + underscore | - |
| 2 | Twitter Handle | Text | No | 15 | Alphanumeric + underscore | - |
| **3. Service Categories & Resources** |
| 3 | Service Categories | Checkbox group | Yes | - | Min 1 selected | [] |
| 3 | Service Resources | Checkbox group | Yes | - | Min 1 per category | [] |
| **4. Branch Locations** (repeatable) |
| 4 | Address Line 1 | Text | Yes | 200 | Min 10 chars | - |
| 4 | Address Line 2 | Text | No | 200 | - | - |
| 4 | City | Dropdown | Yes | - | From database list | - |
| 4 | State | Dropdown | Yes | - | One of 28 states + 8 UTs | Auto-filled from city |
| 4 | PIN Code | Text | Yes | 6 | Exactly 6 digits | - |
| 4 | Country | Dropdown | Yes | - | Default: India | "India" |
| 4 | Operating Hours (Mon-Sun) | Time range | No | - | Open < Close time | - |
| **5. Language Preferences** |
| 5 | Languages | Checkbox group | Yes | - | Min 1 selected | ["English", "Hindi"] |
| **6. Document Uploads** |
| 6 | Registration Certificate | File | Yes | 5MB | PDF/JPEG/PNG | - |
| 6 | Organization Logo | File | No | 2MB | JPEG/PNG/SVG | - |
| 6 | Additional Certificates | File (×3) | No | 5MB each | PDF/JPEG/PNG | - |
| **7. Review & Submit** |
| 7 | Terms & Conditions | Checkbox | Yes | - | Must be checked | false |

---

## 6. Error Handling

### 6.1 Error Types & Handling Strategy

#### **Type 1: Validation Errors (User-fixable)**

**Characteristics:**
- User input doesn't meet validation rules
- Can be fixed by user correcting input

**Examples:**
- Email format invalid
- Phone number too short
- Required field empty
- File size too large

**Handling:**
- Show inline error message below field
- Highlight field with red border
- Prevent step progression
- Scroll to first error
- Keep error visible until fixed

**User Actions:**
- Correct the input
- Error disappears automatically on re-validation

---

#### **Type 2: System Errors (Technical issues)**

**Characteristics:**
- Server errors, network issues, database problems
- Not caused by user input
- User cannot directly fix

**Examples:**
- Network timeout during save
- Server 500 error
- Database connection failure
- File upload server error

**Handling:**
- Show error notification (toast/modal)
- Provide clear error message in plain language
- Offer retry action
- Auto-save draft if possible
- Log error details for debugging

**Error Messages:**
- "Something went wrong. Please try again."
- "Connection lost. Checking your internet connection..."
- "Unable to save. Retrying automatically..."

**User Actions:**
- Retry button
- Auto-retry (3 attempts, exponential backoff)
- Contact support link

---

#### **Type 3: Warning Messages (Non-blocking)**

**Characteristics:**
- Potential issues that don't prevent submission
- Informational, not errors

**Examples:**
- Duplicate organization warning (fuzzy match)
- Email already exists (might be same user)
- Unusual number of services selected (>10 categories)

**Handling:**
- Show warning message with yellow background
- Allow user to proceed or go back
- Don't prevent form submission
- Log for admin review

**User Actions:**
- Acknowledge warning and proceed
- Go back and fix if needed

---

### 6.2 Error Recovery Mechanisms

**Auto-Save Protection:**
- If system error occurs, ensure draft is saved
- Notify user: "Your progress has been saved. Please try again."

**Session Recovery:**
- If user's session expires, re-authenticate without losing data
- Restore form state after re-login

**Network Resilience:**
- Queue actions if offline
- Sync when connection restored
- Notify user of offline status

**Timeout Handling:**
- Form has no hard timeout (session persists)
- Draft saves prevent data loss
- Warn user after 30 minutes of inactivity: "Still there? Your session is about to expire."

---

## 7. Data Quality Assurance

### 7.1 Data Quality Goals

**Business Goal:** Maintain >95% verified organization data through admin vetting

**Quality Metrics:**
1. **Completeness:** % of required fields filled
2. **Accuracy:** % of data that passes verification
3. **Consistency:** % of data that matches validation rules
4. **Uniqueness:** % of organizations without duplicates

**Target Metrics:**
- Completeness: 100% (enforced by required fields)
- Accuracy: >95% (through validation and admin review)
- Consistency: 100% (enforced by validation)
- Uniqueness: >98% (through duplicate detection)

---

### 7.2 Data Quality Enforcement

**At Data Entry (Client-Side):**
- Required field enforcement
- Format validation (email, phone, PIN)
- Range validation (year, file size)
- Type validation (numbers, URLs)
- Length limits

**At Submission (Server-Side):**
- Re-validation of all rules
- Cross-field validation (PIN vs City)
- Duplicate detection
- Business logic validation

**At Admin Review:**
- Manual verification of documents
- Authenticity checks (registration number)
- Completeness review
- Duplicate confirmation/merge

---

### 7.3 Data Normalization

**Purpose:** Ensure consistent data format across all submissions

**Normalization Rules:**

| Data Type | Normalization Rule |
|-----------|-------------------|
| Text (names, addresses) | Trim whitespace, capitalize first letter of each word |
| Email | Convert to lowercase |
| Phone | Store as +91-XXXXX-XXXXX format |
| PIN Code | Store as 6-digit string (leading zeros preserved) |
| URL | Ensure https:// prefix, remove trailing slash |
| Social media handles | Remove @ symbol if present, store handle only |
| Year | Store as 4-digit integer |
| Organization name | Normalize spacing (single space between words) |

**Implementation:**
- Apply normalization on server before saving to database
- Display normalized version in review step
- Maintain original input in logs for debugging

---

### 7.4 Data Migration Quality Assurance

**Purpose:** Ensure 121 legacy organizations are migrated with high quality

**Migration Process:**

1. **Pre-Migration Audit** (audit-mysql-data.ts)
   - Check for NULL values in required fields
   - Identify duplicates
   - Validate data formats
   - Generate audit report

2. **Data Cleaning**
   - Fix NULL values (use defaults or mark for manual review)
   - Merge duplicates
   - Correct format issues (phone, PIN, email)
   - Standardize text (trim, capitalize)

3. **Migration Execution**
   - Run migration scripts in sequence:
     1. migrate-languages.ts (30 languages)
     2. migrate-services.ts (14 categories + 76 resources)
     3. migrate-organizations.ts (121 organizations)
   - Dry-run first to test
   - Production run with transaction rollback on error

4. **Post-Migration Validation**
   - Count: Verify all 121 organizations migrated
   - Completeness: Check for missing required fields
   - Referential integrity: Ensure all foreign keys valid
   - Sample review: Manually review 10% (12 organizations)

5. **Migration Report**
   - Total migrated: 121
   - Errors: List any failures
   - Warnings: List data quality issues
   - Manual review needed: List organizations requiring review

**Success Criteria:**
- 100% of organizations migrated (121/121)
- 0 critical errors (blocking issues)
- <5% warnings (minor data quality issues)
- Sample review accuracy >95%

---

## 8. Success Metrics

### 8.1 Data Entry Performance Metrics

**User Experience Metrics:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Form completion rate | >70% | (Submitted ÷ Started) × 100 |
| Median completion time | <20 minutes | Time from start to submit |
| Draft save rate | >30% | (Drafts saved ÷ Total sessions) × 100 |
| Draft resume rate | >60% | (Resumed ÷ Drafts saved) × 100 |
| Step 1 abandonment | <15% | % who leave after Step 1 |
| Validation error rate per field | <10% | (Validation errors ÷ Total submissions) |
| File upload success rate | >98% | (Successful uploads ÷ Total attempts) |

**Data Quality Metrics:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Data completeness | 100% | % of required fields filled (enforced) |
| Data accuracy | >95% | % passing admin verification |
| Duplicate rate | <2% | (Duplicates ÷ Total submissions) × 100 |
| Rejection rate | <5% | (Rejected ÷ Total submissions) × 100 |
| Clarification request rate | <10% | (Clarification requests ÷ Submissions) × 100 |

**System Performance Metrics:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Form load time | <2 seconds | Time to interactive |
| Auto-save latency | <500ms | Time to save draft |
| Validation response time | <100ms | Time to show validation error |
| File upload speed | >1 MB/s | Upload throughput |
| Server-side validation time | <1 second | Time to validate full form |

---

### 8.2 Admin Review Metrics

**Efficiency Metrics:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Median review time | <48 hours | Time from submission to decision |
| Submissions reviewed per day | 10-15 | Total reviewed ÷ Working days |
| Approval rate | >85% | (Approved ÷ Total reviewed) × 100 |
| Rejection rate | <5% | (Rejected ÷ Total reviewed) × 100 |
| Clarification request rate | <10% | (Clarification ÷ Total reviewed) × 100 |

---

### 8.3 Measurement & Monitoring

**Data Collection:**
- Google Analytics / Plausible for user behavior
- Custom event tracking for form interactions
- Server logs for errors and performance
- Database queries for data quality metrics

**Reporting:**
- Weekly dashboard: Key metrics at a glance
- Monthly report: Trends and analysis
- Quarterly review: Strategic adjustments

**Alerts:**
- Form completion rate drops below 60%
- Validation error rate exceeds 15% for any field
- File upload success rate drops below 95%
- Duplicate detection rate exceeds 5%
- System errors exceed 0.5% of requests

---

## 9. User Stories

### 9.1 Data Entry User Stories

**US-1: Simple Registration Flow**

**As an** NGO administrator with limited time,
**I want to** complete the registration quickly without confusion,
**So that** I can register my organization in under 20 minutes.

**Acceptance Criteria:**
- Form loads in <2 seconds
- Progress indicator shows which step I'm on (e.g., "Step 2 of 7")
- I can navigate back/forward between steps
- Each step has clear instructions and help text
- Required fields are clearly marked with *
- I can complete registration in <20 minutes (median)

**Priority:** P0 (Must Have)

---

**US-2: Save and Resume**

**As an** organization coordinator who gets interrupted frequently,
**I want to** save my progress and resume later,
**So that** I don't lose my work if I have to stop mid-registration.

**Acceptance Criteria:**
- Form auto-saves every 2 minutes
- I see a "Saved" indicator with timestamp
- If I close the browser and return, my draft is automatically loaded
- I can receive a resume link via email
- My draft is saved for 30 days
- I get a reminder email 25 days after last update

**Priority:** P1 (Should Have)

---

**US-3: Clear Validation Feedback**

**As a** user filling out a complex form,
**I want to** know immediately when I make a mistake,
**So that** I can fix errors right away instead of finding out at the end.

**Acceptance Criteria:**
- Validation errors appear as I fill the form (on blur)
- Error messages are clear and actionable (not technical jargon)
- Invalid fields are highlighted with red border
- I can't proceed to next step if current step has errors
- Error messages disappear automatically when I fix the issue
- Email and phone fields auto-format as I type

**Priority:** P0 (Must Have)

---

**US-4: Multilingual Data Entry**

**As a** non-English speaker,
**I want to** fill the form in my regional language,
**So that** I can understand the questions and provide accurate information.

**Acceptance Criteria:**
- I can select my preferred language from a dropdown
- All form labels, buttons, and help text are in my language
- I can type organization details in my regional language (Unicode support)
- Validation errors are shown in my selected language
- Language change takes effect immediately without page reload

**Priority:** P0 (Must Have)

---

**US-5: Easy File Uploads**

**As an** organization submitting documents,
**I want to** upload files easily and see confirmation they uploaded,
**So that** I'm confident my documents were received.

**Acceptance Criteria:**
- I can drag-and-drop files or click to browse
- I see a progress bar during upload
- I see a preview/thumbnail after successful upload
- I can remove and re-upload if I selected the wrong file
- I get clear error messages if upload fails (e.g., "File too large")
- I can upload multiple files (logo + certificate + additional docs)

**Priority:** P0 (Must Have)

---

**US-6: Managing Multiple Branches**

**As an** organization with 5 branch locations,
**I want to** add all my branches with separate addresses and timings,
**So that** users can find the branch nearest to them.

**Acceptance Criteria:**
- I can add unlimited branches (no arbitrary limit)
- I can copy data from one branch to another (e.g., "Same hours as Branch 1")
- Each branch has its own address, PIN code, and operating hours
- I can delete branches if I added one by mistake
- I can assign different services to different branches (future feature)

**Priority:** P1 (Should Have)

---

**US-7: Review Before Submitting**

**As a** careful user who wants to avoid mistakes,
**I want to** review all my entered data before final submission,
**So that** I can catch any errors and make corrections.

**Acceptance Criteria:**
- Step 7 shows a summary of all my entered information
- Information is organized in clear sections (Organization, Contact, Services, Branches)
- I can edit any section by clicking an "Edit" button (returns to that step)
- I must check "Terms & Conditions" to enable Submit button
- I get a confirmation modal when I click Submit: "Are you sure?"
- After submission, I see a success message with submission ID

**Priority:** P0 (Must Have)

---

### 9.2 Admin Review User Stories

**US-8: Efficient Submission Review**

**As an** admin reviewing 10-15 submissions daily,
**I want to** quickly review and approve/reject submissions,
**So that** I can maintain a <48 hour review time.

**Acceptance Criteria:**
- I see a list of pending submissions with key info (name, date, city)
- I can click a submission to view full details in read-only mode
- I can download uploaded documents to verify authenticity
- I can approve, reject, or request clarification with one click
- Approval/rejection triggers automatic email to organization
- I can add internal notes for my team (not visible to organization)

**Priority:** P0 (Must Have)

---

**US-9: Duplicate Detection**

**As an** admin concerned about data quality,
**I want to** be alerted about potential duplicate organizations,
**So that** I can maintain a clean directory without duplicates.

**Acceptance Criteria:**
- System automatically flags potential duplicates (similar name + same city)
- I see a warning: "Similar organization exists: [Name]"
- I can view both organizations side-by-side for comparison
- I can merge duplicates into one organization
- I can mark as "Not a duplicate" if it's a false positive
- Duplicate checks run on organization name, email, and phone number

**Priority:** P1 (Should Have)

---

**US-10: Data Quality Monitoring**

**As an** admin responsible for data quality,
**I want to** see data quality metrics across all submissions,
**So that** I can identify common issues and improve the form.

**Acceptance Criteria:**
- I can see completion rate (% of started forms submitted)
- I can see rejection rate and common rejection reasons
- I can see which fields have the most validation errors
- I can export data quality reports as CSV
- I can filter metrics by date range (last 7 days, last 30 days, all time)

**Priority:** P2 (Nice to Have)

---

## 10. Appendix

### 10.1 Field-Level Validation Reference

**Quick Reference Table:**

| Field | Min | Max | Format | Required | Unique |
|-------|-----|-----|--------|----------|--------|
| Organization Name | 3 chars | 100 chars | Text | Yes | No |
| Registration Number | - | 50 chars | Alphanumeric + hyphen | Yes | No |
| Year of Establishment | 1800 | Current year | 4-digit number | Yes | No |
| Primary Contact Name | 2 chars | 100 chars | Letters only | Yes | No |
| Primary Contact Phone | 10 digits | 10 digits | Indian mobile format | Yes | No (warn if duplicate) |
| Primary Contact Email | - | 100 chars | Email format | Yes | No (warn if duplicate) |
| Address Line 1 | 10 chars | 200 chars | Text + numbers | Yes | No |
| PIN Code | 6 digits | 6 digits | Numeric | Yes | No |
| Registration Certificate | - | 5MB | PDF/JPEG/PNG | Yes | - |
| Organization Logo | - | 2MB | JPEG/PNG/SVG | No | - |

---

### 10.2 Data Flow Diagram

```
User Input → Client Validation → Auto-Save Draft → Server Validation → Database
     ↓              ↓                    ↓                  ↓              ↓
Show Error    Show Inline Error    Save to Session    Return Errors    Store Data
     ↓              ↓                    ↓                  ↓              ↓
User Fixes → Re-validate → Draft Saved → Fix & Retry → Admin Review → Approved
```

---

### 10.3 Database Tables (Data Entry Perspective)

**Tables Used for Data Entry:**

1. **Organization** - Main organization data (Step 1)
2. **ContactInformation** - Contact details (Step 2)
3. **ServiceCategory** - Reference data (Step 3)
4. **ServiceResource** - Reference data (Step 3)
5. **BranchCategory** - Junction table (Step 3 + 4)
6. **BranchResource** - Junction table (Step 3 + 4)
7. **OrganizationBranch** - Branch locations (Step 4)
8. **BranchTimings** - Operating hours (Step 4)
9. **Language** - Reference data (Step 5)
10. **OrganizationLanguage** - Junction table (Step 5)
11. **Document** - Uploaded files (Step 6)
12. **User** - Authentication (pre-requisite)

**Draft Storage:**
- **RegistrationDraft** (new table)
  - id (UUID, primary key)
  - userId (foreign key, nullable)
  - email (text, for guest users)
  - draftData (JSON, stores entire form state)
  - lastUpdated (timestamp)
  - expiresAt (timestamp, 30 days from creation)

---

### 10.4 Error Code Reference

**Client-Side Error Codes:**

| Code | Message | Field Type | Resolution |
|------|---------|-----------|------------|
| E001 | Field is required | All required fields | Fill the field |
| E002 | Invalid email format | Email | Enter valid email |
| E003 | Invalid phone number | Phone | Enter 10-digit phone |
| E004 | Invalid PIN code | PIN Code | Enter 6-digit PIN |
| E005 | File size too large | File upload | Compress or choose smaller file |
| E006 | Invalid file type | File upload | Upload PDF/JPEG/PNG only |
| E007 | Duplicate organization | Organization Name | Contact support or use different name |
| E008 | Invalid URL format | URL fields | Enter valid URL |
| E009 | Invalid year range | Year | Enter year between 1800 and current |
| E010 | Text too short | Text fields | Enter minimum required characters |
| E011 | Text too long | Text fields | Reduce to max allowed characters |

**Server-Side Error Codes:**

| Code | Message | Cause | Resolution |
|------|---------|-------|------------|
| S001 | Database error | DB connection issue | Retry or contact support |
| S002 | Network timeout | Slow connection | Retry with better connection |
| S003 | Server error | Internal server error | Auto-retry or contact support |
| S004 | Authentication failed | Session expired | Re-login |
| S005 | Rate limit exceeded | Too many requests | Wait and try again |
| S006 | File upload failed | Server storage issue | Retry upload |
| S007 | Validation failed | Server-side validation | Fix errors and resubmit |

---

### 10.5 Testing Checklist

**Data Entry Testing:**

- [ ] All required fields enforce validation
- [ ] All optional fields can be left blank
- [ ] Email validation accepts valid formats, rejects invalid
- [ ] Phone validation accepts 10-digit numbers, rejects others
- [ ] PIN code cross-validates with city/state
- [ ] File upload accepts PDF/JPEG/PNG, rejects others
- [ ] File upload enforces size limits (5MB docs, 2MB logo)
- [ ] Draft auto-saves every 2 minutes
- [ ] Draft can be resumed after browser close
- [ ] Multi-step navigation works (back/forward)
- [ ] Step progression blocked if validation errors exist
- [ ] Review step shows accurate summary of all data
- [ ] Submit button disabled until terms checked
- [ ] Confirmation modal appears on submit
- [ ] Success message shows after submission
- [ ] Confirmation email sent to organization

**Validation Testing:**

- [ ] Client-side validation shows errors on blur
- [ ] Server-side validation re-validates all rules
- [ ] Duplicate detection flags exact matches
- [ ] Fuzzy match warns for similar names
- [ ] Error messages are clear and actionable
- [ ] Errors disappear when fixed
- [ ] Multi-language validation works for all 30 languages

**Data Quality Testing:**

- [ ] All data normalized before saving
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities in text fields
- [ ] File uploads scanned for malware
- [ ] Rate limiting prevents spam submissions
- [ ] Duplicate prevention works correctly

---

**End of Document**
