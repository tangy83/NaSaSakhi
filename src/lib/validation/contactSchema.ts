import { z } from 'zod';

// Contact info schema (reusable for primary and secondary)
const contactInfoSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  phone: z
    .string()
    .min(10, 'Phone number must be exactly 10 digits')
    .max(10, 'Phone number must be exactly 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Phone number must start with 6, 7, 8, or 9'),

  email: z
    .string()
    .min(1, 'Email address is required')
    .max(100, 'Email address cannot exceed 100 characters')
    .email('Please enter a valid email address'),
});

// URL validation helper
const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .max(200, 'URL cannot exceed 200 characters')
  .optional()
  .or(z.literal(''));

// Social media handle validation
const socialHandleSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores')
  .optional()
  .or(z.literal(''));

export const contactSchema = z.object({
  // Primary contact (required)
  primaryContact: contactInfoSchema,

  // Secondary contact (optional)
  secondaryContact: contactInfoSchema.optional(),

  // Website URL (optional)
  websiteUrl: urlSchema,

  // Social media links (optional)
  facebookUrl: z
    .string()
    .url('Please enter a valid Facebook URL')
    .refine((url) => url.includes('facebook.com'), {
      message: 'URL must contain facebook.com',
    })
    .max(200, 'URL cannot exceed 200 characters')
    .optional()
    .or(z.literal('')),

  instagramHandle: z
    .string()
    .max(30, 'Instagram handle cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Instagram handle can only contain letters, numbers, and underscores')
    .optional()
    .or(z.literal('')),

  twitterHandle: z
    .string()
    .max(15, 'Twitter handle cannot exceed 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Twitter handle can only contain letters, numbers, and underscores')
    .optional()
    .or(z.literal('')),
});

export type ContactFormData = z.infer<typeof contactSchema>;
