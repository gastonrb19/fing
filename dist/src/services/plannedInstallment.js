import { PlannedInstallmentEntity } from "../models/PlannedInstallmentEntity.js";
import { SpendEntity } from "../models/SpendEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { NotFoundError } from "../utils/classError.js";
export class PlannedInstallmentService {
    async findAll(pagination) {
        return await myDataSource.getRepository(PlannedInstallmentEntity).find({
            skip: pagination.offset,
            take: pagination.limit,
            relations: { piId: true },
        });
    }
    async findOneById(idPI) {
        const installment = await myDataSource.getRepository(PlannedInstallmentEntity).findOne({
            where: { idPI },
            relations: { piId: true },
        });
        if (!installment) {
            throw new NotFoundError("PlannedInstallment", idPI);
        }
        return installment;
    }
    async findBySpend(spendId, pagination) {
        return await myDataSource.getRepository(PlannedInstallmentEntity).find({
            where: { piId: { id: spendId } },
            skip: pagination.offset,
            take: pagination.limit,
            relations: { piId: true },
        });
    }
    async create(dto) {
        const spend = await myDataSource.getRepository(SpendEntity).findOneBy({ id: dto.spendId });
        if (!spend) {
            throw new NotFoundError("Spend", dto.spendId);
        }
        const installment = new PlannedInstallmentEntity();
        installment.idPI = dto.idPI;
        installment.amount = dto.amount;
        installment.expirationDate = new Date(dto.expirationDate);
        installment.availableDate = new Date(dto.availableDate);
        installment.piId = spend;
        return await myDataSource.getRepository(PlannedInstallmentEntity).save(installment);
    }
    async update(idPI, dto) {
        const installment = await this.findOneById(idPI);
        if (dto.amount !== undefined) {
            installment.amount = dto.amount;
        }
        if (dto.expirationDate !== undefined) {
            installment.expirationDate = new Date(dto.expirationDate);
        }
        if (dto.availableDate !== undefined) {
            installment.availableDate = new Date(dto.availableDate);
        }
        if (dto.spendId !== undefined) {
            const spend = await myDataSource.getRepository(SpendEntity).findOneBy({ id: dto.spendId });
            if (!spend) {
                throw new NotFoundError("Spend", dto.spendId);
            }
            installment.piId = spend;
        }
        return await myDataSource.getRepository(PlannedInstallmentEntity).save(installment);
    }
    async delete(idPI) {
        const installment = await this.findOneById(idPI);
        await myDataSource.getRepository(PlannedInstallmentEntity).remove(installment);
    }
}
//# sourceMappingURL=plannedInstallment.js.map