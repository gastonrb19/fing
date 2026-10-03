import { myDataSource } from "../config/app-data-source.js";
import { FriendshipEntity } from "../models/FriendshipEntity.js";

export class FriendshipService {
    private friendshipRepo = myDataSource.getRepository(FriendshipEntity);

    /**
     * Retorna la lista de amigos consolidados de un usuario
     */
    async getFriends(userId: number) {
        return await this.friendshipRepo.find({
            where: { userId },
            relations: { friend: true },
            select: {
                id: true,
                createdAt: true,
                friend: {
                    id: true,
                    username: true,
                    email: true,
                    phone: true
                }
            }
        });
    }

    /**
     * Elimina una amistad en ambos sentidos (A -> B y B -> A)
     */
    async removeFriend(userId: number, friendId: number): Promise<void> {
        // Usamos una transacción simple para mantener consistencia
        await myDataSource.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.delete(FriendshipEntity, { userId, friendId });
            await transactionalEntityManager.delete(FriendshipEntity, { userId: friendId, friendId: userId });
        });
    }
}
