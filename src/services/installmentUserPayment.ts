import { InstallmentUserPayment } from "../models/InstallmentUserPayment.js";
import { PlannedInstallmentEntity } from "../models/PlannedInstallmentEntity.js";
import { User } from "../models/UserEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { Pagination } from "../utils/pagination.js";
import { NotFoundError } from "../utils/classError.js";
import { createInstallmentUserPaymentDTO } from "../dtos/installmentUserPayment/createInstallmentUserPaymentDTO.js";
import { updateInstallmentUserPaymentDTO } from "../dtos/installmentUserPayment/updateInstallmentUserPaymentDTO.js";
import crypto from "crypto";

export class InstallmentUserPaymentService {
    async findAll(pagination: Pagination): Promise<InstallmentUserPayment[]> {
        return await myDataSource.getRepository(InstallmentUserPayment).find({
            skip: pagination.offset,
            take: pagination.limit,
            relations: { plannedInstallment: { piId: true }, user: true },
        });
    }

    async findOneById(idPayment: string): Promise<InstallmentUserPayment> {
        const payment = await myDataSource.getRepository(InstallmentUserPayment).findOne({
            where: { idPayment },
            relations: { plannedInstallment: { piId: true }, user: true },
        });
        if (!payment) {
            throw new NotFoundError("InstallmentUserPayment", idPayment as any);
        }
        return payment;
    }

    async findByUser(userId: number, done: boolean | undefined, pagination: Pagination): Promise<InstallmentUserPayment[]> {
        const whereClause: any = { user: { id: userId } };
        if (done !== undefined) {
            whereClause.paymentDone = done;
        }

        return await myDataSource.getRepository(InstallmentUserPayment).find({
            where: whereClause,
            skip: pagination.offset,
            take: pagination.limit,
            relations: { plannedInstallment: { piId: true }, user: true },
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
        if (dto.plannedInstallmentId !== undefined) {
            const pi = await myDataSource.getRepository(PlannedInstallmentEntity).findOne({
                where: { idPI: dto.plannedInstallmentId },
            });
            if (!pi) {
                throw new NotFoundError("PlannedInstallment", dto.plannedInstallmentId as any);
            }
            payment.plannedInstallment = pi;
        }
        if (dto.userId !== undefined) {
            const user = await myDataSource.getRepository(User).findOneBy({ id: dto.userId });
            if (!user) {
                throw new NotFoundError("User", dto.userId);
            }
            payment.user = user;
        }

        return await myDataSource.getRepository(InstallmentUserPayment).save(payment);
    }

    async delete(idPayment: string): Promise<void> {
        const payment = await this.findOneById(idPayment);
        await myDataSource.getRepository(InstallmentUserPayment).remove(payment);
    }
}
