import { test, mock } from "node:test";
import assert from "node:assert";
import { IncomeService } from "../src/services/income.js";
import { CategoryIncomeEntity } from "../src/models/CategoryIncomeEntity.js";
import { User } from "../src/models/UserEntity.js";
import { myDataSource } from "../src/config/app-data-source.js";
test("IncomeService CRUD and editing deposited income", async () => {
    const mockUser = new User();
    mockUser.id = 1;
    mockUser.username = "mery";
    const mockCat = new CategoryIncomeEntity();
    mockCat.id = 2;
    mockCat.name = "Sueldo";
    const mockCat2 = new CategoryIncomeEntity();
    mockCat2.id = 3;
    mockCat2.name = "Bono";
    const mockUserService = {
        findOneById: async (id) => {
            if (id === 1)
                return mockUser;
            throw new Error("User not found");
        },
    };
    const mockCategoryIncomeService = {
        findOneById: async (id) => {
            if (id === 2)
                return mockCat;
            if (id === 3)
                return mockCat2;
            throw new Error("CategoryIncome not found");
        },
    };
    let storedIncome = null;
    let fkUpdatedSet = null;
    mock.method(myDataSource, "getRepository", () => {
        return {
            save: async (inc) => {
                if (!inc.id)
                    inc.id = 10;
                storedIncome = inc;
                return inc;
            },
            findOne: async (opts) => {
                if (opts.where?.id === 10 && storedIncome) {
                    return storedIncome;
                }
                return null;
            },
            remove: async (inc) => {
                storedIncome = null;
                return inc;
            },
        };
    });
    mock.method(myDataSource, "createQueryBuilder", () => {
        const qb = {
            update: () => qb,
            set: (val) => {
                fkUpdatedSet = val;
                if (storedIncome && val.categoryIncome) {
                    storedIncome.categoryIncome = val.categoryIncome;
                }
                return qb;
            },
            where: () => qb,
            execute: async () => ({ affected: 1 }),
        };
        return qb;
    });
    const service = new IncomeService(mockUserService, mockCategoryIncomeService);
    // 1. Crear ingreso pendiente por defecto (isPayed = false)
    const created = await service.create({
        name: "Sueldo Octubre",
        amount: 1200000,
        comentary: "Pago fin de mes",
        date: "2026-10-30",
        userId: 1,
        categoryIncomeId: 2,
    });
    assert.strictEqual(created.id, 10);
    assert.strictEqual(created.name, "Sueldo Octubre");
    assert.strictEqual(created.isPayed, false);
    assert.strictEqual(created.date, "2026-10-30");
    // 2. Marcar como depositado y luego volver a editar monto, fecha y categoría (sin bloqueo)
    await service.update(10, { isPayed: true });
    assert.strictEqual(storedIncome.isPayed, true);
    const editedAfterDeposit = await service.update(10, {
        amount: 1250000,
        date: "2026-10-31",
        categoryIncomeId: 3,
    });
    assert.strictEqual(editedAfterDeposit.amount, 1250000);
    assert.strictEqual(editedAfterDeposit.date, "2026-10-31");
    assert.strictEqual(fkUpdatedSet.categoryIncome.id, 3);
    // 3. Eliminar ingreso
    await service.delete(10);
    assert.strictEqual(storedIncome, null);
});
//# sourceMappingURL=income.test.js.map