import { z } from "zod";

export const createInstallmentUserPaymentSchema = z.object({
    idPayment: z.string().uuid().optional(),
    accepted: z.boolean(),
    paidAmount: z.number().nonnegative(),
    paymentDone: z.boolean(),
    plannedInstallmentId: z.string().min(1),
    userId: z.number().int().positive()
});

export const updateInstallmentUserPaymentSchema = z.object({
    installmentUserPayment: z.object({
        accepted: z.boolean().optional(),
        paidAmount: z.number().nonnegative().optional(),
        paymentDone: z.boolean().optional(),
        plannedInstallmentId: z.string().min(1).optional(),
        userId: z.number().int().positive().optional()
    })
});
