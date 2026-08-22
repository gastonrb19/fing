import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(255).optional()
});

export const updateCategorySchema = z.object({
    category: z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(255).optional()
    })
});
