import { test, mock } from "node:test";
import assert from "node:assert";
import { SubcategoryService } from "../src/services/subcategory.js";
import { SubcategoryEntity } from "../src/models/SubcategoryEntity.js";
import { CategoryEntity } from "../src/models/CategoryEntity.js";
import { myDataSource } from "../src/config/app-data-source.js";

test("SubcategoryService CRUD operations", async () => {
    const savedSubcategories: SubcategoryEntity[] = [];

    mock.method(myDataSource, "getRepository", (entity: any) => {
        return {
            findOneBy: async (query: any) => {
                if (entity === SubcategoryEntity) {
                    if (query.name === "existing_sub") {
                        const s = new SubcategoryEntity();
                        s.name = "existing_sub";
                        return s;
                    }
                    if (query.id === 10) {
                        const s = new SubcategoryEntity();
                        s.id = 10;
                        s.name = "Luz";
                        return s;
                    }
                }
                if (entity === CategoryEntity) {
                    if (query.id === 1) {
                        const c = new CategoryEntity();
                        c.id = 1;
                        c.name = "Servicios";
                        return c;
                    }
                }
                return null;
            },
            findOne: async (options: any) => {
                const id = options.where?.id;
                if (id === 10) {
                    const s = new SubcategoryEntity();
                    s.id = 10;
                    s.name = "Luz";
                    return s;
                }
                return null;
            },
            find: async () => {
                return savedSubcategories;
            },
            save: async (sub: SubcategoryEntity) => {
                if (!sub.id) {
                    sub.id = savedSubcategories.length + 10;
                }
                savedSubcategories.push(sub);
                return sub;
            },
            remove: async (sub: SubcategoryEntity) => {
                const idx = savedSubcategories.findIndex(s => s.id === sub.id);
                if (idx !== -1) {
                    savedSubcategories.splice(idx, 1);
                }
                return sub;
            }
        };
    });

    const mockCategoryService: any = {
        findOneById: async (id: number) => {
            if (id === 1) {
                const c = new CategoryEntity();
                c.id = 1;
                return c;
            }
            throw new Error("Category not found");
        }
    };

    const subcategoryService = new SubcategoryService(mockCategoryService);

    // 1. Test create subcategory
    const dto = {
        name: "Agua",
        description: "Servicio de agua",
        categoryId: 1
    };

    const newSub = await subcategoryService.create(dto);
    assert.strictEqual(newSub.name, "Agua");
    assert.strictEqual(newSub.description, "Servicio de agua");

    // 2. Test create duplicate fails
    await assert.rejects(async () => {
        await subcategoryService.create({ name: "existing_sub", categoryId: 1 });
    }, /already exist/);

    // 3. Test findOneById
    const sub = await subcategoryService.findOneById(10);
    assert.strictEqual(sub.name, "Luz");

    console.log("¡Prueba de SubcategoryService aprobada con éxito!");
});
