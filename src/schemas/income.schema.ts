import { z } from "zod";

export const createIncomeSchema = z.object({
    currentUser: z.number().int().positive().optional(),
    name: z.string().min(1).max(255),
    amount: z.number().positive(),
    comentary: z.string().max(255).optional(),
    date: z
        .string()
        .datetime({ offset: true })
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    isPayed: z.boolean().default(false).optional(),
    userId: z.number().int().positive(),
    categoryIncomeId: z.number().int().positive(),
});

export const updateIncomeSchema = z.object({
    currentUser: z.number().int().positive().optional(),
    income: z.object({
        name: z.string().min(1).max(255).optional(),
        amount: z.number().positive().optional(),
        comentary: z.string().max(255).optional(),
        date: z
            .string()
            .datetime({ offset: true })
            .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
            .optional(),
        isPayed: z.boolean().optional(),
        userId: z.number().int().positive().optional(),
        categoryIncomeId: z.number().int().positive().optional(),
    }),
});
