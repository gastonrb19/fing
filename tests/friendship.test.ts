import test from 'node:test';
import assert from 'node:assert';
import { FriendRequestService } from '../src/services/friendRequest.js';
import { FriendRequestStatus } from '../src/models/FriendRequestEntity.js';
import { FriendshipEntity } from '../src/models/FriendshipEntity.js';

// Mocks
const mockUserRepo = { findOneBy: async (q: any) => q.id === 2 ? { id: 2 } : null };
const mockFriendshipRepo = { findOneBy: async () => null };

test('Caso de Uso 1: Bloqueo de auto-solicitud', async () => {
    const service = new FriendRequestService();
    try {
        await service.sendRequest(1, 1);
        assert.fail('Debería bloquear');
    } catch (e: any) {
        assert.strictEqual(e.code, "BAD_REQUEST");
        assert.strictEqual(e.message, "No puedes enviarte una solicitud a ti mismo");
    }
});

test('Caso de Uso 2: Error si el receptor no existe', async () => {
    const service = new FriendRequestService();
    (service as any).userRepo = mockUserRepo;
    
    try {
        await service.sendRequest(1, 999); // 999 no existe en nuestro mock
        assert.fail('Debería bloquear');
    } catch (e: any) {
        assert.strictEqual(e.code, "NOT_FOUND");
    }
});

test('Caso de Uso 3: Bloqueo de solicitud duplicada (Spam)', async () => {
    const service = new FriendRequestService();
    (service as any).userRepo = mockUserRepo;
    (service as any).friendshipRepo = mockFriendshipRepo;
    // Simulamos que YA HAY una pendiente
    (service as any).requestRepo = { 
        findOne: async () => ({ id: 99, status: FriendRequestStatus.PENDING }) 
    };

    try {
        await service.sendRequest(1, 2);
        assert.fail('Debería bloquear');
    } catch (e: any) {
        assert.strictEqual(e.message, "Ya existe una solicitud pendiente entre estos usuarios");
    }
});

test('Caso de Uso 4: Enviar solicitud de amistad exitosa', async () => {
    const service = new FriendRequestService();
    (service as any).userRepo = mockUserRepo;
    (service as any).friendshipRepo = mockFriendshipRepo;
    (service as any).requestRepo = { 
        findOne: async () => null, // No hay pendientes
        save: async (entity: any) => ({ ...entity, id: 100 })
    };

    const request = await service.sendRequest(1, 2);
    assert.strictEqual(request.id, 100);
    assert.strictEqual(request.senderId, 1);
    assert.strictEqual(request.receiverId, 2);
    assert.strictEqual(request.status, FriendRequestStatus.PENDING);
});
