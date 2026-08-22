import { test, mock } from "node:test";
import assert from "node:assert";
import { InstallmentUserPaymentService } from "../src/services/installmentUserPayment.js";
import { InstallmentUserPayment } from "../src/models/InstallmentUserPayment.js";
import { PlannedInstallmentEntity } from "../src/models/PlannedInstallmentEntity.js";
import { User } from "../src/models/UserEntity.js";
import { myDataSource } from "../src/config/app-data-source.js";

test("InstallmentUserPaymentService CRUD operations", async () => {
    const savedPayments: InstallmentUserPayment[] = [];

    mock.method(myDataSource, "getRepository", (entity: any) => {
        return {
            findOneBy: async (query: any) => {
                if (entity === User && query.id === 1) {
                    const u = new User();
                    u.id = 1;
                    return u;
                }
                return null;
            },
            findOne: async (options: any) => {
                if (entity === PlannedInstallmentEntity && options.where?.idPI === "100-1") {
                    const pi = new PlannedInstallmentEntity();
                    pi.idPI = "100-1";
                    return pi;
                }
                if (entity === InstallmentUserPayment) {
                    const idPayment = options.where?.idPayment;
                    if (idPayment === "pay-1") {
                        const p = new InstallmentUserPayment();
                        p.idPayment = "pay-1";
                        p.paidAmount = 10000;
                        return p;
                    }
                }
                return null;
            },
            find: async (options: any) => {
                if (options?.where?.user?.id === 1) {
                    return savedPayments.filter(p => p.user?.id === 1);
                }
                return savedPayments;
            },
            save: async (payment: InstallmentUserPayment) => {
                savedPayments.push(payment);
                return payment;
            },
            remove: async (payment: InstallmentUserPayment) => {
                const idx = savedPayments.findIndex(p => p.idPayment === payment.idPayment);
                if (idx !== -1) {
                    savedPayments.splice(idx, 1);
                }
                return payment;
            }
        };
    });

    const service = new InstallmentUserPaymentService();

    // 1. Test create
    const dto = {
        idPayment: "pay-2",
        accepted: false,
        paidAmount: 15000,
        paymentDone: true,
        plannedInstallmentId: "100-1",
        userId: 1
    };

    const newPayment = await service.create(dto);
    assert.strictEqual(newPayment.idPayment, "pay-2");
    assert.strictEqual(newPayment.paidAmount, 15000);
    assert.strictEqual(newPayment.paymentDone, true);
    assert.strictEqual(newPayment.user.id, 1);

    // 2. Test findOneById
    const payment = await service.findOneById("pay-1");
    assert.strictEqual(payment.paidAmount, 10000);

    // 3. Test findByUser
    const list = await service.findByUser(1, true, { limit: 10, offset: 0 });
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0]?.idPayment, "pay-2");

    console.log("¡Prueba de InstallmentUserPaymentService aprobada con éxito!");
});
