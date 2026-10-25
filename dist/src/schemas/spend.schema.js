import { z } from "zod";
export const participantSchema = z.object({
    userId: z.number().int().positive(),
    percentage: z.number().positive().max(100)
});
export const createSpendSchema = z.object({
    currentUser: z.number().int().positive().optional(),
    name: z.string().min(1).max(255),
    amount: z.number().positive(),
    userId: z.number().int().positive(),
    subcategoryId: z.number().int().positive(),
    minDayToPayment: z.number().int().min(1).max(31),
    maxDayToPayment: z.number().int().min(1).max(31).optional(),
    totalInstallment: z.number().int().positive().optional(),
    startPayment: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    fkTypeSpend: z.number().int().positive().default(1).optional(),
    isPaid: z.boolean().optional(),
    participants: z.array(participantSchema).optional()
}).refine(data => {
    if (data.participants && data.participants.length > 0) {
        const totalPercentage = data.participants.reduce((sum, p) => sum + p.percentage, 0);
        // Usamos una pequeña tolerancia matemática por la suma de flotantes en JS
        return Math.abs(totalPercentage - 100) < 0.01;
    }
    return true;
}, {
    message: "La sumatoria de los porcentajes de los participantes debe ser exactamente 100",
    path: ["participants"]
}).refine(data => {
    if (data.isPaid) {
        if (!data.participants || data.participants.length === 0)
            return true;
        return data.participants.length === 1 && data.participants[0]?.userId === data.userId;
    }
    return true;
}, {
    message: "Solo se puede marcar como pagado inmediatamente si el creador es el único participante implicado",
    path: ["isPaid"]
});
export const updateSpendSchema = z.object({
    currentUser: z.number().int().positive().optional(),
    spend: z.object({
        name: z.string().min(1).max(255).optional(),
        amount: z.number().positive().optional(),
        userId: z.number().int().positive().optional(),
        subcategoryId: z.number().int().positive().optional(),
        minDayToPayment: z.number().int().min(1).max(31).optional(),
        maxDayToPayment: z.number().int().min(1).max(31).optional(),
        totalInstallment: z.number().int().positive().optional(),
        startPayment: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
        fkTypeSpend: z.number().int().positive().optional()
    })
});
//# sourceMappingURL=spend.schema.js.map