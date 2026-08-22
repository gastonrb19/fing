import { TypeSpendEntity } from "../models/TypeSpendEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { Pagination } from "../utils/pagination.js";
import { NotFoundError } from "../utils/classError.js";
import { createTypeSpendDTO } from "../dtos/typeSpend/createTypeSpendDTO.js";
import { updateTypeSpendDTO } from "../dtos/typeSpend/updateTypeSpendDTO.js";

export class TypeSpendService {
    async findAll(pagination: Pagination): Promise<TypeSpendEntity[]> {
        return await myDataSource.getRepository(TypeSpendEntity).find({
            skip: pagination.offset,
            take: pagination.limit,
        });
    }

    async findOneById(id: number): Promise<TypeSpendEntity> {
        const typeSpend = await myDataSource.getRepository(TypeSpendEntity).findOneBy({ id });
        if (!typeSpend) {
            throw new NotFoundError("TypeSpend", id);
        }
        return typeSpend;
    }

    async create(dto: createTypeSpendDTO): Promise<TypeSpendEntity> {
        const typeSpend = new TypeSpendEntity();
        typeSpend.name = dto.name;
        return await myDataSource.getRepository(TypeSpendEntity).save(typeSpend);
    }

    async update(id: number, dto: updateTypeSpendDTO): Promise<TypeSpendEntity> {
        const typeSpend = await this.findOneById(id);
        if (dto.name !== undefined) {
            typeSpend.name = dto.name;
        }
        return await myDataSource.getRepository(TypeSpendEntity).save(typeSpend);
    }

    async delete(id: number): Promise<void> {
        const typeSpend = await this.findOneById(id);
        await myDataSource.getRepository(TypeSpendEntity).remove(typeSpend);
    }
}
