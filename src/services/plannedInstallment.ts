import { PlannedInstallmentEntity } from "../models/PlannedInstallmentEntity.js";
import { SpendEntity } from "../models/SpendEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { Pagination } from "../utils/pagination.js";
import { NotFoundError } from "../utils/classError.js";
import { createPlannedInstallmentDTO } from "../dtos/plannedInstallment/createPlannedInstallmentDTO.js";
import { updatePlannedInstallmentDTO } from "../dtos/plannedInstallment/updatePlannedInstallmentDTO.js";

export class PlannedInstallmentService {
    async findAll(pagination: Pagination): Promise<PlannedInstallmentEntity[]> {
        return await myDataSource.getRepository(PlannedInstallmentEntity).find({
            skip: pagination.offset,
            take: pagination.limit,
            relations: { piId: true },
        });
    }

    async findOneById(idPI: string): Promise<PlannedInstallmentEntity> {
        const installment = await myDataSource.getRepository(PlannedInstallmentEntity).findOne({
            where: { idPI },
            relations: { piId: true },
        });
        if (!installment) {
            throw new NotFoundError("PlannedInstallment", idPI as any);
        }
        return installment;
    }

    async findBySpend(spendId: number, pagination: Pagination): Promise<PlannedInstallmentEntity[]> {
        return await myDataSource.getRepository(PlannedInstallmentEntity).find({
            where: { piId: { id: spendId } },
            skip: pagination.offset,
            take: pagination.limit,
            relations: { piId: true },
        });
    }

    async create(dto: createPlannedInstallmentDTO): Promise<PlannedInstallmentEntity> {
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

    async update(idPI: string, dto: updatePlannedInstallmentDTO): Promise<PlannedInstallmentEntity> {
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

    async delete(idPI: string): Promise<void> {
        const installment = await this.findOneById(idPI);
        await myDataSource.getRepository(PlannedInstallmentEntity).remove(installment);
    }
}
