import { z } from "zod";

export const createCategoryIncomeSchema = z.object({
    currentUser: z.number().int().positive().optional(),
    name: z.string().min(1).max(100),
    description: z.string().max(255).optional(),
});

export const updateCategoryIncomeSchema = z.object({
    currentUser: z.number().int().positive().optional(),
    categoryIncome: z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(255).optional(),
    }),
});
