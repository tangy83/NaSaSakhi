import { z } from 'zod';

export const organizationSchema = z.object({
  organizationName: z
    .string()
    .min(3, 'Organization name must be at least 3 characters')
    .max(100, 'Organization name cannot exceed 100 characters'),

  registrationType: z.enum(['NGO', 'TRUST', 'GOVERNMENT', 'PRIVATE', 'OTHER'], {
    required_error: 'Please select a registration type',
  }),

  registrationNumber: z
    .string()
    .min(1, 'Registration number is required')
    .max(50, 'Registration number cannot exceed 50 characters'),

  yearEstablished: z
    .number({
      required_error: 'Year of establishment is required',
      invalid_type_error: 'Year must be a number',
    })
    .int()
    .min(1800, 'Year must be 1800 or later')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),

  faithId: z.string().optional(),

  socialCategoryIds: z.array(z.string()).optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;
