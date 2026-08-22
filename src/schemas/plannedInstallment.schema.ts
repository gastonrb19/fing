import { z } from "zod";

export const createPlannedInstallmentSchema = z.object({
    idPI: z.string().min(1),
    amount: z.number().positive(),
    expirationDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    availableDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    spendId: z.number().int().positive()
});

export const updatePlannedInstallmentSchema = z.object({
    plannedInstallment: z.object({
        amount: z.number().positive().optional(),
        expirationDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
        availableDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
        spendId: z.number().int().positive().optional()
    })
});
