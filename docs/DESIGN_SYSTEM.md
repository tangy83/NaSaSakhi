# NASA Sakhi - Design System
## UI/UX Guidelines for Frontend Development

**Version:** 1.0
**Last Updated:** February 3, 2026
**Owner:** Tanuj (UI/UX Lead)

---

## 📋 Overview

This design system defines the visual language and component patterns for the NASA Sakhi organization registration portal. All frontend components must follow these guidelines to ensure consistency and accessibility.

**Target Users:**
- NGO administrators with limited tech literacy
- Mobile users (50%+ traffic expected)
- Users with varying levels of digital literacy

**Design Principles:**
- **Clarity:** Clear labels, simple language, no jargon
- **Simplicity:** One action per screen, minimal cognitive load
- **Accessibility:** WCAG 2.1 Level AA compliance
- **Responsiveness:** Mobile-first design approach

---

## 🎨 Color Palette

### Primary Colors

```css
/* Primary Blue - Main actions, links, focus states */
--primary-500: #2563EB;      /* Base primary */
--primary-600: #1D4ED8;      /* Hover state */
--primary-700: #1E40AF;      /* Active/pressed state */
--primary-50:  #EFF6FF;      /* Light backgrounds */

/* Use for: Primary buttons, links, active states, progress indicators */
```

### Semantic Colors

```css
/* Success Green - Completed, approved, success messages */
--success-500: #10B981;
--success-600: #059669;
--success-50:  #ECFDF5;

/* Error Red - Errors, validation, warnings */
--error-500: #EF4444;
--error-600: #DC2626;
--error-50:  #FEF2F2;

/* Warning Amber - Warnings, caution */
--warning-500: #F59E0B;
--warning-600: #D97706;
--warning-50:  #FFFBEB;

/* Info Blue - Informational messages */
--info-500: #3B82F6;
--info-600: #2563EB;
--info-50:  #EFF6FF;
```

### Neutral Colors

```css
/* Gray scale - Text, borders, backgrounds */
--gray-900: #111827;  /* Primary text */
--gray-800: #1F2937;  /* Secondary text */
--gray-700: #374151;  /* Tertiary text */
--gray-600: #4B5563;  /* Placeholder text */
--gray-500: #6B7280;  /* Disabled text */
--gray-400: #9CA3AF;  /* Borders */
--gray-300: #D1D5DB;  /* Input borders */
--gray-200: #E5E7EB;  /* Dividers */
--gray-100: #F3F4F6;  /* Light backgrounds */
--gray-50:  #F9FAFB;  /* Subtle backgrounds */

/* Pure colors */
--white: #FFFFFF;
--black: #000000;
```

### Usage Guidelines

| Element | Color | Notes |
|---------|-------|-------|
| Primary buttons | `primary-500` | Hover: `primary-600` |
| Secondary buttons | `white` with `gray-300` border | Hover: `gray-50` |
| Body text | `gray-900` | High contrast for readability |
| Secondary text | `gray-600` | Help text, captions |
| Input borders (default) | `gray-300` | |
| Input borders (focus) | `primary-500` | With ring |
| Input borders (error) | `error-500` | |
| Success messages | `success-500` | Background: `success-50` |
| Error messages | `error-500` | Background: `error-50` |
| Backgrounds | `white` or `gray-50` | Never pure gray |

---

## 🔤 Typography

### Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

**Note:** Inter is already configured in Tailwind CSS. No additional imports needed.

### Font Sizes & Weights

| Element | Size | Weight | Line Height | Tailwind Class |
|---------|------|--------|-------------|----------------|
| **Page Heading (H1)** | 24px | 600 (Semibold) | 32px | `text-2xl font-semibold` |
| **Section Heading (H2)** | 20px | 600 (Semibold) | 28px | `text-xl font-semibold` |
| **Subsection Heading (H3)** | 18px | 600 (Semibold) | 26px | `text-lg font-semibold` |
| **Body Text** | 16px | 400 (Regular) | 24px | `text-base` |
| **Small Text** | 14px | 400 (Regular) | 20px | `text-sm` |
| **Labels** | 14px | 500 (Medium) | 20px | `text-sm font-medium` |
| **Help Text** | 14px | 400 (Regular) | 20px | `text-sm text-gray-500` |
| **Button Text** | 14px | 500 (Medium) | 20px | `text-sm font-medium` |
| **Error Messages** | 14px | 400 (Regular) | 20px | `text-sm text-error-500` |

### Typography Examples

```jsx
// Page heading
<h1 className="text-2xl font-semibold text-gray-900">
  Organization Registration
</h1>

// Section heading
<h2 className="text-xl font-semibold text-gray-900">
  Contact Information
</h2>

// Body text
<p className="text-base text-gray-900">
  Please provide your organization details below.
</p>

// Help text
<p className="text-sm text-gray-500">
  Enter the full legal name of your organization.
</p>

// Label
<label className="text-sm font-medium text-gray-700">
  Organization Name *
</label>
```

---

## 📏 Spacing System

### Scale (8px Grid System)

```css
/* Use multiples of 8px for consistency */
--spacing-1:  8px;   /* 0.5rem */
--spacing-2:  16px;  /* 1rem */
--spacing-3:  24px;  /* 1.5rem */
--spacing-4:  32px;  /* 2rem */
--spacing-5:  40px;  /* 2.5rem */
--spacing-6:  48px;  /* 3rem */
```

### Usage Guidelines

| Context | Spacing | Tailwind Class |
|---------|---------|----------------|
| Between form fields | 16px | `space-y-4` or `mb-4` |
| Between form sections | 24px | `space-y-6` or `mb-6` |
| Page padding | 16px (mobile), 24px (desktop) | `px-4 md:px-6` |
| Section padding | 24px | `p-6` |
| Card padding | 16px | `p-4` |
| Button padding | 8px 16px | `px-4 py-2` |
| Input padding | 12px 16px | `px-4 py-3` |

### Layout Example

```jsx
<div className="max-w-4xl mx-auto px-4 py-6">
  {/* Page content */}

  <div className="space-y-6">
    {/* Form sections with 24px gap */}

    <div className="space-y-4">
      {/* Form fields with 16px gap */}

      <div className="space-y-1">
        {/* Label, input, error with 4px gap */}
      </div>
    </div>
  </div>
</div>
```

---

## 🧩 Component Patterns

### Buttons

#### Primary Button

```jsx
<button className="px-6 py-2 bg-primary-500 text-white rounded-md
                   hover:bg-primary-600 active:bg-primary-700
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-150">
  Submit
</button>
```

**Specs:**
- Background: `primary-500`
- Text: White, 14px, medium weight
- Padding: 8px 24px (`px-6 py-2`)
- Border radius: 6px (`rounded-md`)
- Min height: 40px
- Hover: `primary-600`
- Focus: 2px ring, `primary-500`
- Disabled: 50% opacity

#### Secondary Button

```jsx
<button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md
                   hover:bg-gray-50 active:bg-gray-100
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-150">
  Back
</button>
```

#### Button Sizes

| Size | Padding | Height | Text Size | Use Case |
|------|---------|--------|-----------|----------|
| Small | `px-4 py-1.5` | 32px | 14px | Secondary actions |
| Medium | `px-6 py-2` | 40px | 14px | Default buttons |
| Large | `px-8 py-3` | 48px | 16px | Primary CTAs |

---

### Form Inputs

#### Text Input

```jsx
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">
    Organization Name
    <span className="text-error-500 ml-1">*</span>
  </label>

  <input
    type="text"
    className="w-full px-4 py-3 border border-gray-300 rounded-md
               focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
               disabled:bg-gray-100 disabled:cursor-not-allowed
               placeholder:text-gray-400"
    placeholder="Enter organization name"
  />

  <p className="text-sm text-gray-500">
    Enter the full legal name of your organization.
  </p>
</div>
```

**Specs:**
- Border: 1px solid `gray-300`
- Border radius: 6px (`rounded-md`)
- Padding: 12px 16px (`px-4 py-3`)
- Min height: 48px (touch-friendly)
- Focus: 2px ring, `primary-500` border
- Placeholder: `gray-400`

#### Input States

**Default:**
```css
border: 1px solid gray-300
background: white
```

**Focus:**
```css
border: 1px solid primary-500
ring: 2px primary-500
```

**Error:**
```jsx
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">
    Email Address *
  </label>

  <input
    type="email"
    className="w-full px-4 py-3 border border-error-500 rounded-md
               focus:outline-none focus:ring-2 focus:ring-error-500 focus:border-error-500"
  />

  <p className="text-sm text-error-500 flex items-center gap-1">
    <span>⚠️</span>
    Please enter a valid email address
  </p>
</div>
```

**Disabled:**
```jsx
<input
  type="text"
  disabled
  className="w-full px-4 py-3 border border-gray-300 rounded-md
             bg-gray-100 text-gray-500 cursor-not-allowed"
/>
```

---

### Dropdown/Select

```jsx
<select className="w-full px-4 py-3 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                   disabled:bg-gray-100 disabled:cursor-not-allowed">
  <option value="">Select registration type</option>
  <option value="NGO">NGO</option>
  <option value="TRUST">Trust</option>
  <option value="GOVERNMENT">Government</option>
</select>
```

---

### Checkbox

```jsx
<div className="flex items-start gap-3">
  <input
    type="checkbox"
    className="mt-1 w-5 h-5 rounded border-gray-300
               text-primary-600 focus:ring-2 focus:ring-primary-500"
  />

  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 cursor-pointer">
      Shelter/Safe Housing
    </label>
    <p className="text-sm text-gray-500 mt-0.5">
      Temporary or permanent housing for women in distress
    </p>
  </div>
</div>
```

**Specs:**
- Size: 20px × 20px (`w-5 h-5`)
- Checked color: `primary-600`
- Touch target: 44px × 44px (includes padding)

---

### Progress Indicator (Stepper)

```jsx
<div className="flex items-center justify-between">
  {/* Step 1 - Completed */}
  <div className="flex flex-col items-center">
    <div className="w-10 h-10 rounded-full bg-success-500 text-white
                    flex items-center justify-center font-semibold">
      ✓
    </div>
    <p className="text-xs mt-2 text-gray-600">Organization</p>
  </div>

  {/* Connector */}
  <div className="flex-1 h-1 mx-2 bg-success-500"></div>

  {/* Step 2 - Active */}
  <div className="flex flex-col items-center">
    <div className="w-10 h-10 rounded-full bg-primary-600 text-white
                    flex items-center justify-center font-semibold">
      2
    </div>
    <p className="text-xs mt-2 text-gray-900 font-medium">Contact</p>
  </div>

  {/* Connector */}
  <div className="flex-1 h-1 mx-2 bg-gray-200"></div>

  {/* Step 3 - Inactive */}
  <div className="flex flex-col items-center">
    <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500
                    flex items-center justify-center font-semibold">
      3
    </div>
    <p className="text-xs mt-2 text-gray-500">Services</p>
  </div>
</div>
```

**State Colors:**
- Completed: `success-500` with checkmark
- Active: `primary-600` with step number
- Inactive: `gray-200` with step number

---

### Alert/Notification

#### Success

```jsx
<div className="p-4 bg-success-50 border border-success-500 rounded-md">
  <div className="flex items-start gap-3">
    <span className="text-success-500 text-xl">✓</span>
    <div className="flex-1">
      <h3 className="text-sm font-medium text-success-800">
        Registration submitted successfully
      </h3>
      <p className="text-sm text-success-700 mt-1">
        Your submission will be reviewed within 48 hours.
      </p>
    </div>
  </div>
</div>
```

#### Error

```jsx
<div className="p-4 bg-error-50 border border-error-500 rounded-md">
  <div className="flex items-start gap-3">
    <span className="text-error-500 text-xl">⚠️</span>
    <div className="flex-1">
      <h3 className="text-sm font-medium text-error-800">
        Upload failed
      </h3>
      <p className="text-sm text-error-700 mt-1">
        File size exceeds 5MB limit. Please compress or select a smaller file.
      </p>
    </div>
  </div>
</div>
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile-first approach */
sm:  640px  /* Small tablets */
md:  768px  /* Tablets */
lg:  1024px /* Desktop */
xl:  1280px /* Large desktop */
```

### Layout Guidelines

```jsx
// Container with responsive padding
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* 1 column on mobile, 2 columns on tablet+ */}
</div>

// Responsive text
<h1 className="text-xl md:text-2xl lg:text-3xl">
  Heading
</h1>

// Hide on mobile
<div className="hidden md:block">
  {/* Visible only on tablet+ */}
</div>
```

### Touch Targets

**Minimum size:** 44px × 44px (Apple/Android guidelines)

```jsx
// Buttons automatically meet this
<button className="px-6 py-2 ...">  /* Height: 40px + padding = 48px ✓ */
  Button
</button>

// Checkboxes need extra hit area
<div className="p-3">  /* Adds 24px padding = 44px total ✓ */
  <input type="checkbox" className="w-5 h-5" />
</div>
```

---

## ♿ Accessibility

### WCAG 2.1 Level AA Compliance

#### Color Contrast

All text must meet minimum contrast ratios:
- **Normal text (16px):** 4.5:1
- **Large text (18px+):** 3:1
- **UI components:** 3:1

Our palette meets these requirements:
- `gray-900` on `white`: 18.5:1 ✓
- `gray-700` on `white`: 10.7:1 ✓
- `primary-500` on `white`: 4.9:1 ✓

#### Focus Indicators

All interactive elements must have visible focus:

```css
focus:outline-none
focus:ring-2
focus:ring-primary-500
focus:ring-offset-2
```

#### Keyboard Navigation

- All form fields: Tab to navigate
- Buttons: Enter/Space to activate
- Checkboxes: Space to toggle
- Dropdowns: Arrow keys to navigate

#### Screen Readers

```jsx
// Use labels for all inputs
<label htmlFor="orgName">Organization Name</label>
<input id="orgName" ... />

// ARIA labels for icons
<button aria-label="Close modal">
  <XIcon />
</button>

// Error announcements
<p role="alert" className="text-sm text-error-500">
  This field is required
</p>
```

---

## 🎯 Component Checklist

When building a new component, ensure:

- [ ] Colors use design system palette
- [ ] Typography follows size/weight guidelines
- [ ] Spacing uses 8px grid system
- [ ] Touch targets ≥ 44px × 44px
- [ ] Color contrast ≥ 4.5:1
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Responsive on mobile (375px+)
- [ ] Tested on Chrome, Safari, Firefox

---

## 📚 Resources

- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Mobile Touch Guidelines:** https://www.lukew.com/ff/entry.asp?1085

---

## 🆘 Questions?

Contact Tanuj (UI/UX Lead) for:
- Design clarifications
- Component approval
- Accessibility guidance
- Color/spacing adjustments

---

**Last Updated:** February 3, 2026
**Version:** 1.0
