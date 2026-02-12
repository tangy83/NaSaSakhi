# NASA Sakhi Backend API Endpoints

**Base URL:** `http://localhost:3000/api` (Development)  
**Production URL:** Update with your production URL

---

## 📋 Table of Contents

1. [Health & Testing](#health--testing)
2. [Reference Data](#reference-data)
3. [Registration](#registration)
4. [File Upload](#file-upload)

---

## 🏥 Health & Testing

### Health Check
**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-09T16:29:04.294Z",
  "service": "NASA Sakhi API",
  "version": "1.0.0",
  "environment": "development"
}
```

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
      "timestamp": "2026-02-09T16:29:04.294Z"
    },
    "totalHealthChecks": 16,
    "database": {
      "type": "PostgreSQL",
      "version": "PostgreSQL 17.5...",
      "connected": true
    }
  }
}
```

---

## 📚 Reference Data

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

### Get States
**GET** `/api/reference/states`

Get all Indian states.

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

### Get Cities
**GET** `/api/reference/cities`  
**GET** `/api/reference/cities?search=<query>`

Get cities, optionally filtered by search query.

**Query Parameters:**
- `search` (optional): Search cities by name (case-insensitive, partial match)

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

**Note:** Results are limited to 50 cities for performance.

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

## 📝 Registration

### Save Draft
**POST** `/api/registration/draft`

Save registration form data as a draft (expires in 30 days).

**Request Body:**
```json
{
  "email": "user@example.com",  // Optional
  "draftData": {
    // Any JSON object containing form data
    "organizationName": "Example NGO",
    "registrationType": "NGO",
    // ... other form fields
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

**Response (Validation Error - 400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "organizationName",
      "message": "Organization name must be at least 3 characters"
    }
  ]
}
```

**Response (Duplicate Organization - 409):**
```json
{
  "success": false,
  "error": "An organization with this name already exists in this city"
}
```

**Response (Server Error - 500):**
```json
{
  "success": false,
  "error": "Failed to submit registration",
  "message": "Error details..."
}
```

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

## 📤 File Upload

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

**Usage Example:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3000/api/upload/logo', {
  method: 'POST',
  body: formData,
});
```

---

## 🔧 Common Response Format

All endpoints follow a consistent response format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error message"  // Optional
}
```

**Validation Errors:**
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

## 📝 Notes for Frontend Team

1. **Base URL:** Use environment variable for base URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

2. **File Uploads:** Use `FormData` for file uploads, not JSON.

3. **Error Handling:** Always check `success` field in response before accessing `data`.

4. **Draft Tokens:** Save the token returned from draft save endpoint to load/delete drafts later.

5. **Validation:** Client-side validation is recommended, but server-side validation will catch any issues.

6. **CORS:** CORS is configured to allow requests from frontend (check middleware if needed).

7. **File URLs:** Uploaded file URLs are relative paths. Prepend base URL for full URLs:
   ```
   Full URL = ${BASE_URL}${fileUrl}
   Example: http://localhost:3000/uploads/documents/certificate.pdf
   ```

---

## 🚀 Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/reference/categories` | GET | Get categories |
| `/api/reference/resources` | GET | Get resources |
| `/api/reference/states` | GET | Get states |
| `/api/reference/cities` | GET | Get cities |
| `/api/reference/languages` | GET | Get languages |
| `/api/registration/draft` | POST | Save draft |
| `/api/registration/draft/<token>` | GET | Load draft |
| `/api/registration/draft/<token>` | DELETE | Delete draft |
| `/api/registration/submit` | POST | Submit registration |
| `/api/upload/document` | POST | Upload document |
| `/api/upload/logo` | POST | Upload logo |

---

**Last Updated:** February 9, 2026  
**Version:** 1.0.0
