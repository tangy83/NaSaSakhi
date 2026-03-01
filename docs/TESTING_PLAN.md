# Saathi — Comprehensive Testing Plan (TDD)

> **Approach:** Test-Driven Development. Every feature's test suite is written *before* its implementation. Red → Green → Refactor.

---

## Table of Contents

1. [Philosophy & Guiding Principles](#1-philosophy--guiding-principles)
2. [Testing Pyramid](#2-testing-pyramid)
3. [Test Infrastructure Setup](#3-test-infrastructure-setup)
4. [Test Data Strategy](#4-test-data-strategy)
5. [Unit Tests — Validation Schemas](#5-unit-tests--validation-schemas)
6. [Unit Tests — Pure Utility Functions](#6-unit-tests--pure-utility-functions)
7. [Integration Tests — API Routes](#7-integration-tests--api-routes)
8. [Component Tests — React Components](#8-component-tests--react-components)
9. [E2E Tests — User Journeys](#9-e2e-tests--user-journeys)
10. [Security Tests](#10-security-tests)
11. [Accessibility Tests](#11-accessibility-tests)
12. [Performance Tests](#12-performance-tests)
13. [Test Coverage Targets](#13-test-coverage-targets)
14. [CI/CD Integration](#14-cicd-integration)
15. [TDD Workflow for New Features](#15-tdd-workflow-for-new-features)

---

## 1. Philosophy & Guiding Principles

### TDD Cycle (Red → Green → Refactor)

```
1. RED    — Write a failing test that describes the desired behaviour
2. GREEN  — Write the minimum code to make the test pass
3. REFACTOR — Improve code while keeping all tests green
```

### Core Rules

- **No production code without a failing test first.** If a feature needs to be built, its test exists before the first line of implementation.
- **Tests are first-class citizens.** Test files live alongside source files, are reviewed in PRs, and are never skipped without a documented reason.
- **Test what the user/caller cares about, not internal implementation.** Prefer testing public interfaces (API contracts, UI interactions, validation rules) over private function internals.
- **Arrange → Act → Assert.** Every test follows this structure. Setup is explicit, not implicit.
- **One logical assertion per test.** A test should fail for exactly one reason.
- **Deterministic and isolated.** Tests do not depend on each other, on external services, or on execution order.

### What We Test vs. What We Trust

| Test | We test | We trust (stub/mock) |
|------|---------|----------------------|
| Validation schema | All Zod rules, edge cases | — |
| API route | Auth check, input parsing, DB calls, response shape | Prisma client, NextAuth |
| Component | Rendering, user interaction, form submission | API responses, router |
| E2E | Full critical user paths end-to-end | — (real server, real DB) |

---

## 2. Testing Pyramid

```
         ▲
        /E2E\         ~15 tests  — Playwright  (slow, high confidence)
       /──────\
      / Comp.  \      ~60 tests  — RTL + Vitest (medium speed)
     /──────────\
    / Integration\    ~80 tests  — Vitest + Supertest (fast, isolated DB)
   /──────────────\
  /   Unit Tests   \  ~150 tests — Vitest (instant, pure functions)
 /──────────────────\
```

**Total target: ~305 automated tests**

---

## 3. Test Infrastructure Setup

### 3.1 Add Vitest (Unit + Integration + Component)

**TDD Step 1: Write the config before anything else.**

```bash
npm install -D vitest @vitest/coverage-v8 @vitest/ui \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  @vitejs/plugin-react jsdom supertest @types/supertest \
  msw @mswjs/data
```

**`vitest.config.ts`** (create at project root):
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules/**',
        'e2e/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/prisma/**',
        'scripts/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**`tests/setup.ts`** (global test setup):
```typescript
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Start MSW mock server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock NextAuth
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));
```

### 3.2 Add Test Scripts to `package.json`

```json
{
  "scripts": {
    "test:unit":        "vitest run --reporter=verbose",
    "test:unit:watch":  "vitest",
    "test:unit:ui":     "vitest --ui",
    "test:coverage":    "vitest run --coverage",
    "test:e2e":         "playwright test",
    "test:e2e:ui":      "playwright test --ui",
    "test:e2e:headed":  "playwright test --headed",
    "test:e2e:report":  "playwright show-report",
    "test:all":         "npm run test:unit && npm run test:e2e"
  }
}
```

### 3.3 MSW (Mock Service Worker) for API Mocking

**`tests/mocks/handlers.ts`**:
```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Reference data — used by form components
  http.get('/api/reference/categories', () =>
    HttpResponse.json({ success: true, data: mockCategories })
  ),
  http.get('/api/reference/languages', () =>
    HttpResponse.json({ success: true, data: mockLanguages })
  ),
  http.get('/api/reference/states', () =>
    HttpResponse.json({ success: true, data: mockStates })
  ),
  http.get('/api/reference/faiths', () =>
    HttpResponse.json({ success: true, data: mockFaiths })
  ),
  http.get('/api/reference/social-categories', () =>
    HttpResponse.json({ success: true, data: mockSocialCategories })
  ),
];
```

### 3.4 Test Database (Integration Tests)

Integration tests run against a dedicated PostgreSQL test database:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/saathi_test
```

- Database is reset before each integration test suite using `prisma migrate reset --force`.
- Seed data is applied via `tests/fixtures/seed.ts`.
- Each test suite is isolated by wrapping DB operations in transactions that are rolled back after the suite.

---

## 4. Test Data Strategy

### 4.1 Fixtures (`tests/fixtures/`)

```
tests/
  fixtures/
    organizations.ts    # Factory functions for Organization objects
    users.ts            # Factory functions for User/Volunteer objects
    branches.ts         # Factory functions for Branch data
    seed.ts             # Seeds the test DB with baseline reference data
```

### 4.2 Factory Pattern

```typescript
// tests/fixtures/organizations.ts
import { faker } from '@faker-js/faker';

export function buildOrganization(overrides: Partial<OrganizationFormData> = {}): OrganizationFormData {
  return {
    organizationName: faker.company.name(),
    registrationType: 'NGO',
    registrationNumber: faker.string.alphanumeric(10).toUpperCase(),
    yearEstablished: faker.number.int({ min: 1980, max: 2020 }),
    description: faker.lorem.sentence(),
    faithId: undefined,
    socialCategoryIds: [],
    ...overrides,
  };
}

export function buildContact(overrides = {}) {
  return {
    name: faker.person.fullName().replace(/[^a-zA-Z\s]/g, ''),
    isdCode: '+91',
    phone: '9' + faker.string.numeric(9),
    email: faker.internet.email(),
    ...overrides,
  };
}
```

### 4.3 Test User Accounts (E2E)

| Account | ID | Role | Purpose |
|---------|-----|------|---------|
| `VOL-TEST-001` | — | VOLUNTEER | Standard volunteer flows |
| `VOL-ADMIN-001` | — | ADMIN | Admin panel flows |
| `VOL-SUPER-001` | — | SUPER_ADMIN | Super admin flows |

All seeded via `POST /api/test/seed-volunteer` (test-only endpoint, disabled in production via `NODE_ENV` guard).

---

## 5. Unit Tests — Validation Schemas

**Location:** `tests/unit/validation/`
**Runner:** Vitest
**TDD protocol:** Write all tests in this section before implementing any schema change.

### 5.1 `organizationSchema.test.ts`

```typescript
// TDD: Write these tests BEFORE modifying organizationSchema.ts
describe('organizationSchema', () => {
  describe('organizationName', () => {
    test('PASS — valid name within bounds', () => {
      expectValid({ organizationName: 'Valid NGO Name' });
    });
    test('FAIL — name shorter than 3 characters', () => {
      expectError({ organizationName: 'AB' }, 'at least 3 characters');
    });
    test('FAIL — name longer than 100 characters', () => {
      expectError({ organizationName: 'A'.repeat(101) }, 'cannot exceed 100');
    });
    test('FAIL — empty string', () => {
      expectError({ organizationName: '' }, 'at least 3 characters');
    });
  });

  describe('registrationType', () => {
    test.each(['NGO', 'TRUST', 'GOVERNMENT', 'PRIVATE', 'OTHER'])(
      'PASS — valid type %s', (type) => {
        expectValid({ registrationType: type });
      }
    );
    test('FAIL — invalid type', () => {
      expectError({ registrationType: 'INVALID' }, 'Please select a registration type');
    });
  });

  describe('registrationNumber', () => {
    test('PASS — alphanumeric registration number', () => {
      expectValid({ registrationNumber: 'REG-2024-001' });
    });
    test('FAIL — empty registration number', () => {
      expectError({ registrationNumber: '' }, 'required');
    });
    test('FAIL — exceeds 50 characters', () => {
      expectError({ registrationNumber: 'X'.repeat(51) }, 'cannot exceed 50');
    });
  });

  describe('yearEstablished', () => {
    test('PASS — valid year 2010', () => expectValid({ yearEstablished: 2010 }));
    test('PASS — earliest allowed year 1800', () => expectValid({ yearEstablished: 1800 }));
    test('PASS — current year', () => expectValid({ yearEstablished: new Date().getFullYear() }));
    test('FAIL — year before 1800', () => expectError({ yearEstablished: 1799 }, '1800 or later'));
    test('FAIL — future year', () => {
      expectError({ yearEstablished: new Date().getFullYear() + 1 }, 'cannot be in the future');
    });
    test('FAIL — non-integer (float)', () => {
      expectError({ yearEstablished: 2010.5 }, 'Expected integer');
    });
  });

  describe('description', () => {
    test('PASS — optional, omitted', () => expectValid({ description: undefined }));
    test('PASS — valid description under 500 chars', () => {
      expectValid({ description: 'A'.repeat(499) });
    });
    test('FAIL — over 500 characters', () => {
      expectError({ description: 'A'.repeat(501) }, 'cannot exceed 500');
    });
  });
});
```

### 5.2 `contactSchema.test.ts`

```typescript
describe('contactSchema — primaryContact', () => {
  describe('name', () => {
    test('PASS — valid full name', () => expectValid({ name: 'Jane Smith' }));
    test('FAIL — name with numbers', () => expectError({ name: 'Jane123' }, 'letters and spaces'));
    test('FAIL — name under 2 characters', () => expectError({ name: 'J' }, 'at least 2'));
    test('FAIL — name over 100 characters', () => expectError({ name: 'J'.repeat(101) }, 'cannot exceed'));
  });

  describe('isdCode', () => {
    test('PASS — +91 (India)', () => expectValid({ isdCode: '+91' }));
    test('PASS — +1 (USA)', () => expectValid({ isdCode: '+1' }));
    test('FAIL — missing leading +', () => expectError({ isdCode: '91' }, 'must start with +'));
    test('FAIL — exceeds 5 characters', () => expectError({ isdCode: '+12345' }, 'cannot exceed 5'));
    test('FAIL — contains letters', () => expectError({ isdCode: '+XX' }, 'must start with +'));
  });

  describe('phone', () => {
    test('PASS — 10-digit Indian number', () => expectValid({ phone: '9876543210' }));
    test('FAIL — contains non-digits', () => expectError({ phone: '98765-432' }, 'only contain digits'));
    test('FAIL — under 6 digits', () => expectError({ phone: '12345' }, 'at least 6'));
    test('FAIL — over 15 digits', () => expectError({ phone: '1'.repeat(16) }, 'cannot exceed 15'));
  });

  describe('email', () => {
    test('PASS — valid email', () => expectValid({ email: 'ngo@example.org' }));
    test('FAIL — no @ symbol', () => expectError({ email: 'notanemail' }, 'valid email'));
    test('FAIL — no domain', () => expectError({ email: 'user@' }, 'valid email'));
    test('FAIL — empty', () => expectError({ email: '' }, 'required'));
  });

  describe('facebookUrl', () => {
    test('PASS — valid facebook.com URL', () =>
      expectValid({ facebookUrl: 'https://facebook.com/ngoprofile' }));
    test('FAIL — non-facebook domain', () =>
      expectError({ facebookUrl: 'https://twitter.com/test' }, 'facebook.com'));
    test('PASS — empty string (optional)', () => expectValid({ facebookUrl: '' }));
  });

  describe('instagramHandle', () => {
    test('PASS — valid handle', () => expectValid({ instagramHandle: 'my_ngo_2024' }));
    test('FAIL — handle with spaces', () => expectError({ instagramHandle: 'my ngo' }, 'letters, numbers'));
    test('FAIL — exceeds 30 characters', () =>
      expectError({ instagramHandle: 'a'.repeat(31) }, 'cannot exceed 30'));
  });
});
```

### 5.3 `branchesSchema.test.ts`

```typescript
describe('branchSchema', () => {
  describe('addressLine1', () => {
    test('PASS — valid address', () => expectValid({ addressLine1: '123 Main Street' }));
    test('FAIL — empty string', () => expectError({ addressLine1: '' }, 'required'));
    test('FAIL — exceeds 200 characters', () =>
      expectError({ addressLine1: 'A'.repeat(201) }, 'cannot exceed 200'));
  });

  describe('pinCode', () => {
    test('PASS — valid 6-digit PIN', () => expectValid({ pinCode: '560001' }));
    test('FAIL — 5 digits', () => expectError({ pinCode: '56000' }, 'exactly 6'));
    test('FAIL — 7 digits', () => expectError({ pinCode: '5600001' }, 'exactly 6'));
    test('FAIL — contains letters', () => expectError({ pinCode: '56000A' }, 'only digits'));
  });

  describe('latitude/longitude', () => {
    test('PASS — valid Indian coordinates', () =>
      expectValid({ latitude: 12.9716, longitude: 77.5946 }));
    test('FAIL — latitude out of range', () =>
      expectError({ latitude: 91 }, 'between -90 and 90'));
    test('FAIL — longitude out of range', () =>
      expectError({ longitude: 181 }, 'between -180 and 180'));
    test('PASS — omitted (optional)', () =>
      expectValid({ latitude: undefined, longitude: undefined }));
  });

  describe('branchTimingSchema (refinement)', () => {
    test('PASS — branch marked as closed, no timings required', () =>
      expectValid({ isClosed: true }));
    test('PASS — open with valid open < close time', () =>
      expectValid({ isClosed: false, openTime: '09:00', closeTime: '17:00' }));
    test('FAIL — open time equals close time', () =>
      expectError({ isClosed: false, openTime: '09:00', closeTime: '09:00' },
        'Opening time must be before closing time'));
    test('FAIL — open time after close time', () =>
      expectError({ isClosed: false, openTime: '17:00', closeTime: '09:00' },
        'Opening time must be before closing time'));
    test('FAIL — open=true but no timings provided', () =>
      expectError({ isClosed: false, openTime: undefined, closeTime: undefined },
        'Opening time must be before closing time'));
    test('FAIL — invalid time format (non 24h)', () =>
      expectError({ openTime: '9:00' }, 'HH:MM format'));
  });

  describe('branchesSchema (array wrapper)', () => {
    test('FAIL — empty branches array', () =>
      expectError({ branches: [] }, 'at least one branch'));
    test('PASS — array with one valid branch', () =>
      expectValid({ branches: [buildBranch()] }));
  });
});
```

---

## 6. Unit Tests — Pure Utility Functions

**Location:** `tests/unit/utils/`

### 6.1 `draftToken.test.ts`

Test the draft token generation and expiry logic.

```typescript
describe('draft token utilities', () => {
  test('generateDraftToken returns a non-empty string', () => {
    const token = generateDraftToken();
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
  });

  test('two calls return different tokens', () => {
    expect(generateDraftToken()).not.toBe(generateDraftToken());
  });

  test('isDraftExpired returns true when expiry is in the past', () => {
    const past = new Date(Date.now() - 1000);
    expect(isDraftExpired(past)).toBe(true);
  });

  test('isDraftExpired returns false when expiry is in the future', () => {
    const future = new Date(Date.now() + 86400000);
    expect(isDraftExpired(future)).toBe(false);
  });
});
```

### 6.2 `phoneValidation.test.ts`

```typescript
describe('Indian phone number utilities', () => {
  test.each(['6', '7', '8', '9'])(
    'PASS — Indian number starting with %s', (digit) => {
      expect(isValidIndianPhone(`${digit}123456789`)).toBe(true);
    }
  );

  test('FAIL — starts with 5 (invalid for Indian mobile)', () => {
    expect(isValidIndianPhone('5123456789')).toBe(false);
  });

  test('FAIL — 9 digit number', () => {
    expect(isValidIndianPhone('912345678')).toBe(false);
  });
});
```

### 6.3 `fileValidation.test.ts`

```typescript
describe('file upload validation', () => {
  test('PASS — PDF under 5MB', () => {
    const file = createMockFile('cert.pdf', 'application/pdf', 4 * 1024 * 1024);
    expect(validateDocument(file)).toEqual({ valid: true });
  });

  test('FAIL — file over 5MB', () => {
    const file = createMockFile('big.pdf', 'application/pdf', 6 * 1024 * 1024);
    expect(validateDocument(file)).toEqual({ valid: false, error: /5MB/ });
  });

  test('FAIL — unsupported MIME type (Word doc)', () => {
    const file = createMockFile('cert.docx', 'application/vnd.openxmlformats', 1024);
    expect(validateDocument(file)).toEqual({ valid: false, error: /PDF.*JPEG.*PNG/ });
  });

  test('PASS — logo PNG under 2MB', () => {
    const file = createMockFile('logo.png', 'image/png', 1 * 1024 * 1024);
    expect(validateLogo(file)).toEqual({ valid: true });
  });

  test('FAIL — logo over 2MB', () => {
    const file = createMockFile('logo.jpg', 'image/jpeg', 3 * 1024 * 1024);
    expect(validateLogo(file)).toEqual({ valid: false, error: /2MB/ });
  });

  test('PASS — SVG logo', () => {
    const file = createMockFile('logo.svg', 'image/svg+xml', 50 * 1024);
    expect(validateLogo(file)).toEqual({ valid: true });
  });
});
```

---

## 7. Integration Tests — API Routes

**Location:** `tests/integration/api/`
**Strategy:** Use `next-test-api-route-handler` or direct handler import. Mock Prisma with `vi.mock` and NextAuth with fixture sessions.

### 7.1 Setup Pattern

```typescript
// tests/integration/api/_helpers.ts
import { createMockPrisma } from '../helpers/prismaMock';
import { createAdminSession, createVolunteerSession } from '../helpers/sessions';

// Mock Prisma globally for all integration tests
vi.mock('@/lib/prisma', () => ({ default: createMockPrisma() }));
```

### 7.2 `reference/categories.test.ts`

```typescript
describe('GET /api/reference/categories', () => {
  test('returns 200 with categories array', async () => {
    mockPrisma.serviceCategory.findMany.mockResolvedValue(mockCategories);
    const res = await GET(new NextRequest('http://test/api/reference/categories'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('response shape has required fields per category', async () => {
    mockPrisma.serviceCategory.findMany.mockResolvedValue([mockCategories[0]]);
    const res = await GET(new NextRequest('http://test/api/reference/categories'));
    const { data } = await res.json();

    expect(data[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      targetGroup: expect.stringMatching(/WOMEN|CHILDREN/),
    });
  });

  test('returns 500 when DB throws', async () => {
    mockPrisma.serviceCategory.findMany.mockRejectedValue(new Error('DB down'));
    const res = await GET(new NextRequest('http://test/api/reference/categories'));

    expect(res.status).toBe(500);
    expect((await res.json()).success).toBe(false);
  });
});
```

### 7.3 `admin/regions.test.ts`

```typescript
describe('GET /api/admin/regions', () => {
  test('returns 401 when not authenticated', async () => {
    mockAuth.isAdmin.mockResolvedValue(false);
    const res = await GET(new NextRequest('http://test/api/admin/regions'));

    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('Unauthorized');
  });

  test('returns 200 with states and nested cities for admin', async () => {
    mockAuth.isAdmin.mockResolvedValue(true);
    mockPrisma.state.findMany.mockResolvedValue(mockStatesWithCities);
    const res = await GET(new NextRequest('http://test/api/admin/regions'));

    expect(res.status).toBe(200);
    const { data } = await res.json();
    expect(data[0]).toHaveProperty('cities');
    expect(Array.isArray(data[0].cities)).toBe(true);
  });
});

describe('POST /api/admin/regions', () => {
  test('creates a new city and returns 201', async () => {
    mockAuth.isAdmin.mockResolvedValue(true);
    mockPrisma.city.create.mockResolvedValue(mockCity);

    const req = new NextRequest('http://test/api/admin/regions', {
      method: 'POST',
      body: JSON.stringify({ name: 'New City', stateId: 'state-123' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    expect((await res.json()).data).toMatchObject({ name: 'New City' });
  });

  test('returns 400 when name is missing', async () => {
    mockAuth.isAdmin.mockResolvedValue(true);
    const req = new NextRequest('http://test/api/admin/regions', {
      method: 'POST',
      body: JSON.stringify({ stateId: 'state-123' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/name.*stateId.*required/i);
  });

  test('returns 400 when stateId is missing', async () => {
    mockAuth.isAdmin.mockResolvedValue(true);
    const req = new NextRequest('http://test/api/admin/regions', {
      method: 'POST',
      body: JSON.stringify({ name: 'City Name' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  test('returns 401 for non-admin user', async () => {
    mockAuth.isAdmin.mockResolvedValue(false);
    const req = new NextRequest('http://test/api/admin/regions', {
      method: 'POST',
      body: JSON.stringify({ name: 'City', stateId: 'state-1' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });
});
```

### 7.4 `admin/service-categories.test.ts`

```typescript
describe('POST /api/admin/service-categories', () => {
  test('creates category with targetGroup=WOMEN', async () => {
    mockAuth.isAdmin.mockResolvedValue(true);
    mockPrisma.serviceCategory.create.mockResolvedValue(mockCategory);

    const req = buildPostRequest({ name: 'Legal Aid', targetGroup: 'WOMEN' });
    const res = await POST(req);

    expect(res.status).toBe(201);
    expect(mockPrisma.serviceCategory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: 'Legal Aid', targetGroup: 'WOMEN' }),
    });
  });

  test('creates category with targetGroup=CHILDREN', async () => {
    mockAuth.isAdmin.mockResolvedValue(true);
    mockPrisma.serviceCategory.create.mockResolvedValue({ ...mockCategory, targetGroup: 'CHILDREN' });

    const req = buildPostRequest({ name: 'Child Care', targetGroup: 'CHILDREN' });
    const res = await POST(req);

    expect(res.status).toBe(201);
  });

  test('returns 400 for invalid targetGroup value', async () => {
    mockAuth.isAdmin.mockResolvedValue(true);
    const req = buildPostRequest({ name: 'Test', targetGroup: 'INVALID' });
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/CHILDREN or WOMEN/);
  });

  test('trims whitespace from name before saving', async () => {
    mockAuth.isAdmin.mockResolvedValue(true);
    mockPrisma.serviceCategory.create.mockResolvedValue(mockCategory);

    const req = buildPostRequest({ name: '  Legal Aid  ', targetGroup: 'WOMEN' });
    await POST(req);

    expect(mockPrisma.serviceCategory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: 'Legal Aid' }),
    });
  });

  test('uses displayOrder=99 when not provided', async () => {
    mockAuth.isAdmin.mockResolvedValue(true);
    mockPrisma.serviceCategory.create.mockResolvedValue(mockCategory);

    const req = buildPostRequest({ name: 'Test', targetGroup: 'WOMEN' });
    await POST(req);

    expect(mockPrisma.serviceCategory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ displayOrder: 99 }),
    });
  });
});
```

### 7.5 `registration/submit.test.ts`

```typescript
describe('POST /api/registration/submit', () => {
  test('returns 400 when payload is missing required fields', async () => {
    const req = buildPostRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test('returns 201 on valid complete submission', async () => {
    mockPrisma.organization.create.mockResolvedValue(mockOrg);
    const req = buildPostRequest(buildCompleteRegistrationPayload());
    const res = await POST(req);
    expect(res.status).toBe(201);
    expect((await res.json()).data).toHaveProperty('id');
  });

  test('saves organization with status PENDING', async () => {
    mockPrisma.organization.create.mockResolvedValue(mockOrg);
    await POST(buildPostRequest(buildCompleteRegistrationPayload()));
    expect(mockPrisma.organization.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'PENDING' }) })
    );
  });

  test('returns 400 when branch pinCode is not 6 digits', async () => {
    const payload = buildCompleteRegistrationPayload({
      branches: [buildBranch({ pinCode: '123' })],
    });
    const res = await POST(buildPostRequest(payload));
    expect(res.status).toBe(400);
  });

  test('returns 500 and does not partially save when DB throws mid-transaction', async () => {
    mockPrisma.$transaction.mockRejectedValue(new Error('DB error'));
    const res = await POST(buildPostRequest(buildCompleteRegistrationPayload()));
    expect(res.status).toBe(500);
  });
});
```

### 7.6 `registration/draft.test.ts`

```typescript
describe('POST /api/registration/draft', () => {
  test('saves draft and returns a token', async () => {
    mockPrisma.draft.create.mockResolvedValue({ token: 'abc123', expiresAt: future() });
    const res = await POST(buildPostRequest({ formData: buildOrganization() }));
    expect(res.status).toBe(201);
    expect((await res.json())).toHaveProperty('token');
  });
});

describe('GET /api/registration/draft/:token', () => {
  test('returns draft data for valid token', async () => {
    mockPrisma.draft.findUnique.mockResolvedValue({
      token: 'abc123',
      data: buildOrganization(),
      expiresAt: future(),
    });
    const res = await GET(buildGetRequest({ params: { token: 'abc123' } }));
    expect(res.status).toBe(200);
    expect((await res.json()).data).toBeTruthy();
  });

  test('returns 404 for non-existent token', async () => {
    mockPrisma.draft.findUnique.mockResolvedValue(null);
    const res = await GET(buildGetRequest({ params: { token: 'does-not-exist' } }));
    expect(res.status).toBe(404);
  });

  test('returns 410 Gone for expired draft', async () => {
    mockPrisma.draft.findUnique.mockResolvedValue({
      token: 'expired',
      data: {},
      expiresAt: past(),
    });
    const res = await GET(buildGetRequest({ params: { token: 'expired' } }));
    expect(res.status).toBe(410);
  });
});
```

### 7.7 `volunteer/organizations.test.ts`

```typescript
describe('GET /api/volunteer/organizations', () => {
  test('returns 401 for unauthenticated request', async () => {
    mockAuth.isVolunteer.mockResolvedValue(false);
    const res = await GET(new NextRequest('http://test/api/volunteer/organizations'));
    expect(res.status).toBe(401);
  });

  test('returns only PENDING organizations by default', async () => {
    mockAuth.isVolunteer.mockResolvedValue(true);
    mockPrisma.organization.findMany.mockResolvedValue([mockPendingOrg]);
    const res = await GET(new NextRequest('http://test/api/volunteer/organizations'));
    const { data } = await res.json();
    expect(data.every((o: any) => o.status === 'PENDING')).toBe(true);
  });

  test('supports ?status=APPROVED query param', async () => {
    mockAuth.isVolunteer.mockResolvedValue(true);
    mockPrisma.organization.findMany.mockResolvedValue([mockApprovedOrg]);
    const res = await GET(new NextRequest('http://test/api/volunteer/organizations?status=APPROVED'));
    const { data } = await res.json();
    expect(data.every((o: any) => o.status === 'APPROVED')).toBe(true);
  });
});

describe('POST /api/volunteer/organizations/:id/status', () => {
  test('approves organization and returns updated record', async () => {
    mockAuth.isVolunteer.mockResolvedValue(true);
    mockPrisma.organization.update.mockResolvedValue({ ...mockPendingOrg, status: 'APPROVED' });
    const res = await POST(buildStatusRequest('org-1', { action: 'APPROVE' }));
    expect(res.status).toBe(200);
    expect((await res.json()).data.status).toBe('APPROVED');
  });

  test('requires a note when rejecting', async () => {
    mockAuth.isVolunteer.mockResolvedValue(true);
    const res = await POST(buildStatusRequest('org-1', { action: 'REJECT', note: '' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/note.*required/i);
  });

  test('returns 404 for non-existent organization', async () => {
    mockAuth.isVolunteer.mockResolvedValue(true);
    mockPrisma.organization.findUnique.mockResolvedValue(null);
    const res = await POST(buildStatusRequest('fake-id', { action: 'APPROVE' }));
    expect(res.status).toBe(404);
  });
});
```

### 7.8 `auth/signup.test.ts`

```typescript
describe('POST /api/auth/signup', () => {
  test('creates user with hashed password', async () => {
    mockPrisma.user.create.mockResolvedValue(mockUser);
    const res = await POST(buildSignupRequest({ email: 'user@test.com', password: 'Password1!' }));
    expect(res.status).toBe(201);
    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'user@test.com',
          password: expect.not.stringContaining('Password1!'), // must be hashed
        }),
      })
    );
  });

  test('returns 409 when email already exists', async () => {
    mockPrisma.user.create.mockRejectedValue({ code: 'P2002' }); // Prisma unique constraint
    const res = await POST(buildSignupRequest({ email: 'taken@test.com', password: 'Pass1!' }));
    expect(res.status).toBe(409);
  });

  test('returns 400 for invalid email format', async () => {
    const res = await POST(buildSignupRequest({ email: 'notanemail', password: 'Pass1!' }));
    expect(res.status).toBe(400);
  });
});
```

---

## 8. Component Tests — React Components

**Location:** `tests/components/`
**Tools:** Vitest + React Testing Library + MSW

### 8.1 `ProgressIndicator.test.tsx`

```typescript
describe('ProgressIndicator', () => {
  test('renders all 7 section labels', () => {
    render(<ProgressIndicator currentSection={1} completedSections={[]} totalSections={7} />);
    expect(screen.getByText(/Organization Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Information/i)).toBeInTheDocument();
    // ... all 7
  });

  test('marks completed sections with a checkmark', () => {
    render(<ProgressIndicator currentSection={3} completedSections={[1, 2]} totalSections={7} />);
    const checkmarks = screen.getAllByRole('img', { name: /complete/i });
    expect(checkmarks).toHaveLength(2);
  });

  test('highlights the current active section', () => {
    render(<ProgressIndicator currentSection={2} completedSections={[1]} totalSections={7} />);
    const activeStep = screen.getByRole('listitem', { current: 'step' });
    expect(activeStep).toHaveTextContent(/Contact/i);
  });

  test('shows correct remaining sections count', () => {
    render(<ProgressIndicator currentSection={3} completedSections={[1, 2]} totalSections={7} />);
    expect(screen.getByText(/5 sections remaining/i)).toBeInTheDocument();
  });
});
```

### 8.2 `OrganizationSection.test.tsx`

```typescript
describe('OrganizationSection', () => {
  test('renders all required fields', () => {
    render(<OrganizationSection onValidate={vi.fn()} />);
    expect(screen.getByLabelText(/Organization Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Registration Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Registration Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year Established/i)).toBeInTheDocument();
  });

  test('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup();
    render(<OrganizationSection onValidate={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Validate and continue/i }));
    expect(await screen.findByText(/at least 3 characters/i)).toBeInTheDocument();
  });

  test('calls onValidate with form data when all fields are valid', async () => {
    const user = userEvent.setup();
    const onValidate = vi.fn();
    render(<OrganizationSection onValidate={onValidate} />);

    await user.type(screen.getByLabelText(/Organization Name/i), 'Test NGO');
    await user.selectOptions(screen.getByLabelText(/Registration Type/i), 'NGO');
    await user.type(screen.getByLabelText(/Registration Number/i), 'REG123');
    await user.type(screen.getByLabelText(/Year Established/i), '2010');
    await user.click(screen.getByRole('button', { name: /Validate and continue/i }));

    await waitFor(() => expect(onValidate).toHaveBeenCalledOnce());
    expect(onValidate).toHaveBeenCalledWith(
      expect.objectContaining({ organizationName: 'Test NGO' })
    );
  });

  test('faith categories are fetched from API and displayed as dropdown', async () => {
    render(<OrganizationSection onValidate={vi.fn()} />);
    expect(await screen.findByText(/Hindu/i)).toBeInTheDocument(); // from MSW mock
  });
});
```

### 8.3 `LanguagesSection.test.tsx`

```typescript
describe('LanguagesSection', () => {
  test('fetches and renders language checkboxes from API', async () => {
    render(<LanguagesSection onValidate={vi.fn()} />);
    expect(await screen.findByLabelText(/Hindi/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Tamil/i)).toBeInTheDocument();
  });

  test('shows loading state while fetching', () => {
    // Delay MSW response
    server.use(http.get('/api/reference/languages', async () => {
      await delay(200);
      return HttpResponse.json({ success: true, data: [] });
    }));
    render(<LanguagesSection onValidate={vi.fn()} />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // LoadingSpinner
  });

  test('shows error state when API fails', async () => {
    server.use(http.get('/api/reference/languages', () =>
      HttpResponse.json({ success: false }, { status: 500 })
    ));
    render(<LanguagesSection onValidate={vi.fn()} />);
    expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();
  });

  test('updates selected count as checkboxes are checked', async () => {
    const user = userEvent.setup();
    render(<LanguagesSection onValidate={vi.fn()} />);
    await screen.findByLabelText(/Hindi/i);

    await user.click(screen.getByLabelText(/Hindi/i));
    expect(screen.getByText(/1 selected/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText(/Tamil/i));
    expect(screen.getByText(/2 selected/i)).toBeInTheDocument();
  });

  test('deselecting a language decrements the count', async () => {
    const user = userEvent.setup();
    render(<LanguagesSection onValidate={vi.fn()} />);
    await screen.findByLabelText(/Hindi/i);

    await user.click(screen.getByLabelText(/Hindi/i));
    await user.click(screen.getByLabelText(/Hindi/i));
    expect(screen.getByText(/0 selected/i)).toBeInTheDocument();
  });
});
```

### 8.4 `FileUpload.test.tsx`

```typescript
describe('FileUpload', () => {
  test('accepts valid PDF file', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FileUpload accept=".pdf,.jpg,.png" maxSizeMB={5} onChange={onChange} />);

    const file = createMockFile('cert.pdf', 'application/pdf', 2 * 1024 * 1024);
    await user.upload(screen.getByTestId('file-input'), file);

    expect(onChange).toHaveBeenCalledWith(file);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  test('rejects file exceeding size limit', async () => {
    const user = userEvent.setup();
    render(<FileUpload accept=".pdf" maxSizeMB={5} onChange={vi.fn()} />);

    const bigFile = createMockFile('huge.pdf', 'application/pdf', 6 * 1024 * 1024);
    await user.upload(screen.getByTestId('file-input'), bigFile);

    expect(await screen.findByText(/5MB/i)).toBeInTheDocument();
  });

  test('rejects unsupported file type', async () => {
    const user = userEvent.setup();
    render(<FileUpload accept=".pdf,.jpg,.png" maxSizeMB={5} onChange={vi.fn()} />);

    const wordFile = createMockFile('doc.docx', 'application/vnd.openxmlformats', 1024);
    await user.upload(screen.getByTestId('file-input'), wordFile);

    expect(await screen.findByText(/supported format/i)).toBeInTheDocument();
  });

  test('shows upload progress indicator while uploading', async () => {
    // Implementation-specific: if FileUpload shows progress during upload
    render(<FileUpload accept=".pdf" maxSizeMB={5} onChange={vi.fn()} uploading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

### 8.5 `Toast.test.tsx`

```typescript
describe('Toast component', () => {
  test('renders success toast with correct message', () => {
    render(<Toast type="success" message="Saved successfully" onDismiss={vi.fn()} />);
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass(/success/i);
  });

  test('renders error toast with correct styling', () => {
    render(<Toast type="error" message="Something went wrong" onDismiss={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveClass(/error/i);
  });

  test('calls onDismiss when close button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Toast type="info" message="Info" onDismiss={onDismiss} />);
    await user.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
```

---

## 9. E2E Tests — User Journeys

**Location:** `e2e/`
**Runner:** Playwright (Chromium)
**Existing coverage:** Registration form, volunteer auth, org review, translation review, language dashboard.

### 9.1 Gaps to Fill (New E2E Tests)

#### `e2e/admin-panels.spec.ts`

```typescript
test.describe('Admin Panels', () => {
  test.beforeAll(async () => {
    await createTestVolunteer({ volunteerId: ADMIN_ID, password: ADMIN_PASS, role: 'ADMIN' });
  });

  test('admin can add a new city to an existing state', async ({ page }) => {
    await loginAsAdmin(page, { volunteerId: ADMIN_ID, password: ADMIN_PASS });
    await page.goto('/volunteer/admin/regions');
    await page.getByRole('button', { name: /Add City/i }).click();
    await page.getByLabel(/City Name/i).fill('Test City');
    await page.getByLabel(/State/i).selectOption({ label: 'Karnataka' });
    await page.getByRole('button', { name: /Save/i }).click();
    await expect(page.getByText('Test City')).toBeVisible({ timeout: 10000 });
  });

  test('admin can add a new service category', async ({ page }) => {
    await loginAsAdmin(page, { volunteerId: ADMIN_ID, password: ADMIN_PASS });
    await page.goto('/volunteer/admin/service-categories');
    await page.getByRole('button', { name: /Add Category/i }).click();
    await page.getByLabel(/Category Name/i).fill('E2E Test Category');
    await page.getByLabel(/Target Group/i).selectOption('WOMEN');
    await page.getByRole('button', { name: /Save/i }).click();
    await expect(page.getByText('E2E Test Category')).toBeVisible({ timeout: 10000 });
  });

  test('non-admin volunteer cannot access admin panels', async ({ page }) => {
    await loginAsVolunteer(page, { volunteerId: VOL_ID, password: VOL_PASS });
    await page.goto('/volunteer/admin/regions');
    await expect(page).toHaveURL(/\/volunteer\/dashboard|\/volunteer\/login/);
  });
});
```

#### `e2e/draft-save-resume.spec.ts`

```typescript
test.describe('Draft Save and Resume', () => {
  test('saves draft and resumes with same data', async ({ page }) => {
    await page.goto('/register/form');
    await page.getByLabel(/Organization Name/i).fill('Draft Test NGO');
    // Trigger auto-save (wait for DraftSaveIndicator to show "Saved")
    await expect(page.getByText(/Saved/i)).toBeVisible({ timeout: 10000 });

    // Get the resume URL from the indicator
    const resumeUrl = await page.getByRole('link', { name: /Resume/i }).getAttribute('href');
    expect(resumeUrl).toBeTruthy();

    // Navigate away, then resume
    await page.goto('/');
    await page.goto(resumeUrl!);
    await expect(page.getByLabel(/Organization Name/i)).toHaveValue('Draft Test NGO');
  });

  test('expired draft shows user-friendly message', async ({ page }) => {
    await page.goto('/register/resume?token=expired-token');
    await expect(page.getByText(/draft.*expired|no longer available/i)).toBeVisible();
  });
});
```

#### `e2e/complete-registration.spec.ts`

```typescript
test.describe('Complete Registration Flow', () => {
  test('submits all 7 sections and reaches success page', async ({ page }) => {
    await page.goto('/register/form');

    // Section 1: Organization
    await fillOrganizationSection(page, buildOrganization());
    await page.locator('#section-1-content').getByRole('button', { name: /Validate/i }).click();
    await expect(page.locator('#section-1-header').getByText(/Complete/i)).toBeVisible();

    // Section 2: Contact
    await page.locator('#section-2-header').click();
    await fillContactSection(page, buildContact());
    await page.locator('#section-2-content').getByRole('button', { name: /Validate/i }).click();
    await expect(page.locator('#section-2-header').getByText(/Complete/i)).toBeVisible();

    // ... Sections 3-7 similarly filled

    // Submit
    const submitBtn = page.getByRole('button', { name: /Submit Registration/i });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    await page.waitForURL('/register/success', { timeout: 30000 });
    await expect(page.getByText(/Registration submitted successfully/i)).toBeVisible();
  });
});
```

#### `e2e/mobile-responsive.spec.ts`

```typescript
test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone 14

  test('registration form is usable on mobile', async ({ page }) => {
    await page.goto('/register/form');
    const orgNameInput = page.getByLabel(/Organization Name/i);
    await expect(orgNameInput).toBeVisible();
    // Touch target should be at least 44px tall
    const box = await orgNameInput.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('navigation menu is accessible on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
```

### 9.2 Existing E2E Test Improvements

The following improvements to existing E2E test files should be written first as failing tests:

| File | Improvement Needed |
|------|--------------------|
| `registration.spec.ts` | Add test for `test/seed-volunteer` guard (must 404 in production) |
| `registration.spec.ts` | Add test: duplicate registration number shows duplicate error |
| `volunteer-auth.spec.ts` | Add test: session expires after 8 hours (mock clock) |
| `volunteer-auth.spec.ts` | Add test: inactivity warning shown at 7 hours |
| `org-review.spec.ts` | Add test: approved org cannot be approved again |
| `translation-review.spec.ts` | Add test: volunteer correction is persisted and visible after page reload |

---

## 10. Security Tests

**Location:** `tests/security/`
**Tools:** Vitest (unit-level) + Playwright (E2E-level)

### 10.1 Authentication & Authorization

```typescript
describe('Route protection', () => {
  const protectedRoutes = [
    '/volunteer/dashboard',
    '/volunteer/organizations',
    '/volunteer/admin/regions',
    '/volunteer/languages',
  ];

  test.each(protectedRoutes)(
    'unauthenticated user is redirected from %s',
    async (route) => {
      // Via Playwright: navigate without session, verify redirect to login
    }
  );

  test('volunteer cannot access admin-only endpoints', async () => {
    mockAuth.isAdmin.mockResolvedValue(false);
    mockAuth.isVolunteer.mockResolvedValue(true);
    const res = await GET(new NextRequest('http://test/api/admin/regions'));
    expect(res.status).toBe(401);
  });

  test('SUPER_ADMIN can access all admin endpoints', async () => {
    mockAuth.isAdmin.mockResolvedValue(true);
    const res = await GET(new NextRequest('http://test/api/admin/regions'));
    expect(res.status).toBe(200);
  });
});
```

### 10.2 Input Sanitization

```typescript
describe('SQL Injection prevention', () => {
  test('malicious SQL in org name is sanitized by Prisma parameterization', async () => {
    const payload = buildCompleteRegistrationPayload({
      organizationName: "'; DROP TABLE organizations; --",
    });
    // Prisma parameterizes all queries, so this should be stored as a literal string
    mockPrisma.organization.create.mockResolvedValue(mockOrg);
    const res = await POST(buildPostRequest(payload));
    // Should not throw; Prisma handles parameterization
    expect(res.status).toBe(201);
  });
});

describe('XSS prevention', () => {
  test('HTML script tags in org name are not rendered unescaped', async ({ page }) => {
    // In E2E: submit org with <script>alert(1)</script> in name
    // Verify in volunteer review that it is escaped
  });
});
```

### 10.3 File Upload Security

```typescript
describe('File upload security', () => {
  test('rejects executable files disguised as PDF', async () => {
    const exe = createMockFile('malware.exe.pdf', 'application/x-msdownload', 1024);
    const res = await POST(buildUploadRequest(exe));
    expect(res.status).toBe(400);
  });

  test('rejects files with path traversal in filename', async () => {
    const file = createMockFile('../../../etc/passwd', 'application/pdf', 1024);
    const res = await POST(buildUploadRequest(file));
    expect(res.status).toBe(400);
  });

  test('validates actual file MIME type, not just extension', async () => {
    // A .pdf file containing HTML content
    const htmlAsPdf = createMockFile('fake.pdf', 'text/html', 1024);
    const res = await POST(buildUploadRequest(htmlAsPdf));
    expect(res.status).toBe(400);
  });
});
```

### 10.4 CORS

```typescript
describe('CORS headers', () => {
  test('rejects request from non-whitelisted origin', async () => {
    const res = await fetch('/api/reference/categories', {
      headers: { Origin: 'https://evil.com' },
    });
    expect(res.headers.get('Access-Control-Allow-Origin')).not.toBe('https://evil.com');
  });
});
```

---

## 11. Accessibility Tests

**Tools:** `@axe-core/playwright` for automated WCAG checks + manual assertions.

### 11.1 Setup

```bash
npm install -D @axe-core/playwright
```

### 11.2 Axe Integration

```typescript
// e2e/accessibility.spec.ts
import AxeBuilder from '@axe-core/playwright';

test.describe('WCAG 2.1 AA compliance', () => {
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Registration Form', path: '/register/form' },
    { name: 'Registration Start', path: '/register/start' },
    { name: 'Volunteer Login', path: '/volunteer/login' },
  ];

  for (const { name, path } of pages) {
    test(`${name} has no critical WCAG violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      expect(results.violations).toHaveLength(0);
    });
  }
});
```

### 11.3 Keyboard Navigation Tests

```typescript
describe('Keyboard navigation', () => {
  test('all form fields are reachable via Tab key', async ({ page }) => {
    await page.goto('/register/form');
    await page.keyboard.press('Tab'); // Focus first interactive element
    // Navigate through all fields and verify focus reaches submit button
  });

  test('skip link moves focus to main content', async ({ page }) => {
    await page.goto('/register/form');
    await page.keyboard.press('Tab'); // Focus skip link
    await page.keyboard.press('Enter');
    const mainContent = page.getByRole('main');
    await expect(mainContent).toBeFocused();
  });

  test('modal dialogs trap focus', async ({ page }) => {
    // Open a confirmation modal, verify Tab cycles within modal
  });
});
```

### 11.4 Screen Reader Assertions (Unit Level)

```typescript
describe('ARIA attributes', () => {
  test('form fields have associated labels', () => {
    render(<OrganizationSection onValidate={vi.fn()} />);
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toHaveAccessibleName();
    });
  });

  test('validation errors are announced to screen readers', async () => {
    const user = userEvent.setup();
    render(<OrganizationSection onValidate={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Validate/i }));
    const errors = await screen.findAllByRole('alert');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('progress indicator uses aria-current="step"', () => {
    render(<ProgressIndicator currentSection={2} completedSections={[1]} totalSections={7} />);
    const currentStep = screen.getByRole('listitem', { current: 'step' });
    expect(currentStep).toBeInTheDocument();
  });
});
```

---

## 12. Performance Tests

**Tools:** Playwright + Chrome DevTools Protocol for Lighthouse-style checks.

### 12.1 Page Load Budgets

```typescript
// e2e/performance.spec.ts
test.describe('Performance budgets', () => {
  test('home page loads in under 3 seconds on simulated 3G', async ({ page }) => {
    await page.route('**', async (route) => {
      await new Promise((r) => setTimeout(r, 50)); // Simulate latency
      await route.continue();
    });
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test('registration form renders first interactive field in under 2 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/register/form');
    await page.waitForSelector('input[name="organizationName"]');
    expect(Date.now() - start).toBeLessThan(2000);
  });
});
```

### 12.2 API Response Time

```typescript
describe('API response times (integration)', () => {
  test.each([
    '/api/reference/categories',
    '/api/reference/languages',
    '/api/reference/states',
  ])('%s responds in under 200ms', async (path) => {
    const start = Date.now();
    await GET(new NextRequest(`http://test${path}`));
    expect(Date.now() - start).toBeLessThan(200);
  });
});
```

---

## 13. Test Coverage Targets

| Layer | Lines | Functions | Branches | Statements |
|-------|-------|-----------|----------|------------|
| Validation schemas | **100%** | **100%** | **100%** | **100%** |
| Utility functions | **95%** | **95%** | **90%** | **95%** |
| API routes | **85%** | **90%** | **80%** | **85%** |
| React components | **80%** | **80%** | **75%** | **80%** |
| **Overall** | **80%** | **80%** | **75%** | **80%** |

Coverage is enforced in CI — builds fail if thresholds are not met.

---

## 14. CI/CD Integration

### 14.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-and-integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: saathi_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/saathi_test
      - run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/saathi_test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-report
          path: coverage/

  e2e:
    runs-on: ubuntu-latest
    needs: unit-and-integration
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
        env:
          CI: true
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### 14.2 Pre-commit Hook (Husky)

```bash
npm install -D husky lint-staged
npx husky init
```

**`.husky/pre-commit`**:
```bash
#!/bin/sh
# Run affected unit tests only (fast feedback loop)
npx vitest run --changed HEAD
```

**`.husky/pre-push`**:
```bash
#!/bin/sh
# Full unit + integration suite before push
npm run test:coverage
```

---

## 15. TDD Workflow for New Features

Every new feature or bug fix MUST follow this workflow:

### Step-by-Step Protocol

```
┌─────────────────────────────────────────────────────────────────┐
│  1. UNDERSTAND THE REQUIREMENT                                   │
│     Read the spec, ask clarifying questions, define acceptance   │
│     criteria in plain English.                                   │
├─────────────────────────────────────────────────────────────────┤
│  2. WRITE A FAILING TEST (RED)                                   │
│     • Pick the smallest useful test that captures one criterion. │
│     • Run it. Confirm it fails with a meaningful error.          │
│     • Do NOT write implementation yet.                           │
├─────────────────────────────────────────────────────────────────┤
│  3. WRITE MINIMUM CODE TO PASS (GREEN)                           │
│     • Only write enough to make the test pass.                   │
│     • Resist the urge to over-engineer.                          │
│     • Run tests. Confirm only the new test was failing.          │
├─────────────────────────────────────────────────────────────────┤
│  4. REFACTOR                                                     │
│     • Improve naming, extract helpers, remove duplication.       │
│     • All tests must remain green throughout.                    │
├─────────────────────────────────────────────────────────────────┤
│  5. REPEAT for the next acceptance criterion.                    │
└─────────────────────────────────────────────────────────────────┘
```

### Feature Example: "Add Social Category via Admin Panel"

| Step | Action |
|------|--------|
| **RED** | Write `POST /api/admin/social-categories` test asserting 201 + trimmed name |
| **RED** | Write test asserting 400 when `name` is missing |
| **RED** | Write test asserting 401 when not admin |
| **GREEN** | Implement the route handler to pass all three tests |
| **REFACTOR** | Extract `requireAdmin` middleware if duplicated across routes |
| **RED** | Write component test: "Admin can type a name and click Save" |
| **GREEN** | Implement the admin panel UI component |
| **REFACTOR** | Extract `AdminPanelForm` if 3+ admin panels share the same pattern |
| **RED** | Write E2E test covering full flow in the browser |
| **GREEN** | Confirm E2E passes with real server |

### File Naming Convention

```
tests/
  unit/
    validation/
      organizationSchema.test.ts     # matches src/lib/validation/organizationSchema.ts
    utils/
      draftToken.test.ts             # matches src/lib/utils/draftToken.ts
  integration/
    api/
      admin/
        regions.test.ts              # matches backend/src/app/api/admin/regions/route.ts
  components/
    OrganizationSection.test.tsx     # matches src/components/register/sections/OrganizationSection.tsx
e2e/
  registration.spec.ts              # existing
  admin-panels.spec.ts              # new
  draft-save-resume.spec.ts         # new
  accessibility.spec.ts             # new
  performance.spec.ts               # new
```

---

## Appendix: Test Utilities Reference

### `buildPostRequest(body)`
```typescript
function buildPostRequest(body: unknown): NextRequest {
  return new NextRequest('http://test/api', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### `createMockFile(name, type, sizeBytes)`
```typescript
function createMockFile(name: string, type: string, sizeBytes: number): File {
  const content = new Uint8Array(sizeBytes).fill(0);
  return new File([content], name, { type });
}
```

### `expectValid(overrides)` / `expectError(overrides, message)`
```typescript
function expectValid(overrides: Partial<T>) {
  const result = schema.safeParse({ ...validBase, ...overrides });
  expect(result.success).toBe(true);
}

function expectError(overrides: Partial<T>, message: string | RegExp) {
  const result = schema.safeParse({ ...validBase, ...overrides });
  expect(result.success).toBe(false);
  const messages = result.error?.errors.map((e) => e.message).join(' ') ?? '';
  expect(messages).toMatch(message);
}
```
