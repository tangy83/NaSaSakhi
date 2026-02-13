import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/registration/submit
 * Submit a complete organization registration
 * This is a complex transaction that creates:
 * - Organization
 * - ContactInformation
 * - OrganizationBranches (with addresses, timings)
 * - BranchCategory and BranchResource links
 * - OrganizationLanguage links
 * - Document records
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // Step 1: Organization Details
      organizationName,
      registrationType,
      registrationNumber,
      yearEstablished,
      faithId,
      socialCategoryIds,

      // Step 2: Contact Information
      primaryContact,
      secondaryContact,
      website,
      facebookUrl,
      instagramUrl,
      twitterUrl,

      // Step 3: Services
      categoryIds,
      resourceIds,

      // Step 4: Branches
      branches,

      // Step 5: Languages
      languageIds,

      // Step 6: Documents
      registrationCertificateUrl,
      logoUrl,
      additionalCertificateUrls,

      // Optional: Draft token to delete after submission
      draftToken,
    } = body;

    // Basic validation
    if (!organizationName || !registrationType || !registrationNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: organizationName, registrationType, registrationNumber',
        },
        { status: 400 }
      );
    }

    if (!primaryContact || !primaryContact.name || !primaryContact.email || !primaryContact.phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Primary contact information is required',
        },
        { status: 400 }
      );
    }

    if (!branches || branches.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one branch location is required',
        },
        { status: 400 }
      );
    }

    if (!categoryIds || categoryIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one service category is required',
        },
        { status: 400 }
      );
    }

    if (!languageIds || languageIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one language is required',
        },
        { status: 400 }
      );
    }

    // Execute transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Organization
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          registrationType,
          registrationNumber,
          yearEstablished: yearEstablished ? parseInt(yearEstablished, 10) : null,
          faithId: faithId ? parseInt(faithId, 10) : null,
          website: website || null,
          facebookUrl: facebookUrl || null,
          instagramUrl: instagramUrl || null,
          twitterUrl: twitterUrl || null,
          logoUrl: logoUrl || null,
          status: 'PENDING', // Default status, admin will approve
        },
      });

      // 2. Link social categories (if provided)
      if (socialCategoryIds && socialCategoryIds.length > 0) {
        await tx.organizationSocialCategory.createMany({
          data: socialCategoryIds.map((categoryId: string) => ({
            organizationId: organization.id,
            socialCategoryId: parseInt(categoryId, 10),
          })),
        });
      }

      // 3. Create Contact Information
      const contactData: any = {
        organizationId: organization.id,
        primaryContactName: primaryContact.name,
        primaryContactEmail: primaryContact.email,
        primaryContactPhone: primaryContact.phone,
      };

      if (secondaryContact && secondaryContact.name) {
        contactData.secondaryContactName = secondaryContact.name;
        contactData.secondaryContactEmail = secondaryContact.email || null;
        contactData.secondaryContactPhone = secondaryContact.phone || null;
      }

      await tx.contactInformation.create({ data: contactData });

      // 4. Create Branches with addresses and timings
      for (const branch of branches) {
        const organizationBranch = await tx.organizationBranch.create({
          data: {
            organizationId: organization.id,
            address: branch.address,
            cityId: parseInt(branch.cityId, 10),
            stateId: parseInt(branch.stateId, 10),
            postalCode: branch.postalCode,
            latitude: branch.latitude ? parseFloat(branch.latitude) : null,
            longitude: branch.longitude ? parseFloat(branch.longitude) : null,
          },
        });

        // 5. Link categories to branch
        if (categoryIds && categoryIds.length > 0) {
          await tx.branchCategory.createMany({
            data: categoryIds.map((categoryId: string) => ({
              branchId: organizationBranch.id,
              categoryId: parseInt(categoryId, 10),
            })),
          });
        }

        // 6. Link resources to branch
        if (resourceIds && resourceIds.length > 0) {
          await tx.branchResource.createMany({
            data: resourceIds.map((resourceId: string) => ({
              branchId: organizationBranch.id,
              resourceId: parseInt(resourceId, 10),
            })),
          });
        }

        // 7. Create branch timings
        if (branch.timings && branch.timings.openTime && branch.timings.closeTime) {
          await tx.branchTimings.create({
            data: {
              branchId: organizationBranch.id,
              openTime: branch.timings.openTime,
              closeTime: branch.timings.closeTime,
              allDays: branch.timings.allDays !== false, // Default to true
            },
          });
        }
      }

      // 8. Link languages to organization
      if (languageIds && languageIds.length > 0) {
        await tx.organizationLanguage.createMany({
          data: languageIds.map((languageId: string) => ({
            organizationId: organization.id,
            languageId: parseInt(languageId, 10),
          })),
        });
      }

      // 9. Create document records
      const documents = [];

      if (registrationCertificateUrl) {
        documents.push({
          organizationId: organization.id,
          type: 'REGISTRATION_CERTIFICATE' as const,
          url: registrationCertificateUrl,
        });
      }

      if (additionalCertificateUrls && additionalCertificateUrls.length > 0) {
        for (const url of additionalCertificateUrls) {
          if (url) {
            documents.push({
              organizationId: organization.id,
              type: 'ADDITIONAL_CERTIFICATE' as const,
              url,
            });
          }
        }
      }

      if (documents.length > 0) {
        await tx.document.createMany({ data: documents });
      }

      // 10. Delete draft if token provided
      if (draftToken) {
        try {
          await tx.registrationDraft.delete({
            where: { token: draftToken },
          });
        } catch (error) {
          // Ignore error if draft doesn't exist
          console.log('Draft not found or already deleted:', draftToken);
        }
      }

      return organization;
    });

    return NextResponse.json({
      success: true,
      data: {
        organizationId: result.id,
        organizationName: result.name,
        status: result.status,
      },
      message: 'Registration submitted successfully! Your application is pending admin approval.',
    });
  } catch (error) {
    console.error('Error submitting registration:', error);

    // Check if it's a known Prisma error
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          {
            success: false,
            error: 'An organization with this registration number already exists',
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit registration. Please try again.',
      },
      { status: 500 }
    );
  }
}
