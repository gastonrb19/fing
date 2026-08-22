import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    hashedPassword: z.string().min(6),
    phone: z.string().min(7).max(15)
});

export const updateUserSchema = z.object({
    user: z.object({
        username: z.string().min(3).max(50).optional(),
        email: z.string().email().optional(),
        hashedPassword: z.string().min(6).optional(),
        phone: z.string().min(7).max(15).optional()
    })
});
