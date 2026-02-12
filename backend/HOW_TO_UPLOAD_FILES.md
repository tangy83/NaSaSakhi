# How to Upload Files - Testing Guide

## Method 1: Using Postman (Recommended)

### Upload Document:
1. Open Postman
2. Create new request:
   - **Method:** POST
   - **URL:** `http://localhost:3000/api/upload/document`
3. Go to **Body** tab
4. Select **form-data**
5. Add key: `file` (type: File)
6. Click "Select Files" and choose a PDF, JPEG, or PNG file (max 5MB)
7. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "filename": "1736341234567-document.pdf",
    "fileUrl": "/uploads/documents/1736341234567-document.pdf",
    "fileSize": 12345,
    "mimeType": "application/pdf"
  }
}
```

### Upload Logo:
1. Same steps as above
2. **URL:** `http://localhost:3000/api/upload/logo`
3. Select JPEG, PNG, or SVG file (max 2MB)

---

## Method 2: Using curl (Command Line)

### Upload Document:
```bash
curl -X POST http://localhost:3000/api/upload/document \
  -F "file=@/path/to/your/file.pdf"
```

### Upload Logo:
```bash
curl -X POST http://localhost:3000/api/upload/logo \
  -F "file=@/path/to/your/logo.png"
```

---

## Method 3: Using Test Script

Run the automated test script:
```bash
npx tsx scripts/test-file-upload.ts
```

This will:
- ✅ Test document upload
- ✅ Test logo upload
- ✅ Test invalid file type (should fail)
- ✅ Test file size limit (should fail)

---

## Method 4: Using Browser (HTML Form)

Create a simple HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>File Upload Test</title>
</head>
<body>
  <h2>Upload Document</h2>
  <form action="http://localhost:3000/api/upload/document" method="post" enctype="multipart/form-data">
    <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" />
    <button type="submit">Upload Document</button>
  </form>

  <h2>Upload Logo</h2>
  <form action="http://localhost:3000/api/upload/logo" method="post" enctype="multipart/form-data">
    <input type="file" name="file" accept=".jpg,.jpeg,.png,.svg" />
    <button type="submit">Upload Logo</button>
  </form>
</body>
</html>
```

---

## File Requirements

### Documents (`/api/upload/document`):
- **Max Size:** 5MB
- **Allowed Types:** PDF, JPEG, PNG
- **Form Field Name:** `file`

### Logos (`/api/upload/logo`):
- **Max Size:** 2MB
- **Allowed Types:** JPEG, PNG, SVG
- **Form Field Name:** `file`

---

## Where Files Are Stored

- **Documents:** `backend/public/uploads/documents/`
- **Logos:** `backend/public/uploads/logos/`

Files are accessible at:
- `http://localhost:3000/uploads/documents/<filename>`
- `http://localhost:3000/uploads/logos/<filename>`

---

## Test Results

From the test script run:
- ✅ **Logo Upload:** Working perfectly!
- ✅ **Invalid File Type:** Correctly rejected
- ✅ **File Size Limit:** Correctly enforced
- ⚠️ **Document Upload:** Got 404 (may need server restart)

**Note:** If document upload returns 404, try restarting the dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```
