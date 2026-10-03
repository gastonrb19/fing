import { Router } from 'express';
import { sendRequest, respondRequest, getPendingRequests, getSentRequests, cancelRequest } from '../controllers/friendRequest.js';
import { validateBody } from '../middlewares/validation.js';
import { CreateFriendRequestSchema, RespondFriendRequestSchema } from '../schemas/friendRequest.schema.js';

const router = Router();

// POST /friend-requests
router.post('/friend-requests', validateBody(CreateFriendRequestSchema), sendRequest);

// PUT /friend-requests/:id/respond
router.put('/friend-requests/:id/respond', validateBody(RespondFriendRequestSchema), respondRequest);

// GET /users/:userId/friend-requests
router.get('/users/:userId/friend-requests', getPendingRequests);


// GET /users/:userId/sent-friend-requests
router.get('/users/:userId/sent-friend-requests', getSentRequests);

// DELETE /friend-requests/:id
router.delete('/friend-requests/:id', cancelRequest);

export default router;
