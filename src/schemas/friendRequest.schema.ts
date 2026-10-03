import { z } from 'zod';
import { FriendRequestStatus } from '../models/FriendRequestEntity.js';

export const CreateFriendRequestSchema = z.object({
    receiverId: z.number().int().positive()
});

export const RespondFriendRequestSchema = z.object({
    status: z.enum([FriendRequestStatus.ACCEPTED, FriendRequestStatus.REJECTED])
});
