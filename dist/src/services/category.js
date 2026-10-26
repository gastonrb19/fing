import { CategoryEntity } from "../models/CategoryEntity.js";
import { SubcategoryEntity } from "../models/SubcategoryEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { GeneralError, NotFoundError } from "../utils/classError.js";
export class CategoryService {
    async findAll(pagination) {
        return await myDataSource.getRepository(CategoryEntity).find({
            order: { name: "ASC" },
            skip: pagination.offset,
            take: pagination.limit,
        });
    }
    async findOneById(id) {
        const getCatgory = await myDataSource.getRepository(CategoryEntity).findOneBy({ id });
        if (!getCatgory) {
            throw new NotFoundError('Category', id);
        }
        return getCatgory;
    }
    async create(createCategoryDTO) {
        const repo = myDataSource.getRepository(CategoryEntity);
        // Verificar si existe (incluyendo registros con soft-delete por restricción UNIQUE en BD)
        const existing = await repo.findOne({
            where: { name: createCategoryDTO.name },
            withDeleted: true,
        });
        if (existing) {
            if (!existing.deletedAt) {
                throw new GeneralError(`Category with name ${createCategoryDTO.name} already exist`, 400);
            }
            await repo.restore(existing.id);
            existing.description = createCategoryDTO.description;
            delete existing.deletedAt;
            return await repo.save(existing);
        }
        const newCategory = new CategoryEntity();
        Object.assign(newCategory, createCategoryDTO);
        return await repo.save(newCategory);
    }
    async update(id, updateCategoryDTO) {
        const category = await this.findOneById(id);
        Object.assign(category, updateCategoryDTO);
        return await myDataSource.getRepository(CategoryEntity).save(category);
    }
    async delete(id) {
        const category = await this.findOneById(id);
        await myDataSource.getRepository(SubcategoryEntity).softDelete({ category: { id: category.id } });
        await myDataSource.getRepository(CategoryEntity).softRemove(category);
    }
}
//# sourceMappingURL=category.js.map