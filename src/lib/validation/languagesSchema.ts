import { z } from 'zod';

export const languagesSchema = z.object({
  // Language IDs - minimum 1 must be selected
  languageIds: z
    .array(z.string())
    .min(1, 'Please select at least one language')
    .refine((ids) => ids.length > 0 && ids.every((id) => id.trim().length > 0), {
      message: 'Language IDs cannot be empty',
    }),
});

export type LanguagesFormData = z.infer<typeof languagesSchema>;
