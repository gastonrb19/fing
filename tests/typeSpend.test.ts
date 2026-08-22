import { test, mock } from "node:test";
import assert from "node:assert";
import { TypeSpendService } from "../src/services/typeSpend.js";
import { TypeSpendEntity } from "../src/models/TypeSpendEntity.js";
import { myDataSource } from "../src/config/app-data-source.js";

test("TypeSpendService CRUD operations", async () => {
    const savedTypes: TypeSpendEntity[] = [];

    mock.method(myDataSource, "getRepository", (entity: any) => {
        return {
            findOneBy: async (query: any) => {
                if (query.id === 1) {
                    const t = new TypeSpendEntity();
                    t.id = 1;
                    t.name = "Gasto";
                    return t;
                }
                return null;
            },
            find: async () => {
                return savedTypes;
            },
            save: async (type: TypeSpendEntity) => {
                if (!type.id) {
                    type.id = savedTypes.length + 1;
                }
                savedTypes.push(type);
                return type;
            },
            remove: async (type: TypeSpendEntity) => {
                const idx = savedTypes.findIndex(t => t.id === type.id);
                if (idx !== -1) {
                    savedTypes.splice(idx, 1);
                }
                return type;
            }
        };
    });

    const service = new TypeSpendService();

    // 1. Test create
    const newType = await service.create({ name: "Ingreso" });
    assert.strictEqual(newType.name, "Ingreso");
    assert.strictEqual(newType.id, 1);

    // 2. Test findOneById
    const type = await service.findOneById(1);
    assert.strictEqual(type.name, "Gasto");

    console.log("¡Prueba de TypeSpendService aprobada con éxito!");
});
