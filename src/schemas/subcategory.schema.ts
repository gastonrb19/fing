import { z } from "zod";

export const createSubcategorySchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(255).optional(),
    categoryId: z.number().int().positive()
});

export const updateSubcategorySchema = z.object({
    subcategory: z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(255).optional(),
        categoryId: z.number().int().positive().optional()
    })
});
