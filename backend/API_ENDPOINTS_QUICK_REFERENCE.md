# API Endpoints Quick Reference

**Last Updated:** February 26, 2026

## Base URL
```
Development: http://localhost:3000/api
Production: [Update with production URL]/api
```

## Reference Data (No Auth Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reference/categories` | GET | Get all service categories |
| `/reference/resources` | GET | Get all service resources (optional: `?categoryId=<uuid>`) |
| `/reference/states` | GET | Get all Indian states |
| `/reference/cities` | GET | Get cities (optional: `?search=<query>`) |
| `/reference/languages` | GET | Get all active languages |

## Registration (No Auth Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/registration/draft` | POST | Save registration draft |
| `/registration/draft/<token>` | GET | Load saved draft |
| `/registration/draft/<token>` | DELETE | Delete saved draft |
| `/registration/submit` | POST | Submit complete registration |

## File Upload (No Auth Required)

| Endpoint | Method | Description | Max Size | Allowed Types |
|----------|--------|-------------|----------|---------------|
| `/upload/document` | POST | Upload document (PDF/JPEG/PNG) | 5MB | PDF, JPEG, PNG |
| `/upload/logo` | POST | Upload logo (JPEG/PNG/SVG) | 2MB | JPEG, PNG, SVG |

## Volunteer (Auth: VOLUNTEER, ADMIN, or SUPER_ADMIN)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/volunteer/organizations` | GET | List all organizations for review |
| `/volunteer/organizations/[id]` | GET | Get organization detail |
| `/volunteer/organizations/[id]/approve` | POST | Approve organization |
| `/volunteer/organizations/[id]/reject` | POST | Reject organization |

## Admin Data Management (Auth: ADMIN or SUPER_ADMIN)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/service-categories` | GET | List categories with resource counts |
| `/admin/service-categories` | POST | Create category |
| `/admin/service-categories/[id]` | PATCH | Update category |
| `/admin/service-categories/[id]` | DELETE | Delete (blocked if has resources) |
| `/admin/service-resources` | GET | List resources with category info |
| `/admin/service-resources` | POST | Create resource |
| `/admin/service-resources/[id]` | PATCH | Update resource |
| `/admin/service-resources/[id]` | DELETE | Delete resource |
| `/admin/faiths` | GET | List all faiths |
| `/admin/faiths` | POST | Create faith |
| `/admin/faiths/[id]` | PATCH | Update faith |
| `/admin/faiths/[id]` | DELETE | Delete faith |
| `/admin/social-categories` | GET | List social categories |
| `/admin/social-categories` | POST | Create social category |
| `/admin/social-categories/[id]` | PATCH | Update social category |
| `/admin/social-categories/[id]` | DELETE | Delete social category |
| `/admin/regions` | GET | List states with their cities |
| `/admin/regions` | POST | Add city to a state |
| `/admin/regions/[id]` | PATCH | Update city name |
| `/admin/regions/[id]` | DELETE | Delete city |
| `/admin/languages` | GET | List languages with translation coverage |
| `/admin/languages` | POST | Create language |
| `/admin/languages/[id]` | PATCH | Update language metadata |
| `/admin/languages/[id]` | DELETE | Delete (blocked if translation jobs exist) |

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

For detailed documentation, see `API_ENDPOINTS.md` or `/docs/API.md`
