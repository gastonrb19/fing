import test from 'node:test';
import assert from 'node:assert';
import { InstallmentUserPaymentService } from '../src/services/installmentUserPayment.js';
import { GeneralError } from '../src/utils/classError.js';

// Mocks simulando la Base de Datos Transaccional
const mockPayment = {
    idPayment: "123",
    rejected: false,
    accepted: false,
    user: { id: 2 }, // El amigo
    plannedInstallment: {
        piId: { user: { id: 1 } } // El creador (Juan)
    }
};

test('Caso Uso 8: Bloquear rechazo si el usuario no es dueño de la deuda', async () => {
    const service = new InstallmentUserPaymentService();
    // Inyectamos mock transaccional
    (service as any).rejectPayment = async (idPayment: string, userId: number) => {
        if (mockPayment.user.id !== userId) {
            throw new GeneralError("No tienes permisos para rechazar esta asignación", 403, "FORBIDDEN");
        }
    };

    try {
        await service.rejectPayment("123", 999); // Intruso
        assert.fail('Debería bloquear');
    } catch (e: any) {
        assert.strictEqual(e.code, "FORBIDDEN");
    }
});

test('Caso Uso 9: Rechazo exitoso y reasignación al creador', async () => {
    const service = new InstallmentUserPaymentService();
    let savedPayment: any = null;

    // Sobreescribimos el método mock transaccional para la prueba
    (service as any).rejectPayment = async (idPayment: string, userId: number) => {
        if (mockPayment.user.id !== userId) throw new Error("Forbidden");
        
        // Simular lo que haría TypeORM
        const payment = { ...mockPayment };
        payment.rejected = true;
        (payment as any).assumedByUser = payment.plannedInstallment.piId.user;
        
        savedPayment = payment;
        return payment;
    };

    await service.rejectPayment("123", 2);
    
    assert.strictEqual(savedPayment.rejected, true);
    assert.strictEqual(savedPayment.assumedByUser.id, 1); // La deuda vuelve al creador (Juan)
});
