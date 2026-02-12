// @ts-nocheck
// Test script for Registration Submission Endpoint
// Run: npx tsx scripts/test-registration-submit.ts
// Make sure dev server is running: npm run dev

import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// First, we need to get real IDs from the database
async function getReferenceData() {
  try {
    console.log('📋 Fetching reference data...\n');
    
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

async function testRegistrationSubmit() {
  try {
    console.log('🚀 Testing Registration Submission Endpoint\n');
    console.log('='.repeat(50));

    // Get reference data
    const refData = await getReferenceData();
    if (!refData || !refData.categoryId || !refData.resourceId || !refData.languageId || !refData.stateId || !refData.cityId) {
      console.log('❌ Could not fetch required reference data. Make sure the database is seeded.');
      return;
    }

    console.log('✅ Reference data fetched successfully\n');

    // Create complete registration payload
    const registrationPayload = {
      organizationName: 'Test NGO Organization',
      registrationType: 'NGO',
      registrationNumber: 'NGO123456',
      yearEstablished: 2020,
      // faithId: undefined, // Optional - don't include if not needed
      websiteUrl: 'https://testngo.example.com',

      primaryContact: {
        name: 'John Doe',
        phone: '9876543210',
        email: 'john@testngo.example.com',
      },

      secondaryContact: {
        name: 'Jane Smith',
        phone: '9876543211',
        email: 'jane@testngo.example.com',
      },

      facebookUrl: 'https://facebook.com/testngo',
      instagramHandle: '@testngo',
      twitterHandle: '@testngo',

      categoryIds: [refData.categoryId],
      resourceIds: [refData.resourceId],

      branches: [
        {
          addressLine1: '123 Main Street, Koramangala',
          addressLine2: 'Near Metro Station',
          cityId: refData.cityId,
          stateId: refData.stateId,
          pinCode: '560095',
          timings: [
            {
              dayOfWeek: 'MONDAY',
              openTime: '09:00',
              closeTime: '18:00',
              isClosed: false,
            },
            {
              dayOfWeek: 'TUESDAY',
              openTime: '09:00',
              closeTime: '18:00',
              isClosed: false,
            },
            {
              dayOfWeek: 'WEDNESDAY',
              isClosed: true,
            },
          ],
        },
      ],

      languageIds: [refData.languageId],

      documents: {
        registrationCertificateUrl: '/uploads/documents/test-certificate.pdf',
        logoUrl: '/uploads/logos/test-logo.jpg',
        additionalCertificateUrls: ['/uploads/documents/test-additional.pdf'],
      },
    };

    console.log('🧪 Testing Registration Submit (POST)...');
    console.log(`   URL: ${BASE_URL}/registration/submit`);
    console.log(`   Organization: ${registrationPayload.organizationName}\n`);

    const response = await axios.post(`${BASE_URL}/registration/submit`, registrationPayload);

    if (response.data.success) {
      console.log('   ✅ Success!');
      console.log(`   Organization ID: ${response.data.data.organizationId}`);
      console.log(`   Status: ${response.data.data.status}`);
      console.log(`   Message: ${response.data.data.message}\n`);
      return response.data.data.organizationId;
    } else {
      console.log(`   ❌ Failed:`, response.data.error);
      if (response.data.errors) {
        console.log(`   Validation Errors:`, JSON.stringify(response.data.errors, null, 2));
      }
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

async function testValidationErrors() {
  try {
    console.log('🧪 Testing Validation Errors...');
    console.log(`   URL: ${BASE_URL}/registration/submit`);
    console.log(`   Sending invalid payload (missing required fields)\n`);

    const invalidPayload = {
      organizationName: 'AB', // Too short
      registrationType: 'INVALID', // Invalid enum
      // Missing other required fields
    };

    const response = await axios.post(`${BASE_URL}/registration/submit`, invalidPayload);
    
    console.log(`   ❌ Should have failed but got:`, response.data);
    return false;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      console.log(`   ✅ Correctly returned 400 Bad Request`);
      console.log(`   Validation Errors:`, JSON.stringify(error.response.data.errors?.slice(0, 3), null, 2));
      console.log(`   ... (showing first 3 errors)\n`);
      return true;
    } else {
      console.log(`   ❌ Unexpected error:`, error.message);
      return false;
    }
  }
}

async function runTests() {
  console.log('🚀 Testing Registration Submission Endpoint\n');
  console.log('='.repeat(50));

  // Test 1: Validation errors
  await testValidationErrors();

  // Test 2: Successful submission
  const orgId = await testRegistrationSubmit();

  if (orgId) {
    console.log('='.repeat(50));
    console.log('✅ Registration submission test completed successfully!');
    console.log(`\n📝 Created Organization ID: ${orgId}`);
    console.log('   You can verify this in Prisma Studio: npm run prisma:studio\n');
  } else {
    console.log('='.repeat(50));
    console.log('⚠️  Registration submission test had issues');
    console.log('   Check the errors above for details\n');
  }
}

runTests().catch(console.error);
