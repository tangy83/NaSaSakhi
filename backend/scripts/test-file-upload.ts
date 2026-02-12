// @ts-nocheck
// Test script for File Upload Endpoints
// Run: npx tsx scripts/test-file-upload.ts
// Make sure dev server is running: npm run dev

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000/api';

// Create a test file for upload
function createTestFile(filename: string, content: string): string {
  const testDir = path.join(process.cwd(), 'test-files');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  const filePath = path.join(testDir, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

async function testDocumentUpload() {
  try {
    console.log('\n🧪 Testing Document Upload (POST)...');
    console.log(`   URL: ${BASE_URL}/upload/document\n`);

    // Create a test PDF file (minimal PDF content)
    const testPdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\nxref\n0 1\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF';
    const testFilePath = createTestFile('test-document.pdf', testPdfContent);

    // Create FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath), {
      filename: 'test-document.pdf',
      contentType: 'application/pdf',
    });

    console.log(`   Uploading: test-document.pdf`);
    console.log(`   Size: ${fs.statSync(testFilePath).size} bytes\n`);

    const response = await axios.post(`${BASE_URL}/upload/document`, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (response.data.success) {
      console.log('   ✅ Success!');
      console.log(`   Filename: ${response.data.data.filename}`);
      console.log(`   File URL: ${response.data.data.fileUrl}`);
      console.log(`   File Size: ${response.data.data.fileSize} bytes`);
      console.log(`   MIME Type: ${response.data.data.mimeType}\n`);
      
      // Clean up test file
      fs.unlinkSync(testFilePath);
      
      return response.data.data.fileUrl;
    } else {
      console.log(`   ❌ Failed:`, response.data.error);
      return null;
    }
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`   ❌ Connection refused - Is dev server running? (npm run dev)`);
    } else if (error.response) {
      console.log(`   ❌ Status: ${error.response.status}`);
      console.log(`   ❌ Error:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`   ❌ Error:`, error.message);
    }
    return null;
  }
}

async function testLogoUpload() {
  try {
    console.log('🧪 Testing Logo Upload (POST)...');
    console.log(`   URL: ${BASE_URL}/upload/logo\n`);

    // Create a minimal test image (1x1 PNG)
    const testPngContent = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    const testFilePath = createTestFile('test-logo.png', testPngContent);

    // Create FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath), {
      filename: 'test-logo.png',
      contentType: 'image/png',
    });

    console.log(`   Uploading: test-logo.png`);
    console.log(`   Size: ${fs.statSync(testFilePath).size} bytes\n`);

    const response = await axios.post(`${BASE_URL}/upload/logo`, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (response.data.success) {
      console.log('   ✅ Success!');
      console.log(`   Filename: ${response.data.data.filename}`);
      console.log(`   File URL: ${response.data.data.fileUrl}`);
      console.log(`   File Size: ${response.data.data.fileSize} bytes`);
      console.log(`   MIME Type: ${response.data.data.mimeType}\n`);
      
      // Clean up test file
      fs.unlinkSync(testFilePath);
      
      return response.data.data.fileUrl;
    } else {
      console.log(`   ❌ Failed:`, response.data.error);
      return null;
    }
  } catch (error: any) {
    if (error.response) {
      console.log(`   ❌ Status: ${error.response.status}`);
      console.log(`   ❌ Error:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`   ❌ Error:`, error.message);
    }
    return null;
  }
}

async function testInvalidFileType() {
  try {
    console.log('🧪 Testing Invalid File Type (should fail)...');
    console.log(`   URL: ${BASE_URL}/upload/document\n`);

    // Create a test text file (not allowed)
    const testFilePath = createTestFile('test.txt', 'This is a text file');

    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath), {
      filename: 'test.txt',
      contentType: 'text/plain',
    });

    const response = await axios.post(`${BASE_URL}/upload/document`, formData, {
      headers: formData.getHeaders(),
    });

    console.log(`   ❌ Should have failed but got:`, response.data);
    fs.unlinkSync(testFilePath);
    return false;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      console.log(`   ✅ Correctly returned 400 Bad Request`);
      console.log(`   Error: ${error.response.data.error}\n`);
      return true;
    } else {
      console.log(`   ❌ Unexpected error:`, error.message);
      return false;
    }
  }
}

async function testFileSizeLimit() {
  try {
    console.log('🧪 Testing File Size Limit (should fail for large file)...');
    console.log(`   URL: ${BASE_URL}/upload/document\n`);

    // Create a file larger than 5MB
    const largeContent = Buffer.alloc(6 * 1024 * 1024, 'A'); // 6MB
    const testFilePath = createTestFile('large-file.pdf', largeContent);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath), {
      filename: 'large-file.pdf',
      contentType: 'application/pdf',
    });

    const response = await axios.post(`${BASE_URL}/upload/document`, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log(`   ❌ Should have failed but got:`, response.data);
    fs.unlinkSync(testFilePath);
    return false;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      console.log(`   ✅ Correctly returned 400 Bad Request`);
      console.log(`   Error: ${error.response.data.error}\n`);
      return true;
    } else {
      console.log(`   ❌ Unexpected error:`, error.message);
      return false;
    }
  }
}

async function runTests() {
  console.log('🚀 Testing File Upload Endpoints\n');
  console.log('='.repeat(50));

  // Test 1: Document upload
  const docUrl = await testDocumentUpload();

  // Test 2: Logo upload
  const logoUrl = await testLogoUpload();

  // Test 3: Invalid file type
  await testInvalidFileType();

  // Test 4: File size limit
  await testFileSizeLimit();

  console.log('='.repeat(50));
  
  if (docUrl && logoUrl) {
    console.log('✅ All file upload tests completed successfully!');
    console.log(`\n📝 Uploaded Files:`);
    console.log(`   Document: ${docUrl}`);
    console.log(`   Logo: ${logoUrl}`);
    console.log(`\n   You can access them at:`);
    console.log(`   http://localhost:3000${docUrl}`);
    console.log(`   http://localhost:3000${logoUrl}\n`);
  } else {
    console.log('⚠️  Some file upload tests had issues');
    console.log('   Check the errors above for details\n');
  }
}

runTests().catch(console.error);
