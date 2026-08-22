import { test, mock } from "node:test";
import assert from "node:assert";
import { SpendService } from "../src/services/spend.js";
import { myDataSource } from "../src/config/app-data-source.js";
import { TypeSpendEntity } from "../src/models/TypeSpendEntity.js";
import { SpendEntity } from "../src/models/SpendEntity.js";
import { PlannedInstallmentEntity } from "../src/models/PlannedInstallmentEntity.js";
import { InstallmentUserPayment } from "../src/models/InstallmentUserPayment.js";
import { User } from "../src/models/UserEntity.js";
import { SubcategoryEntity } from "../src/models/SubcategoryEntity.js";

test("SpendService.create generates correct planned installments and user payments", async () => {
    // 1. Mock Services
    const mockUser = new User();
    mockUser.id = 1;
    mockUser.username = "gaston";

    const mockSubcategory = new SubcategoryEntity();
    mockSubcategory.id = 10;
    mockSubcategory.name = "Alimentación";

    const mockUserService: any = {
        findOneById: async (id: number) => {
            if (id === 1) return mockUser;
            throw new Error("User not found");
        }
    };

    const mockSubcategoryService: any = {
        findOneById: async (id: number) => {
            if (id === 10) return mockSubcategory;
            throw new Error("Subcategory not found");
        }
    };

    // 2. Mock TypeORM myDataSource
    const savedEntities: any[] = [];

    mock.method(myDataSource, "getRepository", (entity: any) => {
        return {
            findOneBy: async (query: any) => {
                if (entity === TypeSpendEntity && query.id === 2) {
                    const ts = new TypeSpendEntity();
                    ts.id = 2;
                    ts.name = "Gasto";
                    return ts;
                }
                return null;
            }
        };
    });

    mock.method(myDataSource, "transaction", async (cb: any) => {
        const transactionalEntityManager = {
            save: async (entity: any) => {
                if (entity instanceof SpendEntity) {
                    entity.id = 123; // Simular ID generado por BD
                }
                savedEntities.push(entity);
                return entity;
            }
        };
        return await cb(transactionalEntityManager);
    });

    // 3. Instantiate Service and Call Create
    const spendService = new SpendService(mockUserService, mockSubcategoryService);

    const dto = {
        name: "Supermercado Mensual",
        amount: 30000,
        userId: 1,
        subcategoryId: 10,
        minDayToPayment: 5,
        maxDayToPayment: 10,
        totalInstallment: 3,
        startPayment: "2026-08-01",
        fkTypeSpend: 2
    };

    const createdSpend = await spendService.create(dto);

    // 4. Assertions
    assert.strictEqual(createdSpend.id, 123);
    assert.strictEqual(createdSpend.name, "Supermercado Mensual");
    assert.strictEqual(createdSpend.amount, 30000);

    // Deberían haberse guardado: 1 Spend + 3 PlannedInstallments + 3 InstallmentUserPayments = 7 entidades
    assert.strictEqual(savedEntities.length, 7);

    // Filtrar entidades guardadas
    const spendEntity = savedEntities.find(e => e instanceof SpendEntity);
    const plannedInstallments = savedEntities.filter(e => e instanceof PlannedInstallmentEntity);
    const userPayments = savedEntities.filter(e => e instanceof InstallmentUserPayment);

    assert.ok(spendEntity);
    assert.strictEqual(plannedInstallments.length, 3);
    assert.strictEqual(userPayments.length, 3);

    // Verificar las cuotas (PlannedInstallments)
    plannedInstallments.forEach((pi, index) => {
        assert.strictEqual(pi.idPI, `123-${index + 1}`);
        assert.strictEqual(pi.amount, 10000); // 30000 / 3

        const expectedMonth = 7 + index; // Agosto es mes index 7
        const availDate = new Date(pi.availableDate);
        const expDate = new Date(pi.expirationDate);

        assert.strictEqual(availDate.getUTCMonth(), expectedMonth % 12);
        assert.strictEqual(availDate.getUTCDate(), 5);
        assert.strictEqual(expDate.getUTCMonth(), expectedMonth % 12);
        assert.strictEqual(expDate.getUTCDate(), 10);
    });

    // Verificar los pagos (InstallmentUserPayments)
    userPayments.forEach((payment, index) => {
        assert.ok(payment.idPayment); // Debe tener UUID generado
        assert.strictEqual(payment.paymentDone, false);
        assert.strictEqual(payment.accepted, false);
        assert.strictEqual(payment.paidAmount, 0);
        assert.strictEqual(payment.user.id, 1);
        assert.strictEqual(payment.plannedInstallment.idPI, `123-${index + 1}`);
    });

    console.log("¡Prueba de SpendService ejecutada y aprobada con éxito!");
});
