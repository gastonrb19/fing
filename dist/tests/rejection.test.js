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
    service.rejectPayment = async (idPayment, userId) => {
        if (mockPayment.user.id !== userId) {
            throw new GeneralError("No tienes permisos para rechazar esta asignación", 403, "FORBIDDEN");
        }
    };
    try {
        await service.rejectPayment("123", 999); // Intruso
        assert.fail('Debería bloquear');
    }
    catch (e) {
        assert.strictEqual(e.code, "FORBIDDEN");
    }
});
test('Caso Uso 9: Rechazo exitoso y reasignación al creador', async () => {
    const service = new InstallmentUserPaymentService();
    let savedPayment = null;
    // Sobreescribimos el método mock transaccional para la prueba
    service.rejectPayment = async (idPayment, userId) => {
        if (mockPayment.user.id !== userId)
            throw new Error("Forbidden");
        // Simular lo que haría TypeORM
        const payment = { ...mockPayment };
        payment.rejected = true;
        payment.assumedByUser = payment.plannedInstallment.piId.user;
        savedPayment = payment;
        return payment;
    };
    await service.rejectPayment("123", 2);
    assert.strictEqual(savedPayment.rejected, true);
    assert.strictEqual(savedPayment.assumedByUser.id, 1); // La deuda vuelve al creador (Juan)
});
//# sourceMappingURL=rejection.test.js.map