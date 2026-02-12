// @ts-nocheck
// Test script for Reference Data Endpoints
// Run: npx tsx scripts/test-reference-endpoints.ts
// Make sure dev server is running: npm run dev

import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/reference';

async function testEndpoint(name: string, url: string) {
  try {
    console.log(`\n🧪 Testing ${name}...`);
    console.log(`   URL: ${url}`);
    
    const response = await axios.get(url);
    
    if (response.data.success) {
      const count = Array.isArray(response.data.data) ? response.data.data.length : 'N/A';
      console.log(`   ✅ Success! Count: ${count}`);
      if (count <= 5 && Array.isArray(response.data.data)) {
        console.log(`   Sample:`, response.data.data.slice(0, 2).map((item: any) => item.name || item.id));
      }
    } else {
      console.log(`   ❌ Failed:`, response.data.error);
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
  }
}

async function runTests() {
  console.log('🚀 Testing Reference Data Endpoints\n');
  console.log('='.repeat(50));

  // Test all endpoints
  await testEndpoint('Categories', `${BASE_URL}/categories`);
  await testEndpoint('Resources (all)', `${BASE_URL}/resources`);
  await testEndpoint('Languages', `${BASE_URL}/languages`);
  await testEndpoint('States', `${BASE_URL}/states`);
  await testEndpoint('Cities (all)', `${BASE_URL}/cities`);
  await testEndpoint('Cities (search: Bang)', `${BASE_URL}/cities?search=Bang`);

  console.log('\n' + '='.repeat(50));
  console.log('✅ All tests completed!\n');
}

runTests().catch(console.error);
