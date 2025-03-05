import { z } from 'zod';

export const searchSchema = z.object({
  search: z.string().regex(/^\d{8}$/, { message: 'CVR must be exactly 8 digits long' }),
});
