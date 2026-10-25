import { InstallmentUserPayment } from "../models/InstallmentUserPayment.js";
import { PlannedInstallmentEntity } from "../models/PlannedInstallmentEntity.js";
import { User } from "../models/UserEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { NotFoundError, GeneralError } from "../utils/classError.js";
import crypto from "crypto";
import { IsNull } from "typeorm";
export class InstallmentUserPaymentService {
    async findAll(pagination) {
        return await myDataSource.getRepository(InstallmentUserPayment).find({
            skip: pagination.offset,
            take: pagination.limit,
            relations: { plannedInstallment: { piId: true }, user: true, assumedByUser: true },
        });
    }
    async findOneById(idPayment) {
        const payment = await myDataSource.getRepository(InstallmentUserPayment).findOne({
            where: { idPayment },
            relations: { plannedInstallment: { piId: { user: true } }, user: true, assumedByUser: true },
        });
        if (!payment) {
            throw new NotFoundError("InstallmentUserPayment", idPayment);
        }
        return payment;
    }
    async findByUser(userId, done, pagination) {
        // LÓGICA DE CONSULTA INTELIGENTE (Tu propuesta)
        // O me toca a mí y no la he rechazado Y nadie más la ha asumido
        // O yo la asumí (ya sea por rechazo de otro o porque quise pagarla por él)
        let conditions = [
            { user: { id: userId }, rejected: false, assumedByUser: IsNull() },
            { assumedByUser: { id: userId } }
        ];
        if (done !== undefined) {
            conditions[0].paymentDone = done;
            conditions[1].paymentDone = done;
        }
        return await myDataSource.getRepository(InstallmentUserPayment).find({
            where: conditions,
            skip: pagination.offset,
            take: pagination.limit,
            relations: { plannedInstallment: { piId: true }, user: true, assumedByUser: true },
        });
    }
    async create(dto) {
        const plannedInstallment = await myDataSource.getRepository(PlannedInstallmentEntity).findOne({
            where: { idPI: dto.plannedInstallmentId },
        });
        if (!plannedInstallment) {
            throw new NotFoundError("PlannedInstallment", dto.plannedInstallmentId);
        }
        const user = await myDataSource.getRepository(User).findOneBy({ id: dto.userId });
        if (!user) {
            throw new NotFoundError("User", dto.userId);
        }
        const payment = new InstallmentUserPayment();
        payment.idPayment = dto.idPayment || crypto.randomUUID();
        payment.accepted = dto.accepted;
        payment.paidAmount = dto.paidAmount;
        payment.paymentDone = dto.paymentDone;
        payment.plannedInstallment = plannedInstallment;
        payment.user = user;
        return await myDataSource.getRepository(InstallmentUserPayment).save(payment);
    }
    async update(idPayment, dto) {
        const payment = await this.findOneById(idPayment);
        const updateFields = {};
        if (dto.accepted !== undefined)
            updateFields.accepted = dto.accepted;
        if (dto.paidAmount !== undefined)
            updateFields.paidAmount = dto.paidAmount;
        if (dto.paymentDone !== undefined)
            updateFields.paymentDone = dto.paymentDone;
        // LÓGICA DE REASIGNACIÓN DE AMIGO
        if (dto.userId && dto.userId !== payment.user?.id) {
            const newUser = await myDataSource.getRepository(User).findOneBy({ id: dto.userId });
            if (!newUser)
                throw new NotFoundError("User", dto.userId);
            updateFields.user = newUser;
            updateFields.accepted = false;
            updateFields.rejected = false;
        }
        if (Object.keys(updateFields).length > 0) {
            await myDataSource.createQueryBuilder()
                .update(InstallmentUserPayment)
                .set(updateFields)
                .where("idPayment = :idPayment", { idPayment })
                .execute();
        }
        return await this.findOneById(idPayment);
    }
    async delete(idPayment) {
        const payment = await this.findOneById(idPayment);
        await myDataSource.getRepository(InstallmentUserPayment).remove(payment);
    }
    // ==========================================
    // NUEVA LÓGICA DE RECHAZO EN UNA SOLA FILA
    // ==========================================
    async rejectPayment(idPayment, userId) {
        return await myDataSource.transaction(async (transactionalEntityManager) => {
            const payment = await transactionalEntityManager.findOne(InstallmentUserPayment, {
                where: { idPayment },
                relations: { plannedInstallment: { piId: { user: true } }, user: true, assumedByUser: true }
            });
            if (!payment) {
                throw new NotFoundError("InstallmentUserPayment", idPayment);
            }
            if (payment.user.id !== userId) {
                throw new GeneralError("No tienes permisos para rechazar esta asignación", 403, "FORBIDDEN");
            }
            if (payment.rejected) {
                throw new GeneralError("Este pago ya fue rechazado anteriormente", 400, "BAD_REQUEST");
            }
            if (payment.accepted) {
                throw new GeneralError("No puedes rechazar un pago que ya habías aceptado", 400, "BAD_REQUEST");
            }
            // Forzar el cambio con QueryBuilder según las reglas de TypeORM
            await transactionalEntityManager.createQueryBuilder()
                .update(InstallmentUserPayment)
                .set({
                rejected: true,
                accepted: false,
                assumedByUser: payment.plannedInstallment.piId.user
            })
                .where("idPayment = :idPayment", { idPayment })
                .execute();
            return await transactionalEntityManager.findOne(InstallmentUserPayment, {
                where: { idPayment },
                relations: { plannedInstallment: { piId: { user: true } }, user: true, assumedByUser: true }
            });
        });
    }
    async getRejectedPayments(pagination, filters) {
        const whereClause = { rejected: true };
        if (typeof filters === "number") {
            whereClause.user = { id: filters };
        }
        else if (filters) {
            if (filters.userId !== undefined) {
                whereClause.user = { id: filters.userId };
            }
            if (filters.creatorId !== undefined) {
                whereClause.assumedByUser = { id: filters.creatorId };
            }
        }
        return await myDataSource.getRepository(InstallmentUserPayment).find({
            where: whereClause,
            skip: pagination.offset,
            take: pagination.limit,
            relations: { plannedInstallment: { piId: { user: true } }, user: true, assumedByUser: true },
        });
    }
}
//# sourceMappingURL=installmentUserPayment.js.map