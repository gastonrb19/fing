import { TypeSpendEntity } from "../models/TypeSpendEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { NotFoundError } from "../utils/classError.js";
export class TypeSpendService {
    async findAll(pagination) {
        return await myDataSource.getRepository(TypeSpendEntity).find({
            skip: pagination.offset,
            take: pagination.limit,
        });
    }
    async findOneById(id) {
        const typeSpend = await myDataSource.getRepository(TypeSpendEntity).findOneBy({ id });
        if (!typeSpend) {
            throw new NotFoundError("TypeSpend", id);
        }
        return typeSpend;
    }
    async create(dto) {
        const typeSpend = new TypeSpendEntity();
        typeSpend.name = dto.name;
        return await myDataSource.getRepository(TypeSpendEntity).save(typeSpend);
    }
    async update(id, dto) {
        const typeSpend = await this.findOneById(id);
        if (dto.name !== undefined) {
            typeSpend.name = dto.name;
        }
        return await myDataSource.getRepository(TypeSpendEntity).save(typeSpend);
    }
    async delete(id) {
        const typeSpend = await this.findOneById(id);
        await myDataSource.getRepository(TypeSpendEntity).remove(typeSpend);
    }
}
//# sourceMappingURL=typeSpend.js.map