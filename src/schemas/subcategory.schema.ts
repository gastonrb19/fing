import { z } from "zod";

export const createSubcategorySchema = z.object({
    currentUser: z.number().int().positive().optional(),
    name: z.string().min(1).max(100),
    description: z.string().max(255).optional(),
    categoryId: z.number().int().positive()
});

export const updateSubcategorySchema = z.object({
    currentUser: z.number().int().positive().optional(),
    subcategory: z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(255).optional(),
        categoryId: z.number().int().positive().optional()
    })
});
