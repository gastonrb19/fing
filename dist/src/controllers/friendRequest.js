import { FriendRequestService } from '../services/friendRequest.js';
import { dryFn } from '../utils/dryFn.js';
const friendRequestService = new FriendRequestService();
export const sendRequest = dryFn(async (req, res) => {
    const senderId = req.body.currentUser || 1;
    const receiverId = req.body.receiverId;
    const result = await friendRequestService.sendRequest(senderId, receiverId);
    res.status(201).json(result);
});
export const respondRequest = dryFn(async (req, res) => {
    const receiverId = req.body.currentUser || 1;
    const requestId = parseInt(req.params.id);
    const { status } = req.body;
    const result = await friendRequestService.respondRequest(requestId, receiverId, status);
    res.status(200).json(result);
});
export const getPendingRequests = dryFn(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const requests = await friendRequestService.getPendingRequests(userId);
    res.status(200).json(requests);
});
export const getSentRequests = dryFn(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const requests = await friendRequestService.getSentRequests(userId);
    res.status(200).json(requests);
});
export const cancelRequest = dryFn(async (req, res) => {
    const requestId = parseInt(req.params.id);
    const senderId = req.body.currentUser || 1;
    await friendRequestService.cancelRequest(requestId, senderId);
    res.status(200).json({ message: "Solicitud cancelada correctamente" });
});
//# sourceMappingURL=friendRequest.js.map