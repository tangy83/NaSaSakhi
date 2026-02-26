import { z } from 'zod';

export const organizationSchema = z.object({
  organizationName: z
    .string()
    .min(3, 'Organization name must be at least 3 characters')
    .max(100, 'Organization name cannot exceed 100 characters'),

  registrationType: z.enum(['NGO', 'TRUST', 'GOVERNMENT', 'PRIVATE', 'OTHER'], {
    message: 'Please select a registration type',
  }),

  registrationNumber: z
    .string()
    .min(1, 'Registration number is required')
    .max(50, 'Registration number cannot exceed 50 characters'),

  yearEstablished: z
    .number()
    .int()
    .min(1800, 'Year must be 1800 or later')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),

  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),

  faithId: z.string().optional(),

  socialCategoryIds: z.array(z.string()).optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;
