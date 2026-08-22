import { test, mock } from "node:test";
import assert from "node:assert";
import { PlannedInstallmentService } from "../src/services/plannedInstallment.js";
import { PlannedInstallmentEntity } from "../src/models/PlannedInstallmentEntity.js";
import { SpendEntity } from "../src/models/SpendEntity.js";
import { myDataSource } from "../src/config/app-data-source.js";

test("PlannedInstallmentService CRUD operations", async () => {
    const savedInstallments: PlannedInstallmentEntity[] = [];

    mock.method(myDataSource, "getRepository", (entity: any) => {
        return {
            findOneBy: async (query: any) => {
                if (entity === SpendEntity && query.id === 100) {
                    const spend = new SpendEntity();
                    spend.id = 100;
                    return spend;
                }
                return null;
            },
            findOne: async (options: any) => {
                const idPI = options.where?.idPI;
                if (idPI === "100-1") {
                    const pi = new PlannedInstallmentEntity();
                    pi.idPI = "100-1";
                    pi.amount = 15000;
                    return pi;
                }
                return null;
            },
            find: async (options: any) => {
                // Si filtra por spendId
                if (options?.where?.piId?.id === 100) {
                    return savedInstallments.filter(pi => pi.piId?.id === 100);
                }
                return savedInstallments;
            },
            save: async (pi: PlannedInstallmentEntity) => {
                savedInstallments.push(pi);
                return pi;
            },
            remove: async (pi: PlannedInstallmentEntity) => {
                const idx = savedInstallments.findIndex(p => p.idPI === pi.idPI);
                if (idx !== -1) {
                    savedInstallments.splice(idx, 1);
                }
                return pi;
            }
        };
    });

    const service = new PlannedInstallmentService();

    // 1. Test create
    const dto = {
        idPI: "100-2",
        amount: 20000,
        expirationDate: "2026-09-10",
        availableDate: "2026-09-05",
        spendId: 100
    };

    const newPI = await service.create(dto);
    assert.strictEqual(newPI.idPI, "100-2");
    assert.strictEqual(newPI.amount, 20000);
    assert.strictEqual(newPI.piId.id, 100);

    // 2. Test findOneById
    const pi = await service.findOneById("100-1");
    assert.strictEqual(pi.amount, 15000);

    // 3. Test findBySpend
    const list = await service.findBySpend(100, { limit: 10, offset: 0 });
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0]?.idPI, "100-2");

    console.log("¡Prueba de PlannedInstallmentService aprobada con éxito!");
});
