import { Router } from 'express';
import { sendRequest, respondRequest, getPendingRequests, getSentRequests, cancelRequest } from '../controllers/friendRequest.js';
import { validateBody } from '../middlewares/validation.js';
import { CreateFriendRequestSchema, RespondFriendRequestSchema } from '../schemas/friendRequest.schema.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
const router = Router();
// POST /friend-requests
router.post('/friend-requests', requireAuth, validateBody(CreateFriendRequestSchema), sendRequest);
// PUT /friend-requests/:id/respond
router.put('/friend-requests/:id/respond', requireAuth, validateBody(RespondFriendRequestSchema), respondRequest);
// GET /users/:userId/friend-requests
router.get('/users/:userId/friend-requests', requireAuth, getPendingRequests);
// GET /users/:userId/sent-friend-requests
router.get('/users/:userId/sent-friend-requests', requireAuth, getSentRequests);
// DELETE /friend-requests/:id
router.delete('/friend-requests/:id', requireAuth, cancelRequest);
export default router;
//# sourceMappingURL=friendRequest_routes.js.map