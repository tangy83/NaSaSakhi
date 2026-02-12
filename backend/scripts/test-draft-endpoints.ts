// @ts-nocheck
// Test script for Draft Save/Load/Delete Endpoints
// Run: npx tsx scripts/test-draft-endpoints.ts
// Make sure dev server is running: npm run dev

import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/registration/draft';

let savedToken: string | null = null;

async function testSaveDraft() {
  try {
    console.log('\n🧪 Testing Save Draft (POST)...');
    console.log(`   URL: ${BASE_URL}`);
    
    const payload = {
      email: 'test@example.com',
      draftData: {
        organizationName: 'Test NGO',
        step: 2,
        registrationType: 'NGO',
      },
    };

    const response = await axios.post(BASE_URL, payload);
    
    if (response.data.success) {
      savedToken = response.data.data.token;
      console.log(`   ✅ Success! Token: ${savedToken}`);
      console.log(`   Expires at: ${response.data.data.expiresAt}`);
      return true;
    } else {
      console.log(`   ❌ Failed:`, response.data.error);
      return false;
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
    return false;
  }
}

async function testLoadDraft(token: string) {
  try {
    console.log(`\n🧪 Testing Load Draft (GET)...`);
    console.log(`   URL: ${BASE_URL}/${token}`);
    
    const response = await axios.get(`${BASE_URL}/${token}`);
    
    if (response.data.success) {
      console.log(`   ✅ Success!`);
      console.log(`   Draft Data:`, JSON.stringify(response.data.data, null, 2));
      return true;
    } else {
      console.log(`   ❌ Failed:`, response.data.error);
      return false;
    }
  } catch (error: any) {
    if (error.response) {
      console.log(`   ❌ Status: ${error.response.status}`);
      console.log(`   ❌ Error:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`   ❌ Error:`, error.message);
    }
    return false;
  }
}

async function testDeleteDraft(token: string) {
  try {
    console.log(`\n🧪 Testing Delete Draft (DELETE)...`);
    console.log(`   URL: ${BASE_URL}/${token}`);
    
    const response = await axios.delete(`${BASE_URL}/${token}`);
    
    if (response.data.success) {
      console.log(`   ✅ Success! ${response.data.message}`);
      return true;
    } else {
      console.log(`   ❌ Failed:`, response.data.error);
      return false;
    }
  } catch (error: any) {
    if (error.response) {
      console.log(`   ❌ Status: ${error.response.status}`);
      console.log(`   ❌ Error:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`   ❌ Error:`, error.message);
    }
    return false;
  }
}

async function testLoadNonExistentDraft() {
  try {
    console.log(`\n🧪 Testing Load Non-Existent Draft (GET)...`);
    console.log(`   URL: ${BASE_URL}/invalid-token-12345`);
    
    const response = await axios.get(`${BASE_URL}/invalid-token-12345`);
    
    console.log(`   ❌ Should have failed but got:`, response.data);
    return false;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.log(`   ✅ Correctly returned 404:`, error.response.data.error);
      return true;
    } else {
      console.log(`   ❌ Unexpected error:`, error.message);
      return false;
    }
  }
}

async function runTests() {
  console.log('🚀 Testing Draft Save/Load/Delete Endpoints\n');
  console.log('='.repeat(50));

  // Test 1: Save draft
  const saveSuccess = await testSaveDraft();
  
  if (!saveSuccess || !savedToken) {
    console.log('\n❌ Cannot continue tests - draft save failed');
    return;
  }

  // Test 2: Load draft
  await testLoadDraft(savedToken);

  // Test 3: Load non-existent draft
  await testLoadNonExistentDraft();

  // Test 4: Delete draft
  await testDeleteDraft(savedToken);

  // Test 5: Try to load deleted draft (should fail)
  console.log(`\n🧪 Testing Load Deleted Draft (should fail)...`);
  await testLoadDraft(savedToken);

  console.log('\n' + '='.repeat(50));
  console.log('✅ All tests completed!\n');
}

runTests().catch(console.error);
