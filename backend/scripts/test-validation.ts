// Test script for Server-Side Validation Functions
// Run: npx tsx scripts/test-validation.ts

import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function getReferenceData() {
  try {
    const [categories, resources, languages, states, cities] = await Promise.all([
      axios.get(`${BASE_URL}/reference/categories`),
      axios.get(`${BASE_URL}/reference/resources`),
      axios.get(`${BASE_URL}/reference/languages`),
      axios.get(`${BASE_URL}/reference/states`),
      axios.get(`${BASE_URL}/reference/cities?search=Bangalore`),
    ]);

    return {
      categoryId: categories.data.data[0]?.id,
      resourceId: resources.data.data[0]?.id,
      languageId: languages.data.data[0]?.id,
      stateId: states.data.data.find((s: any) => s.code === 'KA')?.id,
      cityId: cities.data.data[0]?.id,
    };
  } catch (error) {
    console.error('Error fetching reference data:', error);
    return null;
  }
}

async function testValidation(name: string, payload: any, shouldFail: boolean = false) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    if (shouldFail) {
      console.log('   (This should fail validation)\n');
    }

    const response = await axios.post(`${BASE_URL}/registration/submit`, payload);

    if (shouldFail) {
      console.log(`   ❌ Should have failed but got success:`, response.data);
      return false;
    } else {
      if (response.data.success) {
        console.log(`   ✅ Success! Organization ID: ${response.data.data.organizationId}`);
        return true;
      } else {
        console.log(`   ❌ Failed:`, response.data.error || response.data);
        return false;
      }
    }
  } catch (error: any) {
    if (error.response) {
      if (shouldFail) {
        console.log(`   ✅ Correctly failed with status ${error.response.status}`);
        if (error.response.data.field) {
          console.log(`   Field: ${error.response.data.field}`);
        }
        console.log(`   Error: ${error.response.data.error}\n`);
        return true;
      } else {
        console.log(`   ❌ Unexpected error (${error.response.status}):`, error.response.data.error || error.response.data);
        return false;
      }
    } else {
      console.log(`   ❌ Error:`, error.message);
      return false;
    }
  }
}

async function runTests() {
  console.log('🚀 Testing Server-Side Validation Functions\n');
  console.log('='.repeat(50));

  const refData = await getReferenceData();
  if (!refData || !refData.categoryId || !refData.resourceId || !refData.languageId || !refData.stateId || !refData.cityId) {
    console.log('❌ Could not fetch required reference data.');
    return;
  }

  // Base valid payload
  const basePayload = {
    organizationName: 'Test Validation NGO',
    registrationType: 'NGO',
    registrationNumber: 'NGO123456',
    yearEstablished: 2020,
    websiteUrl: 'https://test.example.com',
    primaryContact: {
      name: 'John Doe',
      phone: '9876543210',
      email: 'john@example.com',
    },
    categoryIds: [refData.categoryId],
    resourceIds: [refData.resourceId],
    branches: [{
      addressLine1: '123 Main Street, Koramangala',
      cityId: refData.cityId,
      stateId: refData.stateId,
      pinCode: '560095',
    }],
    languageIds: [refData.languageId],
    documents: {
      registrationCertificateUrl: '/uploads/documents/test.pdf',
    },
  };

  // Test 1: Invalid organization name (too short)
  await testValidation(
    'Invalid Organization Name (too short)',
    { ...basePayload, organizationName: 'AB' },
    true
  );

  // Test 2: Invalid email format
  await testValidation(
    'Invalid Email Format',
    { ...basePayload, primaryContact: { ...basePayload.primaryContact, email: 'invalid-email' } },
    true
  );

  // Test 3: Invalid phone number (wrong format)
  await testValidation(
    'Invalid Phone Number',
    { ...basePayload, primaryContact: { ...basePayload.primaryContact, phone: '1234567890' } },
    true
  );

  // Test 4: Invalid PIN code (not 6 digits)
  await testValidation(
    'Invalid PIN Code',
    { ...basePayload, branches: [{ ...basePayload.branches[0], pinCode: '12345' }] },
    true
  );

  // Test 5: Invalid year (too old)
  await testValidation(
    'Invalid Year (too old)',
    { ...basePayload, yearEstablished: 1700 },
    true
  );

  // Test 6: Valid payload (should succeed)
  await testValidation(
    'Valid Registration',
    basePayload,
    false
  );

  console.log('='.repeat(50));
  console.log('✅ Validation tests completed!\n');
}

runTests().catch(console.error);
