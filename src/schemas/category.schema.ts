import { z } from "zod";

export const createCategorySchema = z.object({
    currentUser: z.number().int().positive().optional(),
    name: z.string().min(1).max(100),
    description: z.string().max(255).optional()
});

export const updateCategorySchema = z.object({
    currentUser: z.number().int().positive().optional(),
    category: z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(255).optional()
    })
});
