// Server-Side Validation Functions
// Comprehensive validation for registration and other forms

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export async function validateOrganizationName(name: string): Promise<void> {
  if (!name || name.trim().length < 3) {
    throw new ValidationError('organizationName', 'Organization name must be at least 3 characters');
  }

  if (name.length > 100) {
    throw new ValidationError('organizationName', 'Organization name cannot exceed 100 characters');
  }
}

export async function validateEmail(email: string): Promise<void> {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    throw new ValidationError('email', 'Invalid email format');
  }
}

export async function validatePhone(phone: string): Promise<void> {
  // Must be exactly 10 digits and start with 6/7/8/9
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(phone)) {
    throw new ValidationError('phone', 'Phone number must be 10 digits starting with 6, 7, 8, or 9');
  }
}

export async function validatePinCode(pinCode: string, cityId: string): Promise<void> {
  // Must be exactly 6 digits
  if (!/^\d{6}$/.test(pinCode)) {
    throw new ValidationError('pinCode', 'PIN code must be exactly 6 digits');
  }

  // TODO: Cross-validate PIN code with city (requires PIN code database)
  // For MVP, we'll skip this validation
}

export async function checkDuplicateOrganization(
  name: string,
  cityId: string
): Promise<boolean> {
  // Dynamic import to avoid loading Prisma during build phase
  const { default: prisma } = await import('@/lib/prisma');

  const existing = await prisma.organization.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive', // Case-insensitive
      },
      branches: {
        some: {
          cityId,
        },
      },
    },
  });

  return !!existing;
}

export async function validateYear(year: number): Promise<void> {
  const currentYear = new Date().getFullYear();

  if (year < 1800 || year > currentYear) {
    throw new ValidationError(
      'yearEstablished',
      `Year must be between 1800 and ${currentYear}`
    );
  }
}

export async function validateCategoryAndResources(
  categoryIds: string[],
  resourceIds: string[]
): Promise<void> {
  // Dynamic import to avoid loading Prisma during build phase
  const { default: prisma } = await import('@/lib/prisma');

  // Check that all resources belong to selected categories
  const resources = await prisma.serviceResource.findMany({
    where: {
      id: {
        in: resourceIds,
      },
    },
    select: {
      id: true,
      categoryId: true,
    },
  });

  // Check if all resources exist
  if (resources.length !== resourceIds.length) {
    throw new ValidationError(
      'resources',
      'One or more selected resources do not exist'
    );
  }

  const resourceCategoryIds = new Set(resources.map((r) => r.categoryId));

  // Check that all selected categories have at least one resource
  for (const categoryId of categoryIds) {
    if (!resourceCategoryIds.has(categoryId)) {
      throw new ValidationError(
        'resources',
        `No resources selected for category ${categoryId}`
      );
    }
  }
}
