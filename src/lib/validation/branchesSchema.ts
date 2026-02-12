import { z } from 'zod';

// Day of week enum
const dayOfWeekSchema = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]);

// Time format validation (HH:MM in 24-hour format)
const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format (24-hour)')
  .optional();

// Branch timing schema
const branchTimingSchema = z.object({
  dayOfWeek: dayOfWeekSchema,
  openTime: timeSchema,
  closeTime: timeSchema,
  isClosed: z.boolean(),
}).refine(
  (data) => {
    // If branch is closed, timings don't matter
    if (data.isClosed) return true;
    
    // If open, both openTime and closeTime should be provided
    if (!data.openTime || !data.closeTime) return false;
    
    // Validate that openTime < closeTime
    const [openHour, openMin] = data.openTime.split(':').map(Number);
    const [closeHour, closeMin] = data.closeTime.split(':').map(Number);
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    return openMinutes < closeMinutes;
  },
  {
    message: 'Opening time must be before closing time',
  }
);

// Single branch schema
export const branchSchema = z.object({
  addressLine1: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address cannot exceed 200 characters'),

  addressLine2: z
    .string()
    .max(200, 'Address line 2 cannot exceed 200 characters')
    .optional()
    .or(z.literal('')),

  cityId: z
    .string()
    .min(1, 'Please select a city'),

  stateId: z
    .string()
    .min(1, 'Please select a state'),

  pinCode: z
    .string()
    .length(6, 'PIN code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'PIN code must contain only digits'),

  country: z
    .string()
    .default('India')
    .optional(),

  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),

  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),

  timings: z.array(branchTimingSchema).optional(),
});

// Branches array schema (for Step 4 - at least 1 branch required)
export const branchesSchema = z.object({
  branches: z
    .array(branchSchema)
    .min(1, 'Please add at least one branch location'),
});

export type BranchFormData = z.infer<typeof branchSchema>;
export type BranchesFormData = z.infer<typeof branchesSchema>;
