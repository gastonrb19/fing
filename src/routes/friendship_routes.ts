import { Router } from 'express';
import { getFriends, removeFriend } from '../controllers/friendship.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /users/:userId/friends
router.get('/users/:userId/friends', requireAuth, getFriends);

// DELETE /users/:userId/friends/:friendId
router.delete('/users/:userId/friends/:friendId', requireAuth, removeFriend);

export default router;
