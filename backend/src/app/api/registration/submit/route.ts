// Registration Submission Endpoint
// Test: POST http://localhost:3000/api/registration/submit

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  validateOrganizationName,
  validateEmail,
  validatePhone,
  validatePinCode,
  validateYear,
  validateCategoryAndResources,
  checkDuplicateOrganization,
  ValidationError,
} from '@/lib/validation/server';
import { generateOrgCustomId, generateBranchCustomId } from '@/lib/organizationId';

// Prevent static generation - this route must be dynamic
export const dynamic = 'force-dynamic';

// Validation schema
const registrationSchema = z.object({
  entityType: z.enum(['ORGANIZATION', 'BRANCH']).default('ORGANIZATION'),
  parentOrganizationId: z.string().uuid().optional(),
  organizationName: z.string().min(3).max(100),
  registrationType: z.enum(['NGO', 'TRUST', 'GOVERNMENT', 'PRIVATE', 'OTHER']),
  registrationNumber: z.string().min(1).max(50),
  yearEstablished: z.number().int().min(1800).max(new Date().getFullYear()),
  description: z.string().max(500).optional(),
  faithId: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),

  primaryContact: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().length(10),
    email: z.string().email(),
  }),

  secondaryContact: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().length(10),
    email: z.string().email(),
  }).optional(),

  facebookUrl: z.string().url().optional().or(z.literal('')),
  instagramHandle: z.string().optional(),
  twitterHandle: z.string().optional(),

  categoryIds: z.array(z.string()).min(1),
  resourceIds: z.array(z.string()).min(1),

  branches: z.array(z.object({
    addressLine1: z.string().min(1).max(200),
    addressLine2: z.string().max(200).optional(),
    cityId: z.string(),
    stateId: z.string(),
    pinCode: z.string().length(6),
    timings: z.array(z.object({
      dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      isClosed: z.boolean(),
    })).optional(),
  })).min(1),

  languageIds: z.array(z.string()).min(1),

  documents: z.object({
    registrationCertificateUrl: z.string(),
    logoUrl: z.string().optional(),
    additionalCertificateUrls: z.array(z.string()).optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Dynamic import to avoid loading Prisma during build phase
    const { default: prisma } = await import('@/lib/prisma');

    const body = await request.json();

    // Validate input
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues?.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })) || [];
      
      return NextResponse.json(
        {
          success: false,
          errors: errors.length > 0 ? errors : [{ field: 'unknown', message: 'Validation failed' }],
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Branch registration: parentOrganizationId is required
    if (data.entityType === 'BRANCH' && !data.parentOrganizationId) {
      return NextResponse.json(
        { success: false, error: 'parentOrganizationId is required for branch registration' },
        { status: 400 }
      );
    }

    // Additional server-side validation using validation functions
    try {
      // Validate organization name
      await validateOrganizationName(data.organizationName);

      // Validate primary contact
      await validateEmail(data.primaryContact.email);
      await validatePhone(data.primaryContact.phone);

      // Validate secondary contact if provided
      if (data.secondaryContact) {
        await validateEmail(data.secondaryContact.email);
        await validatePhone(data.secondaryContact.phone);
      }

      // Validate year
      await validateYear(data.yearEstablished);

      // Validate PIN codes for all branches
      for (const branch of data.branches) {
        await validatePinCode(branch.pinCode, branch.cityId);
      }

      // Validate category and resource relationships
      await validateCategoryAndResources(data.categoryIds, data.resourceIds);

      // For new organizations only: check for duplicate name in same city
      if (data.entityType === 'ORGANIZATION') {
        const firstBranch = data.branches[0];
        const isDuplicate = await checkDuplicateOrganization(
          data.organizationName,
          firstBranch.cityId
        );

        if (isDuplicate) {
          return NextResponse.json(
            {
              success: false,
              error: 'An organization with this name already exists in this city',
            },
            { status: 409 }
          );
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            field: error.field,
          },
          { status: 400 }
        );
      }
      throw error; // Re-throw if it's not a ValidationError
    }

    // Create organization with all related data in a transaction
    const organization = await prisma.$transaction(async (tx) => {
      // 1. Generate custom ID and validate parent org (if branch)
      let customId: string;
      let parentOrganizationId: string | null = null;

      if (data.entityType === 'BRANCH') {
        const parent = await tx.organization.findUnique({
          where: { id: data.parentOrganizationId },
          select: { customId: true, status: true, entityType: true },
        });

        if (!parent || parent.status !== 'APPROVED' || parent.entityType !== 'ORGANIZATION') {
          throw new Error('Parent organization not found, not approved, or is itself a branch');
        }
        if (!parent.customId) {
          throw new Error('Parent organization does not have a custom ID assigned');
        }

        customId = await generateBranchCustomId(tx, parent.customId);
        parentOrganizationId = data.parentOrganizationId!;
      } else {
        customId = await generateOrgCustomId(tx);
      }

      // 2. Create organization
      const org = await tx.organization.create({
        data: {
          customId,
          entityType: data.entityType,
          parentOrganizationId,
          name: data.organizationName,
          registrationType: data.registrationType,
          registrationNumber: data.registrationNumber,
          yearEstablished: data.yearEstablished,
          description: data.description || null,
          faithId: data.faithId || null,
          websiteUrl: data.websiteUrl || null,
          status: 'PENDING',
        },
      });

      // 3. Create contacts
      await tx.contactInformation.create({
        data: {
          organizationId: org.id,
          isPrimary: true,
          name: data.primaryContact.name,
          phone: data.primaryContact.phone,
          email: data.primaryContact.email,
          facebookUrl: data.facebookUrl || null,
          instagramHandle: data.instagramHandle || null,
          twitterHandle: data.twitterHandle || null,
        },
      });

      if (data.secondaryContact) {
        await tx.contactInformation.create({
          data: {
            organizationId: org.id,
            isPrimary: false,
            name: data.secondaryContact.name,
            phone: data.secondaryContact.phone,
            email: data.secondaryContact.email,
          },
        });
      }

      // 4. Create branches with timings
      for (const branchData of data.branches) {
        const branch = await tx.organizationBranch.create({
          data: {
            organizationId: org.id,
            addressLine1: branchData.addressLine1,
            addressLine2: branchData.addressLine2 || null,
            cityId: branchData.cityId,
            stateId: branchData.stateId,
            pinCode: branchData.pinCode,
          },
        });

        // Create branch timings if provided
        if (branchData.timings && branchData.timings.length > 0) {
          await tx.branchTimings.createMany({
            data: branchData.timings.map((timing) => ({
              branchId: branch.id,
              dayOfWeek: timing.dayOfWeek,
              openTime: timing.openTime || null,
              closeTime: timing.closeTime || null,
              isClosed: timing.isClosed,
            })),
          });
        }

        // Create branch-category associations
        await tx.branchCategory.createMany({
          data: data.categoryIds.map((categoryId) => ({
            branchId: branch.id,
            categoryId,
          })),
        });

        // Create branch-resource associations
        await tx.branchResource.createMany({
          data: data.resourceIds.map((resourceId) => ({
            branchId: branch.id,
            resourceId,
          })),
        });
      }

      // 5. Create organization-language associations
      await tx.organizationLanguage.createMany({
        data: data.languageIds.map((languageId) => ({
          organizationId: org.id,
          languageId,
        })),
      });

      // 6. Create document records
      await tx.document.create({
        data: {
          organizationId: org.id,
          type: 'REGISTRATION_CERTIFICATE',
          filename: 'registration-certificate',
          fileUrl: data.documents.registrationCertificateUrl,
          fileSize: 0, // Will be updated by file upload endpoint
          mimeType: 'application/pdf',
        },
      });

      if (data.documents.logoUrl) {
        await tx.document.create({
          data: {
            organizationId: org.id,
            type: 'LOGO',
            filename: 'logo',
            fileUrl: data.documents.logoUrl,
            fileSize: 0,
            mimeType: 'image/jpeg',
          },
        });
      }

      if (data.documents.additionalCertificateUrls && data.documents.additionalCertificateUrls.length > 0) {
        for (const url of data.documents.additionalCertificateUrls) {
          await tx.document.create({
            data: {
              organizationId: org.id,
              type: 'ADDITIONAL_CERTIFICATE',
              filename: 'additional-certificate',
              fileUrl: url,
              fileSize: 0,
              mimeType: 'application/pdf',
            },
          });
        }
      }

      return org;
    });

    return NextResponse.json({
      success: true,
      data: {
        organizationId: organization.id,
        customId: organization.customId,
        entityType: organization.entityType,
        status: organization.status,
        message: 'Registration submitted successfully. Your submission will be reviewed by our team within 48 hours.',
      },
    });

  } catch (error) {
    console.error('Error submitting registration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit registration. Please try again.',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
