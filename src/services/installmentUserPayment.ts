import { InstallmentUserPayment } from "../models/InstallmentUserPayment.js";
import { PlannedInstallmentEntity } from "../models/PlannedInstallmentEntity.js";
import { User } from "../models/UserEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { Pagination } from "../utils/pagination.js";
import { NotFoundError, GeneralError } from "../utils/classError.js";
import { createInstallmentUserPaymentDTO } from "../dtos/installmentUserPayment/createInstallmentUserPaymentDTO.js";
import { updateInstallmentUserPaymentDTO } from "../dtos/installmentUserPayment/updateInstallmentUserPaymentDTO.js";
import crypto from "crypto";
import { IsNull } from "typeorm";

export class InstallmentUserPaymentService {
    async findAll(pagination: Pagination): Promise<InstallmentUserPayment[]> {
        return await myDataSource.getRepository(InstallmentUserPayment).find({
            skip: pagination.offset,
            take: pagination.limit,
            relations: { plannedInstallment: { piId: true }, user: true, assumedByUser: true },
        });
    }

    async findOneById(idPayment: string): Promise<InstallmentUserPayment> {
        const payment = await myDataSource.getRepository(InstallmentUserPayment).findOne({
            where: { idPayment },
            relations: { plannedInstallment: { piId: { user: true } }, user: true, assumedByUser: true },
        });
        if (!payment) {
            throw new NotFoundError("InstallmentUserPayment", idPayment as any);
        }
        return payment;
    }

    async findByUser(userId: number, done: boolean | undefined, pagination: Pagination): Promise<InstallmentUserPayment[]> {
        // LÓGICA DE CONSULTA INTELIGENTE (Tu propuesta)
        // O me toca a mí y no la he rechazado Y nadie más la ha asumido
        // O yo la asumí (ya sea por rechazo de otro o porque quise pagarla por él)
        
        let conditions: any[] = [
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

    async create(dto: createInstallmentUserPaymentDTO): Promise<InstallmentUserPayment> {
        const plannedInstallment = await myDataSource.getRepository(PlannedInstallmentEntity).findOne({
            where: { idPI: dto.plannedInstallmentId },
        });
        if (!plannedInstallment) {
            throw new NotFoundError("PlannedInstallment", dto.plannedInstallmentId as any);
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

    async update(idPayment: string, dto: updateInstallmentUserPaymentDTO): Promise<InstallmentUserPayment> {
        const payment = await this.findOneById(idPayment);

        if (dto.accepted !== undefined) {
            payment.accepted = dto.accepted;
        }
        if (dto.paidAmount !== undefined) {
            payment.paidAmount = dto.paidAmount;
        }
        if (dto.paymentDone !== undefined) {
            payment.paymentDone = dto.paymentDone;
        }

        return await myDataSource.getRepository(InstallmentUserPayment).save(payment);
    }

    async delete(idPayment: string): Promise<void> {
        const payment = await this.findOneById(idPayment);
        await myDataSource.getRepository(InstallmentUserPayment).remove(payment);
    }

    // ==========================================
    // NUEVA LÓGICA DE RECHAZO EN UNA SOLA FILA
    // ==========================================
    async rejectPayment(idPayment: string, userId: number): Promise<InstallmentUserPayment> {
        return await myDataSource.transaction(async transactionalEntityManager => {
            const payment = await transactionalEntityManager.findOne(InstallmentUserPayment, {
                where: { idPayment },
                relations: { plannedInstallment: { piId: { user: true } }, user: true, assumedByUser: true }
            });

            if (!payment) {
                throw new NotFoundError("InstallmentUserPayment", idPayment as any);
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

            // 1. Marcar como evidencia de que fue rechazado
            payment.rejected = true;
            
            // 2. Asignar instantáneamente la deuda al creador del gasto maestro
            payment.assumedByUser = payment.plannedInstallment.piId.user;

            await transactionalEntityManager.save(payment);
            return payment;
        });
    }

    async getRejectedPayments(pagination: Pagination, userId?: number): Promise<InstallmentUserPayment[]> {
        const whereClause: any = { rejected: true };
        
        if (userId !== undefined) {
            whereClause.user = { id: userId };
        }

        return await myDataSource.getRepository(InstallmentUserPayment).find({
            where: whereClause,
            skip: pagination.offset,
            take: pagination.limit,
            relations: { plannedInstallment: { piId: true }, user: true, assumedByUser: true },
        });
    }
}
