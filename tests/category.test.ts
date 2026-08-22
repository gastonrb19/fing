import { test, mock } from "node:test";
import assert from "node:assert";
import { CategoryService } from "../src/services/category.js";
import { CategoryEntity } from "../src/models/CategoryEntity.js";
import { myDataSource } from "../src/config/app-data-source.js";

test("CategoryService CRUD operations", async () => {
    const savedCategories: CategoryEntity[] = [];

    mock.method(myDataSource, "getRepository", (entity: any) => {
        return {
            findOneBy: async (query: any) => {
                if (query.name === "existing_category") {
                    const c = new CategoryEntity();
                    c.name = "existing_category";
                    return c;
                }
                if (query.id === 1) {
                    const c = new CategoryEntity();
                    c.id = 1;
                    c.name = "Alimentos";
                    return c;
                }
                return null;
            },
            find: async () => {
                return savedCategories;
            },
            save: async (cat: CategoryEntity) => {
                if (!cat.id) {
                    cat.id = savedCategories.length + 1;
                }
                savedCategories.push(cat);
                return cat;
            },
            remove: async (cat: CategoryEntity) => {
                const idx = savedCategories.findIndex(c => c.id === cat.id);
                if (idx !== -1) {
                    savedCategories.splice(idx, 1);
                }
                return cat;
            }
        };
    });

    const categoryService = new CategoryService();

    // 1. Test create category
    const dto = {
        name: "Servicios",
        description: "Servicios mensuales"
    };

    const newCat = await categoryService.create(dto);
    assert.strictEqual(newCat.name, "Servicios");
    assert.strictEqual(newCat.description, "Servicios mensuales");

    // 2. Test create duplicate fails
    await assert.rejects(async () => {
        await categoryService.create({ name: "existing_category" });
    }, /already exist/);

    // 3. Test findOneById
    const cat = await categoryService.findOneById(1);
    assert.strictEqual(cat.name, "Alimentos");

    // 4. Test delete
    await categoryService.delete(1);
    
    console.log("¡Prueba de CategoryService aprobada con éxito!");
});
