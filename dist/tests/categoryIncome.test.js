import { test, mock } from "node:test";
import assert from "node:assert";
import { CategoryIncomeService } from "../src/services/categoryIncome.js";
import { CategoryIncomeEntity } from "../src/models/CategoryIncomeEntity.js";
import { myDataSource } from "../src/config/app-data-source.js";
test("CategoryIncomeService CRUD operations", async () => {
    const savedCategories = [];
    mock.method(myDataSource, "getRepository", () => {
        return {
            findOneBy: async (query) => {
                if (query.name === "existing_income_cat") {
                    const c = new CategoryIncomeEntity();
                    c.id = 99;
                    c.name = "existing_income_cat";
                    return c;
                }
                if (query.id === 1) {
                    const c = new CategoryIncomeEntity();
                    c.id = 1;
                    c.name = "Sueldo";
                    return c;
                }
                return null;
            },
            findOne: async (options) => {
                if (options.where?.name === "existing_income_cat") {
                    const c = new CategoryIncomeEntity();
                    c.id = 99;
                    c.name = "existing_income_cat";
                    return c;
                }
                return null;
            },
            find: async () => savedCategories,
            save: async (cat) => {
                if (!cat.id) {
                    cat.id = savedCategories.length + 1;
                }
                savedCategories.push(cat);
                return cat;
            },
            softRemove: async (cat) => {
                cat.deletedAt = new Date();
                return cat;
            },
        };
    });
    const service = new CategoryIncomeService();
    // 1. Crear categoría de ingreso
    const created = await service.create({
        name: "Honorarios",
        description: "Proyectos freelance",
    });
    assert.strictEqual(created.name, "Honorarios");
    assert.strictEqual(created.description, "Proyectos freelance");
    // 2. Duplicado debe fallar
    await assert.rejects(async () => {
        await service.create({ name: "existing_income_cat" });
    }, /already exist/);
    // 3. Obtener por ID
    const found = await service.findOneById(1);
    assert.strictEqual(found.name, "Sueldo");
    // 4. Actualizar
    const updated = await service.update(1, { description: "Sueldo mensual" });
    assert.strictEqual(updated.description, "Sueldo mensual");
    // 5. Soft Delete
    await service.delete(1);
});
//# sourceMappingURL=categoryIncome.test.js.map