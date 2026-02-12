# NASA Sakhi API - Postman Collection

This folder contains Postman collection and environment files for testing the NASA Sakhi API.

## Files

- `NASA_Sakhi_API.postman_collection.json` - Complete API collection
- `NASA_Sakhi_API.postman_environment.json` - Development environment variables

## Import Instructions

### Step 1: Import Collection

1. Open Postman
2. Click **"Import"** button (top left)
3. Select **"File"** tab
4. Choose `NASA_Sakhi_API.postman_collection.json`
5. Click **"Import"**

### Step 2: Import Environment

1. Click **"Import"** button again
2. Select **"File"** tab
3. Choose `NASA_Sakhi_API.postman_environment.json`
4. Click **"Import"**
5. Select the environment from the dropdown (top right)

## Using the Collection

### Environment Variables

The collection uses these variables (set in environment):
- `base_url` - API base URL (default: `http://localhost:3000/api`)
- `draft_token` - Draft token (auto-populated after saving draft)
- `category_id` - Category ID (set after fetching categories)
- `resource_id` - Resource ID (set after fetching resources)
- `city_id` - City ID (set after fetching cities)
- `state_id` - State ID (set after fetching states)
- `language_id` - Language ID (set after fetching languages)

### Testing Flow

1. **Start with Health Check**
   - Run "Health Check" to verify API is running
   - Run "Database Test" to verify database connection

2. **Get Reference Data**
   - Run "Get Categories" - copy a category ID to `category_id` variable
   - Run "Get Resources" - copy a resource ID to `resource_id` variable
   - Run "Get States" - copy a state ID to `state_id` variable
   - Run "Get Cities" - copy a city ID to `city_id` variable
   - Run "Get Languages" - copy a language ID to `language_id` variable

3. **Test Registration**
   - Run "Save Draft" - copy the token to `draft_token` variable
   - Run "Load Draft" - verify draft loads correctly
   - Run "Submit Registration" - use the IDs from reference data

4. **Test File Uploads**
   - Run "Upload Document" - select a PDF/JPEG/PNG file
   - Run "Upload Logo" - select a JPEG/PNG/SVG file

5. **Test Authentication**
   - Run "Signup" - create a test user
   - Run "Login" - login with credentials
   - Run "Get Session" - verify session
   - Run "Sign Out" - logout

## Collection Structure

### Health & Testing
- Health Check
- Database Test

### Authentication
- Signup
- Login
- Get Session
- Sign Out

### Reference Data
- Get Categories
- Get Resources
- Get Resources by Category
- Get States
- Get Cities
- Search Cities
- Get Languages

### Registration
- Save Draft
- Load Draft
- Delete Draft
- Submit Registration

### File Upload
- Upload Document
- Upload Logo

## Tips

1. **Set Variables**: After running requests, copy response values to environment variables for use in other requests.

2. **File Uploads**: For file upload requests, click on the "file" field and select a file from your computer.

3. **Error Handling**: Check the response status and error messages if requests fail.

4. **Testing Order**: Follow the testing flow above for best results.

## Troubleshooting

### "Could not get response"
- Verify the server is running: `npm run dev` in backend directory
- Check `base_url` is correct: `http://localhost:3000/api`

### "404 Not Found"
- Verify the endpoint path is correct
- Check if the server is running on the correct port (3000)

### "500 Internal Server Error"
- Check server logs for detailed error messages
- Verify database connection is working

### File Upload Fails
- Ensure file type matches allowed types (PDF/JPEG/PNG for documents, JPEG/PNG/SVG for logos)
- Check file size (5MB max for documents, 2MB max for logos)

## Support

For issues or questions:
- Check API documentation: `/docs/API.md`
- Review error messages in response
- Contact backend team

---

**Last Updated:** February 11, 2026
