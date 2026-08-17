import { z } from 'zod';

/** PascalCase Lucide React component name, e.g. "Scissors", "Sparkles". */
export const lucideIconNameSchema = z
    .string()
    .trim()
    .min(1, 'Icon is required')
    .max(64, 'Icon name is too long')
    .regex(/^[A-Z][a-zA-Z0-9]*$/, 'Must be a valid Lucide icon name (PascalCase)');

export type LucideIconName = z.infer<typeof lucideIconNameSchema>;
