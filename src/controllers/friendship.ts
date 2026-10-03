import { Request, Response } from 'express';
import { FriendshipService } from '../services/friendship.js';
import { dryFn } from '../utils/dryFn.js';

const friendshipService = new FriendshipService();

export const getFriends = dryFn(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId as string);

    const friends = await friendshipService.getFriends(userId);
    res.status(200).json(friends);
});

export const removeFriend = dryFn(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId as string);
    const friendId = parseInt(req.params.friendId as string);

    await friendshipService.removeFriend(userId, friendId);
    res.status(200).json({ message: "Amistad eliminada correctamente" });
});
