import { z } from "zod";

export const createTypeSpendSchema = z.object({
    currentUser: z.number().int().positive().optional(),
    name: z.string().min(1).max(50)
});

export const updateTypeSpendSchema = z.object({
    currentUser: z.number().int().positive().optional(),
    typeSpend: z.object({
        name: z.string().min(1).max(50).optional()
    })
});
