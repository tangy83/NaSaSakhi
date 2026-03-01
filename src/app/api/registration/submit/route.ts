import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrgCustomId, generateBranchCustomId } from '@/lib/organizationId';

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
      // Entity type (ORGANIZATION or BRANCH)
      entityType = 'ORGANIZATION',
      parentOrganizationId,

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

    if (entityType === 'BRANCH' && !parentOrganizationId) {
      return NextResponse.json(
        { success: false, error: 'parentOrganizationId is required for branch registration' },
        { status: 400 }
      );
    }

    // Execute transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Generate customId and validate parent org (if branch)
      let customId: string;
      let resolvedParentOrgId: string | null = null;

      if (entityType === 'BRANCH') {
        const parent = await tx.organization.findUnique({
          where: { id: parentOrganizationId },
          select: { customId: true, status: true, entityType: true },
        });

        if (!parent || parent.status !== 'APPROVED' || parent.entityType !== 'ORGANIZATION') {
          throw new Error('Parent organization not found, not approved, or is itself a branch');
        }
        if (!parent.customId) {
          throw new Error('Parent organization does not have a custom ID assigned');
        }

        customId = await generateBranchCustomId(tx, parent.customId);
        resolvedParentOrgId = parentOrganizationId!;
      } else {
        customId = await generateOrgCustomId(tx);
      }

      // 2. Create Organization
      const organization = await tx.organization.create({
        data: {
          customId,
          entityType: entityType === 'BRANCH' ? 'BRANCH' : 'ORGANIZATION',
          parentOrganizationId: resolvedParentOrgId,
          name: organizationName,
          registrationType,
          registrationNumber,
          yearEstablished: yearEstablished ? parseInt(yearEstablished, 10) : 2000,
          faithId: faithId || null,
          websiteUrl: website || null,
          status: 'PENDING', // Default status, admin will approve
        },
      });

      // 3. Create Primary Contact Information
      await tx.contactInformation.create({
        data: {
          organizationId: organization.id,
          isPrimary: true,
          name: primaryContact.name,
          email: primaryContact.email,
          phone: primaryContact.phone,
          facebookUrl: facebookUrl || null,
          instagramHandle: instagramUrl || null,
          twitterHandle: twitterUrl || null,
        },
      });

      // 4. Create Secondary Contact Information (if provided)
      if (secondaryContact && secondaryContact.name) {
        await tx.contactInformation.create({
          data: {
            organizationId: organization.id,
            isPrimary: false,
            name: secondaryContact.name,
            email: secondaryContact.email || '',
            phone: secondaryContact.phone || '',
          },
        });
      }

      // 5. Create Branches with addresses and timings
      for (const branch of branches) {
        const organizationBranch = await tx.organizationBranch.create({
          data: {
            organizationId: organization.id,
            addressLine1: branch.address || branch.addressLine1 || '',
            addressLine2: branch.addressLine2 || null,
            cityId: branch.cityId,
            stateId: branch.stateId,
            pinCode: branch.postalCode || branch.pinCode || '',
            latitude: branch.latitude ? parseFloat(branch.latitude) : null,
            longitude: branch.longitude ? parseFloat(branch.longitude) : null,
          },
        });

        // 6. Link categories to branch
        if (categoryIds && categoryIds.length > 0) {
          await tx.branchCategory.createMany({
            data: categoryIds.map((categoryId: string) => ({
              branchId: organizationBranch.id,
              categoryId: categoryId,
            })),
          });
        }

        // 7. Link resources to branch
        if (resourceIds && resourceIds.length > 0) {
          await tx.branchResource.createMany({
            data: resourceIds.map((resourceId: string) => ({
              branchId: organizationBranch.id,
              resourceId: resourceId,
            })),
          });
        }

        // 8. Create branch timings (one for each day of the week)
        if (branch.timings && branch.timings.openTime && branch.timings.closeTime) {
          const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
          await tx.branchTimings.createMany({
            data: daysOfWeek.map((dayOfWeek) => ({
              branchId: organizationBranch.id,
              dayOfWeek: dayOfWeek as any,
              openTime: branch.timings.openTime,
              closeTime: branch.timings.closeTime,
              isClosed: false,
            })),
          });
        }
      }

      // 9. Link languages to organization
      if (languageIds && languageIds.length > 0) {
        await tx.organizationLanguage.createMany({
          data: languageIds.map((languageId: string) => ({
            organizationId: organization.id,
            languageId: languageId,
          })),
        });
      }

      // 10. Create document records
      const documents = [];

      if (logoUrl) {
        documents.push({
          organizationId: organization.id,
          type: 'LOGO' as const,
          filename: logoUrl.split('/').pop() || 'logo',
          fileUrl: logoUrl,
          fileSize: 0, // Size not available from upload response
          mimeType: 'image/png', // Default, actual type not tracked
        });
      }

      if (registrationCertificateUrl) {
        documents.push({
          organizationId: organization.id,
          type: 'REGISTRATION_CERTIFICATE' as const,
          filename: registrationCertificateUrl.split('/').pop() || 'certificate',
          fileUrl: registrationCertificateUrl,
          fileSize: 0,
          mimeType: 'application/pdf',
        });
      }

      if (additionalCertificateUrls && additionalCertificateUrls.length > 0) {
        for (const url of additionalCertificateUrls) {
          if (url) {
            documents.push({
              organizationId: organization.id,
              type: 'ADDITIONAL_CERTIFICATE' as const,
              filename: url.split('/').pop() || 'certificate',
              fileUrl: url,
              fileSize: 0,
              mimeType: 'application/pdf',
            });
          }
        }
      }

      if (documents.length > 0) {
        await tx.document.createMany({ data: documents });
      }

      // 11. Delete draft if token provided
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
        customId: result.customId,
        entityType: result.entityType,
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
