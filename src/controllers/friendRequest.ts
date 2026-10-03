import { Request, Response } from 'express';
import { FriendRequestService } from '../services/friendRequest.js';
import { dryFn } from '../utils/dryFn.js';

const friendRequestService = new FriendRequestService();

export const sendRequest = dryFn(async (req: Request, res: Response) => {
    const senderId = req.body.currentUser || 1; 
    const receiverId = req.body.receiverId;

    const result = await friendRequestService.sendRequest(senderId, receiverId);
    res.status(201).json(result);
});

export const respondRequest = dryFn(async (req: Request, res: Response) => {
    const receiverId = req.body.currentUser || 1;
    const requestId = parseInt(req.params.id as string);
    const { status } = req.body;

    const result = await friendRequestService.respondRequest(requestId, receiverId, status);
    res.status(200).json(result);
});

export const getPendingRequests = dryFn(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId as string);
    
    const requests = await friendRequestService.getPendingRequests(userId);
    res.status(200).json(requests);
});
