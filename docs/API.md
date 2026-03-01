# Saathi API Documentation

**Version:** 2.0.0
**Base URL:** `http://localhost:3000/api` (Development)
**Last Updated:** February 26, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Reference Data APIs](#reference-data-apis)
4. [Registration APIs](#registration-apis)
5. [File Upload APIs](#file-upload-apis)
6. [Volunteer APIs](#volunteer-apis)
7. [Admin Data Management APIs](#admin-data-management-apis)
8. [Public Org APIs (Mobile App)](#public-org-apis-mobile-app)
9. [Health & Testing](#health--testing)
10. [Error Handling](#error-handling)
11. [Rate Limiting](#rate-limiting)

---

## Overview

The Saathi API provides endpoints for:
- User authentication and authorization
- Reference data (categories, resources, states, cities, languages)
- Organization registration and draft management
- File uploads (documents and logos)
- Volunteer organization review and approval workflow
- Admin CRUD operations for all reference data entities
- Public organization search for mobile app integration

### API Groups

| Group | Base Path | Auth | Description |
|-------|-----------|------|-------------|
| Reference | `/api/reference/...` | None | Read-only reference data |
| Registration | `/api/registration/...` | None | Draft + form submission |
| Upload | `/api/upload/...` | None | Document and logo uploads |
| Volunteer | `/api/volunteer/...` | VOLUNTEER+ | Org review queue + approval |
| Admin | `/api/admin/...` | ADMIN+ | CRUD for all reference entities |
| Public Orgs | `/api/orgs/...` | None | Mobile app org search |
| Auth | `/api/auth/...` | — | NextAuth.js session management |

### Base URL

```
Development: http://localhost:3000/api
Production:  https://saathi-nmjuxe7e5m.dcdeploy.cloud/api
```

### Response Format

All endpoints follow a consistent response format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error message" // Optional
}
```

**Validation Error Response:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

---

## Authentication

### Signup
**POST** `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",  // Optional
  "role": "ORGANIZATION"  // Optional: ORGANIZATION, ADMIN, SUPER_ADMIN
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "ORGANIZATION"
    },
    "message": "User created successfully"
  }
}
```

**Error Responses:**
- `400`: Validation error (invalid email, password too short, etc.)
- `409`: User already exists

---

### Login
**POST** `/api/auth/signin/credentials`

Login with email and password (NextAuth endpoint).

**Request (form-urlencoded):**
```
email=user@example.com&password=SecurePassword123!&redirect=false&callbackUrl=http://localhost:3000
```

**Response:** NextAuth session cookie

**Error Responses:**
- `401`: Invalid credentials
- `500`: Server error

---

### Get Session
**GET** `/api/auth/session`

Get current user session.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ORGANIZATION"
  },
  "expires": "2026-03-11T16:29:04.294Z"
}
```

---

### Sign Out
**POST** `/api/auth/signout`

Sign out current user.

**Response:**
```json
{
  "url": "http://localhost:3000"
}
```

---

## Reference Data APIs

### Get Service Categories
**GET** `/api/reference/categories`

Get all service categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Education",
      "targetGroup": "CHILDREN",
      "displayOrder": 1
    }
  ]
}
```

---

### Get Service Resources
**GET** `/api/reference/resources`  
**GET** `/api/reference/resources?categoryId=<uuid>`

Get all service resources, optionally filtered by category.

**Query Parameters:**
- `categoryId` (optional): Filter resources by category ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Scholarship Programs",
      "description": "Financial aid for students",
      "categoryId": "uuid"
    }
  ]
}
```

---

### Get States
**GET** `/api/reference/states`

Get all Indian states and union territories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Karnataka",
      "code": "KA"
    }
  ]
}
```

---

### Get Cities
**GET** `/api/reference/cities`  
**GET** `/api/reference/cities?search=<query>`

Get cities, optionally filtered by search query.

**Query Parameters:**
- `search` (optional): Search cities by name (case-insensitive, partial match)
- Results limited to 50 cities for performance

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Bangalore",
      "stateId": "uuid",
      "stateName": "Karnataka"
    }
  ]
}
```

---

### Get Languages
**GET** `/api/reference/languages`

Get all active languages.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Hindi",
      "code": "hi",
      "isActive": true
    }
  ]
}
```

---

## Registration APIs

### Save Draft
**POST** `/api/registration/draft`

Save registration form data as a draft (expires in 30 days).

**Request Body:**
```json
{
  "email": "user@example.com",  // Optional
  "draftData": {
    "organizationName": "Example NGO",
    "registrationType": "NGO",
    // ... any JSON object containing form data
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "uuid-token",
    "expiresAt": "2026-03-11T16:29:04.294Z"
  }
}
```

**Error Responses:**
- `400`: Missing draftData
- `500`: Server error

---

### Load Draft
**GET** `/api/registration/draft/<token>`

Load a saved draft by token.

**Response:**
```json
{
  "success": true,
  "data": {
    // The draftData object that was saved
    "organizationName": "Example NGO",
    // ... other form fields
  }
}
```

**Error Responses:**
- `404`: Draft not found
- `410`: Draft has expired (and was automatically deleted)

---

### Delete Draft
**DELETE** `/api/registration/draft/<token>`

Delete a saved draft.

**Response:**
```json
{
  "success": true,
  "message": "Draft deleted successfully"
}
```

**Error Responses:**
- `404`: Draft not found

---

### Submit Registration
**POST** `/api/registration/submit`

Submit complete organization registration.

**Request Body:**
```json
{
  "organizationName": "Example NGO",
  "registrationType": "NGO",
  "registrationNumber": "NGO123456",
  "yearEstablished": 2020,
  "faithId": "uuid",  // Optional
  "websiteUrl": "https://example.com",  // Optional

  "primaryContact": {
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com"
  },

  "secondaryContact": {  // Optional
    "name": "Jane Doe",
    "phone": "9876543211",
    "email": "jane@example.com"
  },

  "facebookUrl": "https://facebook.com/example",  // Optional
  "instagramHandle": "@example",  // Optional
  "twitterHandle": "@example",  // Optional

  "categoryIds": ["uuid1", "uuid2"],
  "resourceIds": ["uuid1", "uuid2"],

  "branches": [
    {
      "addressLine1": "123 Main Street, Koramangala",
      "addressLine2": "Near Metro Station",  // Optional
      "cityId": "uuid",
      "stateId": "uuid",
      "pinCode": "560095",
      "timings": [  // Optional
        {
          "dayOfWeek": "MONDAY",
          "openTime": "09:00",
          "closeTime": "18:00",
          "isClosed": false
        }
      ]
    }
  ],

  "languageIds": ["uuid1", "uuid2"],

  "documents": {
    "registrationCertificateUrl": "/uploads/documents/certificate.pdf",
    "logoUrl": "/uploads/logos/logo.png",  // Optional
    "additionalCertificateUrls": [  // Optional
      "/uploads/documents/cert2.pdf"
    ]
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "organizationId": "uuid",
    "message": "Registration submitted successfully"
  }
}
```

**Error Responses:**
- `400`: Validation error (see errors array)
- `409`: Duplicate organization (same name in same city)
- `500`: Server error

**Validation Rules:**
- Organization name: 3-100 characters
- Registration type: NGO, TRUST, GOVERNMENT, PRIVATE, OTHER
- Year established: 1800 to current year
- Phone: Exactly 10 digits, must start with 6, 7, 8, or 9
- PIN code: Exactly 6 digits
- Email: Valid email format
- At least 1 category and 1 resource required
- At least 1 branch required
- At least 1 language required

---

## File Upload APIs

### Upload Document
**POST** `/api/upload/document`

Upload a document (registration certificate, additional certificates).

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with key `file`

**File Requirements:**
- Types: PDF, JPEG, PNG
- Max Size: 5MB

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "1234567890-certificate.pdf",
    "fileUrl": "/uploads/documents/1234567890-certificate.pdf",
    "fileSize": 245678,
    "mimeType": "application/pdf"
  }
}
```

**Error Responses:**
- `400`: Invalid file type or size exceeded
- `500`: Upload failed

**Usage Example:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3000/api/upload/document', {
  method: 'POST',
  body: formData,
});
```

---

### Upload Logo
**POST** `/api/upload/logo`

Upload organization logo.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with key `file`

**File Requirements:**
- Types: JPEG, PNG, SVG
- Max Size: 2MB

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "1234567890-logo.png",
    "fileUrl": "/uploads/logos/1234567890-logo.png",
    "fileSize": 123456,
    "mimeType": "image/png"
  }
}
```

**Error Responses:**
- `400`: Invalid file type or size exceeded
- `500`: Upload failed

---

## Volunteer APIs

All volunteer endpoints require an active session with role `VOLUNTEER`, `ADMIN`, or `SUPER_ADMIN`. Unauthenticated requests return `401 Unauthorized`.

### List Organizations
**GET** `/api/volunteer/organizations`

Returns all submitted organizations for review, ordered by submission date.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "organizationName": "Example NGO",
      "registrationType": "NGO",
      "status": "PENDING",
      "createdAt": "2026-02-20T10:00:00.000Z",
      "primaryContactName": "John Doe",
      "primaryContactEmail": "john@example.com",
      "cityName": "Bangalore",
      "stateName": "Karnataka"
    }
  ]
}
```

---

### Get Organization Detail
**GET** `/api/volunteer/organizations/[id]`

Returns full organization detail including branches, categories, resources, contacts, and documents.

**Response:** Full `Organization` object with all nested relations.

---

### Approve Organization
**POST** `/api/volunteer/organizations/[id]/approve`

Approves a PENDING organization. Sets `status = APPROVED` and records the reviewing volunteer.

**Response:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "APPROVED" }
}
```

**Error Responses:**
- `404`: Organization not found
- `409`: Organization is not in PENDING status

---

### Reject Organization
**POST** `/api/volunteer/organizations/[id]/reject`

Rejects a PENDING organization with an optional reason.

**Request Body:**
```json
{
  "reason": "Incomplete documentation"
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "REJECTED" }
}
```

---

## Admin Data Management APIs

All admin endpoints require role `ADMIN` or `SUPER_ADMIN`. Requests from `VOLUNTEER` or lower return `401 Unauthorized`.

### Service Categories

#### List Service Categories
**GET** `/api/admin/service-categories`

Returns all service categories with resource counts.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Education",
      "targetGroup": "CHILDREN",
      "displayOrder": 1,
      "resourceCount": 8
    }
  ]
}
```

#### Create Service Category
**POST** `/api/admin/service-categories`

**Request Body:**
```json
{
  "name": "Legal Aid",
  "targetGroup": "WOMEN",
  "displayOrder": 5
}
```

**Response (201):** `{ "success": true, "data": { ...category } }`

#### Update Service Category
**PATCH** `/api/admin/service-categories/[id]`

**Request Body:** Any subset of `{ name, targetGroup, displayOrder }`

#### Delete Service Category
**DELETE** `/api/admin/service-categories/[id]`

Blocked with `409 Conflict` if the category has any service resources.

---

### Service Resources

#### List Service Resources
**GET** `/api/admin/service-resources`

Returns all resources with their parent category.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Legal Counselling",
      "description": "Free legal advice",
      "category": { "id": "uuid", "name": "Legal Aid", "targetGroup": "WOMEN" }
    }
  ]
}
```

#### Create Service Resource
**POST** `/api/admin/service-resources`

**Request Body:** `{ name, categoryId, description? }`

#### Update Service Resource
**PATCH** `/api/admin/service-resources/[id]`

**Request Body:** Any subset of `{ name, categoryId, description }`

#### Delete Service Resource
**DELETE** `/api/admin/service-resources/[id]`

---

### Faiths

#### List Faiths
**GET** `/api/admin/faiths`

#### Create Faith
**POST** `/api/admin/faiths`

**Request Body:** `{ name }`

#### Update Faith
**PATCH** `/api/admin/faiths/[id]`

**Request Body:** `{ name }`

#### Delete Faith
**DELETE** `/api/admin/faiths/[id]`

---

### Social Categories

#### List Social Categories
**GET** `/api/admin/social-categories`

#### Create Social Category
**POST** `/api/admin/social-categories`

**Request Body:** `{ name }`

#### Update Social Category
**PATCH** `/api/admin/social-categories/[id]`

**Request Body:** `{ name }`

#### Delete Social Category
**DELETE** `/api/admin/social-categories/[id]`

---

### Regional Data (States & Cities)

#### List States with Cities
**GET** `/api/admin/regions`

Returns all states, each with an array of its cities.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Karnataka",
      "code": "KA",
      "cities": [
        { "id": "uuid", "name": "Bangalore" },
        { "id": "uuid", "name": "Mysore" }
      ]
    }
  ]
}
```

#### Add City to State
**POST** `/api/admin/regions`

**Request Body:** `{ name, stateId }`

#### Update City
**PATCH** `/api/admin/regions/[id]`

**Request Body:** `{ name }`

#### Delete City
**DELETE** `/api/admin/regions/[id]`

---

### Languages

#### List Languages
**GET** `/api/admin/languages`

Returns all languages with translation coverage percentage.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Hindi",
      "code": "hi",
      "scriptFamily": "Devanagari",
      "isRTL": false,
      "fontFamily": "Noto Sans Devanagari",
      "isActive": true,
      "translationCoverage": 85
    }
  ]
}
```

#### Create Language
**POST** `/api/admin/languages`

**Request Body:**
```json
{
  "name": "Tamil",
  "code": "ta",
  "scriptFamily": "Tamil",
  "isRTL": false,
  "fontFamily": "Noto Sans Tamil"
}
```

#### Update Language
**PATCH** `/api/admin/languages/[id]`

**Request Body:** Any subset of `{ name, scriptFamily, isRTL, fontFamily }`

Note: Language `code` is read-only after creation.

#### Delete Language
**DELETE** `/api/admin/languages/[id]`

Blocked with `409 Conflict` if translation jobs reference this language.

---

## Public Org APIs (Mobile App)

These endpoints are unauthenticated and designed for mobile app integration.

### Search Organizations
**GET** `/api/orgs`

Search and filter approved organizations.

**Query Parameters:**
- `q` (optional): Full-text search by name or description
- `categoryId` (optional): Filter by service category
- `resourceId` (optional): Filter by service resource
- `stateId` (optional): Filter by state
- `cityId` (optional): Filter by city
- `languageId` (optional): Filter by supported language
- `page` (optional, default 1): Page number
- `limit` (optional, default 20): Results per page

**Response:**
```json
{
  "success": true,
  "data": {
    "organizations": [ { ... } ],
    "total": 121,
    "page": 1,
    "totalPages": 7
  }
}
```

---

### Get Organization Detail
**GET** `/api/orgs/[id]`

Returns full approved organization detail for the mobile app.

**Response:** Full organization object (APPROVED status only). Returns `404` for non-existent or non-approved organizations.

---

## Health & Testing

### Health Check
**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-11T16:29:04.294Z",
  "service": "Saathi API",
  "version": "1.0.0",
  "environment": "development"
}
```

---

### Database Test
**GET** `/api/db-test`

Test database connectivity (for development/testing).

**Response:**
```json
{
  "success": true,
  "message": "Database connection successful!",
  "data": {
    "testRecord": {
      "id": "uuid",
      "status": "ok",
      "timestamp": "2026-02-11T16:29:04.294Z"
    },
    "totalHealthChecks": 18,
    "database": {
      "type": "PostgreSQL",
      "version": "PostgreSQL 17.5...",
      "connected": true
    }
  }
}
```

---

## Error Handling

### HTTP Status Codes

- `200`: Success
- `201`: Created (signup, registration submission)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate resource)
- `410`: Gone (expired resource)
- `500`: Internal Server Error

### Error Response Format

**Single Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

**Multiple Validation Errors:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "organizationName",
      "message": "Organization name must be at least 3 characters"
    },
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider implementing:
- Rate limiting per IP address
- Rate limiting per user (if authenticated)
- Different limits for different endpoints

---

## Postman Collection

A Postman collection is available at `/backend/postman/Saathi_API.postman_collection.json`

### Import Instructions

1. Open Postman
2. Click "Import" button
3. Select "File" tab
4. Choose `Saathi_API.postman_collection.json`
5. Click "Import"

### Collection Includes

- All reference data endpoints
- Registration endpoints (draft save/load/delete, submit)
- File upload endpoints
- Authentication endpoints
- Health check endpoints

### Environment Variables

Create a Postman environment with:
- `base_url`: `http://localhost:3000/api`
- `auth_token`: (will be set after login)

---

## Testing Guide

### Manual Testing

1. **Start the server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test health check:**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Test reference data:**
   ```bash
   curl http://localhost:3000/api/reference/categories
   ```

4. **Test signup:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123456","name":"Test User"}'
   ```

### Automated Testing

Run the test scripts:
```bash
# Test reference endpoints
npx tsx scripts/test-reference-endpoints.ts

# Test registration endpoints
npx tsx scripts/test-registration-submit.ts

# Test file uploads
npx tsx scripts/test-file-upload.ts

# Test authentication
npx tsx scripts/test-auth.ts
```

---

## Notes for Frontend Team

1. **Base URL:** Use environment variable:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

2. **File Uploads:** Use `FormData` for file uploads, not JSON.

3. **Error Handling:** Always check `success` field before accessing `data`.

4. **Authentication:** Use NextAuth.js client-side hooks for login/session management.

5. **CORS:** CORS is configured to allow requests from frontend.

6. **File URLs:** Uploaded file URLs are relative paths. Prepend base URL for full URLs.

---

## Support

For issues or questions:
- Check error messages in response
- Verify request format matches documentation
- Check server logs for detailed error information
- Contact backend team for assistance

---

**Last Updated:** February 26, 2026
**API Version:** 2.0.0
