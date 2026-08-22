import { z } from "zod";

export const createTypeSpendSchema = z.object({
    name: z.string().min(1).max(50)
});

export const updateTypeSpendSchema = z.object({
    typeSpend: z.object({
        name: z.string().min(1).max(50).optional()
    })
});
