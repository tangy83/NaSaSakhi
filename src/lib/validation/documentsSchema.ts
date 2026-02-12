import { z } from 'zod';

// URL validation helper - accepts both absolute URLs (http://, https://) and relative paths (/uploads/...)
const urlSchema = z
  .string()
  .min(1, 'File URL is required')
  .refine(
    (val) => {
      // Accept absolute URLs (http://, https://)
      if (val.startsWith('http://') || val.startsWith('https://')) {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      }
      // Accept relative paths starting with /
      if (val.startsWith('/')) {
        return true;
      }
      return false;
    },
    { message: 'Please provide a valid file URL' }
  );

export const documentsSchema = z.object({
  // Registration certificate (required)
  registrationCertificateUrl: urlSchema,

  // Organization logo (optional) - accepts empty string, undefined, or valid URL/path
  // Empty strings are allowed (treated as "not provided")
  logoUrl: z
    .preprocess(
      (val) => {
        // Normalize undefined/null to empty string for consistent validation
        return val === undefined || val === null ? '' : val;
      },
      z.union([
        // Accept absolute URLs or relative paths (same validation as urlSchema)
        z.string().refine(
          (val) => {
            // Empty string is valid (means no logo provided)
            if (val === '') return true;
            if (val.startsWith('http://') || val.startsWith('https://')) {
              try {
                new URL(val);
                return true;
              } catch {
                return false;
              }
            }
            if (val.startsWith('/')) {
              return true;
            }
            return false;
          },
          { message: 'Please provide a valid logo URL' }
        ),
        z.literal(''),
      ])
    )
    .optional(),

  // Additional certificates (optional, max 3 files)
  additionalCertificateUrls: z
    .array(urlSchema)
    .max(3, 'You can upload a maximum of 3 additional certificates')
    .optional()
    .default([]),
});

export type DocumentsFormData = z.infer<typeof documentsSchema>;
