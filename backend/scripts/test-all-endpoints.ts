/**
 * Test All API Endpoints
 * Comprehensive test script for all API endpoints
 * 
 * Run: npx tsx scripts/test-all-endpoints.ts
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

interface TestResult {
  name: string;
  endpoint: string;
  method: string;
  status: 'pass' | 'fail' | 'skip';
  message?: string;
  responseTime?: number;
}

const results: TestResult[] = [];

async function testEndpoint(
  name: string,
  method: 'GET' | 'POST' | 'DELETE',
  endpoint: string,
  data?: any,
  headers?: Record<string, string>
): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const config: any = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: headers || {},
    };

    if (data) {
      if (headers?.['Content-Type'] === 'application/x-www-form-urlencoded') {
        const formData = new URLSearchParams();
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });
        config.data = formData.toString();
      } else {
        config.data = data;
      }
    }

    const response = await axios(config);
    const responseTime = Date.now() - startTime;

    if (response.status >= 200 && response.status < 300) {
      return {
        name,
        endpoint,
        method,
        status: 'pass',
        message: `Status: ${response.status}`,
        responseTime,
      };
    } else {
      return {
        name,
        endpoint,
        method,
        status: 'fail',
        message: `Unexpected status: ${response.status}`,
        responseTime,
      };
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    if (error.response) {
      return {
        name,
        endpoint,
        method,
        status: 'fail',
        message: `Error ${error.response.status}: ${error.response.data?.error || error.response.data?.message || 'Unknown error'}`,
        responseTime,
      };
    } else {
      return {
        name,
        endpoint,
        method,
        status: 'fail',
        message: `Network error: ${error.message}`,
        responseTime,
      };
    }
  }
}

async function runAllTests() {
  console.log('🚀 Testing All API Endpoints\n');
  console.log('='.repeat(80) + '\n');

  // Health & Testing
  console.log('📋 Health & Testing Endpoints\n');
  results.push(await testEndpoint('Health Check', 'GET', '/health'));
  results.push(await testEndpoint('Database Test', 'GET', '/db-test'));

  // Reference Data
  console.log('\n📋 Reference Data Endpoints\n');
  results.push(await testEndpoint('Get Categories', 'GET', '/reference/categories'));
  results.push(await testEndpoint('Get Resources', 'GET', '/reference/resources'));
  results.push(await testEndpoint('Get States', 'GET', '/reference/states'));
  results.push(await testEndpoint('Get Cities', 'GET', '/reference/cities'));
  results.push(await testEndpoint('Search Cities', 'GET', '/reference/cities?search=Bangalore'));
  results.push(await testEndpoint('Get Languages', 'GET', '/reference/languages'));

  // Registration Draft
  console.log('\n📋 Registration Draft Endpoints\n');
  const draftData = {
    email: `test${Date.now()}@example.com`,
    draftData: {
      organizationName: 'Test Organization',
      registrationType: 'NGO',
    },
  };
  
  const saveDraftResult = await testEndpoint(
    'Save Draft',
    'POST',
    '/registration/draft',
    draftData,
    { 'Content-Type': 'application/json' }
  );
  results.push(saveDraftResult);

  // Extract draft token if save was successful
  let draftToken = '';
  if (saveDraftResult.status === 'pass') {
    try {
      const draftResponse = await axios.post(`${BASE_URL}/registration/draft`, draftData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (draftResponse.data.success) {
        draftToken = draftResponse.data.data.token;
        results.push(await testEndpoint('Load Draft', 'GET', `/registration/draft/${draftToken}`));
        results.push(await testEndpoint('Delete Draft', 'DELETE', `/registration/draft/${draftToken}`));
      }
    } catch (error) {
      results.push({
        name: 'Load Draft',
        endpoint: '/registration/draft/[token]',
        method: 'GET',
        status: 'skip',
        message: 'Skipped - draft save failed',
      });
    }
  }

  // Authentication
  console.log('\n📋 Authentication Endpoints\n');
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User',
  };
  
  results.push(await testEndpoint(
    'Signup',
    'POST',
    '/auth/signup',
    testUser,
    { 'Content-Type': 'application/json' }
  ));

  // File Upload (skip - requires actual files)
  console.log('\n📋 File Upload Endpoints\n');
  results.push({
    name: 'Upload Document',
    endpoint: '/upload/document',
    method: 'POST',
    status: 'skip',
    message: 'Requires file upload - test manually',
  });
  results.push({
    name: 'Upload Logo',
    endpoint: '/upload/logo',
    method: 'POST',
    status: 'skip',
    message: 'Requires file upload - test manually',
  });

  // Print Results
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(80) + '\n');

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}\n`);

  console.log('='.repeat(80));
  console.log('📋 DETAILED RESULTS');
  console.log('='.repeat(80) + '\n');

  results.forEach((result, index) => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⏭️';
    console.log(`${index + 1}. ${icon} ${result.name}`);
    console.log(`   ${result.method} ${result.endpoint}`);
    if (result.message) {
      console.log(`   ${result.message}`);
    }
    if (result.responseTime) {
      console.log(`   Response Time: ${result.responseTime}ms`);
    }
    console.log('');
  });

  console.log('='.repeat(80));
  
  if (failed === 0) {
    console.log('✅ All tests passed!\n');
  } else {
    console.log(`⚠️  ${failed} test(s) failed. Please review the errors above.\n`);
  }
}

runAllTests().catch(console.error);
