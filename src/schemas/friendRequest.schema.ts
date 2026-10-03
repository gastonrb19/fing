import { z } from 'zod';
import { FriendRequestStatus } from '../models/FriendRequestEntity.js';

export const CreateFriendRequestSchema = z.object({
    currentUser: z.number().int().positive().optional(),
    receiverId: z.number().int().positive()
});

export const RespondFriendRequestSchema = z.object({
    currentUser: z.number().int().positive().optional(),
    status: z.enum([FriendRequestStatus.ACCEPTED, FriendRequestStatus.REJECTED])
});
