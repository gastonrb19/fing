import { Router } from 'express';
import { getFriends, removeFriend } from '../controllers/friendship.js';

const router = Router();

// GET /users/:userId/friends
router.get('/users/:userId/friends', getFriends);

// DELETE /users/:userId/friends/:friendId
router.delete('/users/:userId/friends/:friendId', removeFriend);

export default router;
