import { myDataSource } from "../config/app-data-source.js";
import { FriendRequestEntity, FriendRequestStatus } from "../models/FriendRequestEntity.js";
import { FriendshipEntity } from "../models/FriendshipEntity.js";
import { User } from "../models/UserEntity.js";
import { GeneralError, NotFoundError } from "../utils/classError.js";

export class FriendRequestService {

    async getSentRequests(userId: number) {
        return await this.requestRepo.find({
            where: { senderId: userId, status: FriendRequestStatus.PENDING },
            relations: { receiver: true },
            select: { id: true, createdAt: true, receiver: { id: true, username: true, email: true } }
        });
    }

    async cancelRequest(requestId: number, senderId: number) {
        const request = await this.requestRepo.findOne({ where: { id: requestId } });
        if (!request) throw new NotFoundError("FriendRequest", requestId);
        if (request.senderId !== senderId) throw new GeneralError("No tienes permisos para cancelar esta solicitud", 403, "FORBIDDEN");
        
        await this.requestRepo.remove(request);
    }

    private requestRepo = myDataSource.getRepository(FriendRequestEntity);
    private userRepo = myDataSource.getRepository(User);
    private friendshipRepo = myDataSource.getRepository(FriendshipEntity);

    /**
     * Envía una solicitud de amistad
     */
    async sendRequest(senderId: number, receiverId: number) {
        if (senderId === receiverId) {
            throw new GeneralError("No puedes enviarte una solicitud a ti mismo", 400, "BAD_REQUEST");
        }

        // 1. Validar que el receptor exista
        const receiverExists = await this.userRepo.findOneBy({ id: receiverId });
        if (!receiverExists) {
            throw new NotFoundError('User', receiverId);
        }

        // 2. Validar que no sean amigos ya
        const alreadyFriends = await this.friendshipRepo.findOneBy({ userId: senderId, friendId: receiverId });
        if (alreadyFriends) {
            throw new GeneralError("Ya son amigos", 400, "BAD_REQUEST");
        }

        // 3. Validar si ya hay una solicitud pendiente
        const existingRequest = await this.requestRepo.findOne({
            where: [
                { senderId, receiverId, status: FriendRequestStatus.PENDING },
                { senderId: receiverId, receiverId: senderId, status: FriendRequestStatus.PENDING }
            ]
        });

        if (existingRequest) {
            throw new GeneralError("Ya existe una solicitud pendiente entre estos usuarios", 400, "BAD_REQUEST");
        }

        const newRequest = new FriendRequestEntity();
        newRequest.senderId = senderId;
        newRequest.receiverId = receiverId;
        newRequest.status = FriendRequestStatus.PENDING;

        return await this.requestRepo.save(newRequest);
    }

    /**
     * Responde a una solicitud (ACCEPTED o REJECTED) e inserta la amistad
     */
    async respondRequest(requestId: number, receiverId: number, status: FriendRequestStatus) {
        return await myDataSource.transaction(async transactionalEntityManager => {
            const request = await transactionalEntityManager.findOne(FriendRequestEntity, { 
                where: { id: requestId } 
            });

            if (!request) {
                throw new NotFoundError("FriendRequest", requestId);
            }
            if (request.receiverId !== receiverId) {
                throw new GeneralError("No tienes permisos para responder a esta solicitud", 403, "FORBIDDEN");
            }
            if (request.status !== FriendRequestStatus.PENDING) {
                throw new GeneralError("Esta solicitud ya fue procesada", 400, "BAD_REQUEST");
            }

            request.status = status;
            await transactionalEntityManager.save(request);

            if (status === FriendRequestStatus.ACCEPTED) {
                const friendship1 = new FriendshipEntity();
                friendship1.userId = request.senderId;
                friendship1.friendId = request.receiverId;

                const friendship2 = new FriendshipEntity();
                friendship2.userId = request.receiverId;
                friendship2.friendId = request.senderId;

                await transactionalEntityManager.save([friendship1, friendship2]);
            }

            return request;
        });
    }

    /**
     * Obtiene mis solicitudes PENDIENTES
     */
    async getPendingRequests(userId: number) {
        return await this.requestRepo.find({
            where: { receiverId: userId, status: FriendRequestStatus.PENDING },
            relations: { sender: true },
            select: {
                id: true,
                createdAt: true,
                sender: { id: true, username: true, email: true }
            }
        });
    }
}
