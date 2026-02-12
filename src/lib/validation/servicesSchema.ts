import { z } from 'zod';

export const servicesSchema = z.object({
  // Service Categories - minimum 1 must be selected
  categoryIds: z
    .array(z.string())
    .min(1, 'Please select at least one service category')
    .refine((ids) => ids.length > 0 && ids.every((id) => id.trim().length > 0), {
      message: 'Category IDs cannot be empty',
    }),

  // Service Resources - minimum 1 must be selected
  // Note: "Min 1 per category" validation should be done at form level
  // when category-resource relationships are available
  resourceIds: z
    .array(z.string())
    .min(1, 'Please select at least one service resource')
    .refine((ids) => ids.length > 0 && ids.every((id) => id.trim().length > 0), {
      message: 'Resource IDs cannot be empty',
    }),
});

export type ServicesFormData = z.infer<typeof servicesSchema>;
