import { FriendshipService } from '../services/friendship.js';
import { dryFn } from '../utils/dryFn.js';
const friendshipService = new FriendshipService();
export const getFriends = dryFn(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const friends = await friendshipService.getFriends(userId);
    res.status(200).json(friends);
});
export const removeFriend = dryFn(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);
    await friendshipService.removeFriend(userId, friendId);
    res.status(200).json({ message: "Amistad eliminada correctamente" });
});
//# sourceMappingURL=friendship.js.map