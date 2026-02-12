/**
 * Test Authentication Flow
 * Tests signup and login endpoints
 * 
 * Run: npx tsx scripts/test-auth.ts
 */

import axios from 'axios';
import * as https from 'https';

// Create axios instance with cookie support
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Important: enables cookie handling
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // For development only
});

const BASE_URL = 'http://localhost:3000/api';

async function testSignup() {
  console.log('🧪 Testing User Signup...\n');

  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User',
    role: 'ORGANIZATION',
  };

  try {
    const response = await axiosInstance.post(`${BASE_URL}/auth/signup`, testUser);

    if (response.data.success) {
      console.log('✅ Signup successful!');
      console.log(`   User ID: ${response.data.data.user.id}`);
      console.log(`   Email: ${response.data.data.user.email}`);
      console.log(`   Role: ${response.data.data.user.role}\n`);
      return testUser;
    } else {
      console.log('❌ Signup failed:', response.data.error || response.data);
      return null;
    }
  } catch (error: any) {
    if (error.response) {
      console.log('❌ Signup failed:', error.response.data.error || error.response.data);
    } else {
      console.log('❌ Error:', error.message);
    }
    return null;
  }
}

async function testLogin(email: string, password: string) {
  console.log('🧪 Testing User Login...\n');

  try {
    // NextAuth v4 uses /api/auth/signin endpoint
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('redirect', 'false');
    formData.append('callbackUrl', 'http://localhost:3000');
    formData.append('json', 'true');

    const response = await axiosInstance.post(
      `${BASE_URL}/auth/signin/credentials`,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        maxRedirects: 0,
        validateStatus: (status) => status < 500, // Accept redirects
      }
    );

    console.log('Response status:', response.status);
    
    if (response.status === 200 || response.status === 302) {
      console.log('✅ Login successful!\n');
      return true;
    } else {
      console.log('❌ Login failed - Status:', response.status);
      console.log('Response:', response.data?.error || response.data);
      return false;
    }
  } catch (error: any) {
    if (error.response) {
      console.log('❌ Login failed:', error.response.data?.error || error.response.data);
      console.log('Status:', error.response.status);
    } else {
      console.log('❌ Error:', error.message);
    }
    return false;
  }
}

async function testSession() {
  console.log('🧪 Testing Session...\n');

  try {
    const response = await axiosInstance.get(`${BASE_URL}/auth/session`);

    if (response.data?.user) {
      console.log('✅ Session valid!');
      console.log(`   User: ${response.data.user.email}`);
      console.log(`   Role: ${response.data.user.role}\n`);
      return true;
    } else {
      console.log('⚠️  No active session\n');
      return false;
    }
  } catch (error: any) {
    console.log('❌ Error checking session:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing Authentication Flow\n');
  console.log('='.repeat(60) + '\n');

  // Test 1: Signup
  const testUser = await testSignup();
  if (!testUser) {
    console.log('⚠️  Signup failed, skipping login test\n');
    return;
  }

  // Test 2: Login
  await testLogin(testUser.email, testUser.password);

  // Test 3: Session
  await testSession();

  console.log('='.repeat(60));
  console.log('✅ Authentication tests completed!\n');
}

runTests().catch(console.error);
