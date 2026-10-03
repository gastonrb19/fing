import { Router } from 'express';
import { sendRequest, respondRequest, getPendingRequests } from '../controllers/friendRequest.js';
import { validateBody } from '../middlewares/validation.js';
import { CreateFriendRequestSchema, RespondFriendRequestSchema } from '../schemas/friendRequest.schema.js';

const router = Router();

// POST /friend-requests
router.post('/', validateBody(CreateFriendRequestSchema), sendRequest);

// PUT /friend-requests/:id/respond
router.put('/:id/respond', validateBody(RespondFriendRequestSchema), respondRequest);

// GET /users/:userId/friend-requests
router.get('/users/:userId/friend-requests', getPendingRequests);

export default router;
