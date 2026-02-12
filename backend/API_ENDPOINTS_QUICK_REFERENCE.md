# API Endpoints Quick Reference

## Base URL
```
Development: http://localhost:3000/api
Production: [Update with production URL]/api
```

## Reference Data Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reference/categories` | GET | Get all service categories |
| `/reference/resources` | GET | Get all service resources (optional: `?categoryId=<uuid>`) |
| `/reference/states` | GET | Get all Indian states |
| `/reference/cities` | GET | Get cities (optional: `?search=<query>`) |
| `/reference/languages` | GET | Get all active languages |

## Registration Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/registration/draft` | POST | Save registration draft |
| `/registration/draft/<token>` | GET | Load saved draft |
| `/registration/draft/<token>` | DELETE | Delete saved draft |
| `/registration/submit` | POST | Submit complete registration |

## File Upload Endpoints

| Endpoint | Method | Description | Max Size | Allowed Types |
|----------|--------|-------------|----------|---------------|
| `/upload/document` | POST | Upload document (PDF/JPEG/PNG) | 5MB | PDF, JPEG, PNG |
| `/upload/logo` | POST | Upload logo (JPEG/PNG/SVG) | 2MB | JPEG, PNG, SVG |

## Health & Testing

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/db-test` | GET | Database connectivity test |

---

## Response Format

**Success:**
```json
{ "success": true, "data": {...} }
```

**Error:**
```json
{ "success": false, "error": "Error message" }
```

**Validation Error:**
```json
{ "success": false, "errors": [{ "field": "...", "message": "..." }] }
```

---

For detailed documentation, see `API_ENDPOINTS.md`
