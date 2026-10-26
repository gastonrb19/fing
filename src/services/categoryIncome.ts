import { Pagination } from "../utils/pagination.js";
import { CategoryIncomeEntity } from "../models/CategoryIncomeEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { GeneralError, NotFoundError } from "../utils/classError.js";
import { createCategoryIncomeDTO } from "../dtos/categoryIncome/createCategoryIncomeDTO.js";
import { updateCategoryIncomeDTO } from "../dtos/categoryIncome/updateCategoryIncomeDTO.js";

export class CategoryIncomeService {
    async findAll(pagination: Pagination): Promise<CategoryIncomeEntity[]> {
        return await myDataSource.getRepository(CategoryIncomeEntity).find({
            order: { name: "ASC" },
            skip: pagination.offset,
            take: pagination.limit,
        });
    }

    async findOneById(id: number): Promise<CategoryIncomeEntity> {
        const categoryIncome = await myDataSource
            .getRepository(CategoryIncomeEntity)
            .findOneBy({ id });
        if (!categoryIncome) {
            throw new NotFoundError("CategoryIncome", id);
        }
        return categoryIncome;
    }

    async create(dto: createCategoryIncomeDTO): Promise<CategoryIncomeEntity> {
        const repo = myDataSource.getRepository(CategoryIncomeEntity);
        const existing = await repo.findOne({
            where: { name: dto.name },
            withDeleted: true,
        });

        if (existing) {
            if (!existing.deletedAt) {
                throw new GeneralError(
                    `CategoryIncome with name ${dto.name} already exist`,
                    400
                );
            }
            await repo.restore(existing.id);
            existing.description = dto.description as string;
            delete existing.deletedAt;
            return await repo.save(existing);
        }

        const newCategoryIncome = new CategoryIncomeEntity();
        Object.assign(newCategoryIncome, dto);
        return await repo.save(newCategoryIncome);
    }

    async update(
        id: number,
        dto: updateCategoryIncomeDTO
    ): Promise<CategoryIncomeEntity> {
        const categoryIncome = await this.findOneById(id);
        const repo = myDataSource.getRepository(CategoryIncomeEntity);

        if (dto.name && dto.name !== categoryIncome.name) {
            const existing = await repo.findOneBy({ name: dto.name });
            if (existing) {
                throw new GeneralError(
                    `CategoryIncome with name ${dto.name} already exist`,
                    400
                );
            }
        }

        Object.assign(categoryIncome, dto);
        return await repo.save(categoryIncome);
    }

    async delete(id: number): Promise<void> {
        const categoryIncome = await this.findOneById(id);
        await myDataSource
            .getRepository(CategoryIncomeEntity)
            .softRemove(categoryIncome);
    }
}
