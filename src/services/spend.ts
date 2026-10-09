import { Pagination } from "../utils/pagination.js";
import { SpendEntity } from "../models/SpendEntity.js";
import { TypeSpendEntity } from "../models/TypeSpendEntity.js";
import { PlannedInstallmentEntity } from "../models/PlannedInstallmentEntity.js";
import { InstallmentUserPayment } from "../models/InstallmentUserPayment.js";
import { FriendshipEntity } from "../models/FriendshipEntity.js";
import { User } from "../models/UserEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { NotFoundError, GeneralError } from "../utils/classError.js";
import { createSpendDTO } from "../dtos/spend/createSpendDTO.js";
import { updateSpendDTO } from "../dtos/spend/updateSpendDTO.js";
import { UserService } from "./user.js";
import { SubcategoryService } from "./subcategory.js";
import crypto from "crypto";

export class SpendService {
    private readonly userService: UserService;
    private readonly subcategoryService: SubcategoryService;

    constructor(userService: UserService, subcategoryService: SubcategoryService) {
        this.userService = userService;
        this.subcategoryService = subcategoryService;
    }

    async findAll(pagination: Pagination): Promise<SpendEntity[]> {
        return await myDataSource.getRepository(SpendEntity).find({
            skip: pagination.offset,
            take: pagination.limit,
            relations: { 
                user: true, 
                subcategory: true, 
                type: true,
                plannedInstallments: {
                    fk_installmentUserPayment: {
                        user: true
                    }
                }
            },
            order: {
                plannedInstallments: {
                    availableDate: "ASC"
                }
            },
        });
    }

    async findOneById(id: number): Promise<SpendEntity> {
        const getSpend = await myDataSource.getRepository(SpendEntity).findOne({
            where: { id },
            relations: { 
                user: true, 
                subcategory: {
                    category: true
                }, 
                type: true,
                plannedInstallments: {
                    fk_installmentUserPayment: {
                        user: true
                    }
                }
            },
            order: {
                plannedInstallments: {
                    availableDate: "ASC"
                }
            }
        });
        if(!getSpend){
            throw new NotFoundError('Spend', id);
        }
        return getSpend;
    }

    
    async findByUser(userId: number, pagination: Pagination, filters?: { categoryId?: number, subcategoryId?: number, from?: string, until?: string, done?: boolean }): Promise<SpendEntity[]> {
        const qb = myDataSource.getRepository(SpendEntity).createQueryBuilder("spend")
            .leftJoinAndSelect("spend.user", "user")
            .leftJoinAndSelect("spend.subcategory", "subcategory")
            .leftJoinAndSelect("subcategory.category", "category")
            .leftJoinAndSelect("spend.type", "type")
            .where("spend.userId = :userId", { userId });

        if (filters?.categoryId) {
            qb.andWhere("category.id = :categoryId", { categoryId: filters.categoryId });
        }
        if (filters?.subcategoryId) {
            qb.andWhere("subcategory.id = :subcategoryId", { subcategoryId: filters.subcategoryId });
        }
        if (filters?.from) {
            qb.andWhere("spend.startPayment >= :from", { from: filters.from });
        }
        if (filters?.until) {
            qb.andWhere("spend.startPayment <= :until", { until: filters.until });
        }
        
        // Filtro complejo por estado de pago cruzando con PlannedInstallment y InstallmentUserPayment
        if (filters?.done !== undefined) {
            if (filters.done === true) {
                // Saldados: NO existe ninguna cuota pendiente (paymentDone = false) para este gasto y este usuario
                qb.andWhere("NOT EXISTS (SELECT 1 FROM \"INSTALLMENTUSERPAYMENT\" iup INNER JOIN \"PLANNEDINSTALLMENT\" spi ON spi.\"idPI\" = iup.\"plannedInstallmentId\" WHERE spi.\"spendId\" = spend.id AND iup.\"userId\" = :userId AND iup.\"paymentDone\" = false)", { userId });
            } else {
                // Pendientes: Existe al menos una cuota pendiente
                qb.andWhere("EXISTS (SELECT 1 FROM \"INSTALLMENTUSERPAYMENT\" iup INNER JOIN \"PLANNEDINSTALLMENT\" spi ON spi.\"idPI\" = iup.\"plannedInstallmentId\" WHERE spi.\"spendId\" = spend.id AND iup.\"userId\" = :userId AND iup.\"paymentDone\" = false)", { userId });
            }
        }

        const spends = await qb
            .skip(pagination.offset)
            .take(pagination.limit)
            .orderBy("spend.startPayment", "DESC")
            .getMany();

        if (spends.length > 0) {
            const spendIds = spends.map(s => s.id);
            const counts = await myDataSource.getRepository("INSTALLMENTUSERPAYMENT")
                .createQueryBuilder("iup")
                .innerJoin("PLANNEDINSTALLMENT", "pi", "pi.\"idPI\" = iup.\"plannedInstallmentId\"")
                .select("pi.\"spendId\"", "spendId")
                .addSelect("COUNT(iup.\"idPayment\")", "count")
                .where("pi.\"spendId\" IN (:...spendIds)", { spendIds })
                .andWhere("iup.\"userId\" = :userId", { userId })
                .andWhere("iup.\"paymentDone\" = true")
                .groupBy("pi.\"spendId\"")
                .getRawMany();

            const countMap = new Map();
            counts.forEach(c => countMap.set(c.spendId, Number(c.count)));

            spends.forEach(spend => {
                (spend as any).paidInstallments = countMap.get(spend.id) || 0;
            });
        }

        return spends;
    }

    async findByUserAndSubcategory(userId: number, subcategoryId: number, pagination: Pagination): Promise<SpendEntity[]> {
        await this.subcategoryService.findOneById(subcategoryId);

        return await myDataSource.getRepository(SpendEntity).find({
            where: {
                user: { id: userId },
                subcategory: { id: subcategoryId },
            },
            skip: pagination.offset,
            take: pagination.limit,
            relations: { user: true, subcategory: true, type: true },
        });
    }

    async create(dto: createSpendDTO): Promise<SpendEntity> {
        const user = await this.userService.findOneById(dto.userId);
        const subcategory = await this.subcategoryService.findOneById(dto.subcategoryId);
        const typeSpend = await myDataSource.getRepository(TypeSpendEntity).findOneBy({ id: dto.fkTypeSpend });
        if(!typeSpend){
            throw new NotFoundError('TypeSpend', dto.fkTypeSpend);
        }

        let splits = dto.participants;
        if (!splits || splits.length === 0) {
            splits = [{ userId: dto.userId, percentage: 100 }];
        }

        // 1. Validar que todos los participantes existan y sean amigos del creador (si no son él mismo)
        const participantUsers = new Map<number, User>();
        participantUsers.set(user.id, user);

        const friendshipRepo = myDataSource.getRepository(FriendshipEntity);

        for (const split of splits) {
            if (split.userId !== dto.userId) {
                const isFriend = await friendshipRepo.findOneBy({ userId: dto.userId, friendId: split.userId });
                if (!isFriend) {
                    throw new GeneralError(`El usuario con ID ${split.userId} no es amigo del creador.`, 400, "BAD_REQUEST");
                }
                const splitUser = await this.userService.findOneById(split.userId);
                participantUsers.set(splitUser.id, splitUser);
            }
        }

        const newSpend = new SpendEntity();
        newSpend.name = dto.name;
        newSpend.amount = dto.amount;
        newSpend.user = user;
        newSpend.subcategory = subcategory;
        newSpend.type = typeSpend;
        newSpend.minDayToPayment = dto.minDayToPayment;
        newSpend.maxDayToPayment = dto.maxDayToPayment ?? dto.minDayToPayment;
        newSpend.totalInstallment = dto.totalInstallment ?? 1;
        newSpend.startPayment = dto.startPayment ? new Date(dto.startPayment) : new Date();

        return await myDataSource.transaction(async (transactionalEntityManager) => {
            const savedSpend = await transactionalEntityManager.save(newSpend);

            const N = savedSpend.totalInstallment;
            const amountPerInstallment = Math.round((savedSpend.amount / N) * 100) / 100;
            const startPaymentDate = new Date(savedSpend.startPayment);

            const getInstallmentDate = (startDate: Date, monthsToAdd: number, targetDay: number): Date => {
                const d = new Date(startDate);
                d.setUTCDate(1);
                d.setUTCMonth(d.getUTCMonth() + monthsToAdd);
                const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
                d.setUTCDate(Math.min(targetDay, lastDay));
                d.setUTCHours(0, 0, 0, 0);
                return d;
            };

            for (let i = 0; i < N; i++) {
                const pi = new PlannedInstallmentEntity();
                pi.idPI = `${savedSpend.id}-${i + 1}`;
                pi.amount = amountPerInstallment;
                pi.availableDate = getInstallmentDate(startPaymentDate, i, savedSpend.minDayToPayment);
                pi.expirationDate = getInstallmentDate(startPaymentDate, i, savedSpend.maxDayToPayment);
                pi.piId = savedSpend;

                const savedPI = await transactionalEntityManager.save(pi);

                // Dividimos la cuota según los porcentajes de los participantes
                for (const split of splits) {
                    const payment = new InstallmentUserPayment();
                    payment.idPayment = crypto.randomUUID();
                    payment.accepted = false;
                    
                    // Cálculo de asignación exacta
                    const userAssignedAmount = Math.round((amountPerInstallment * (split.percentage / 100)) * 100) / 100;
                    
                    payment.assignedAmount = userAssignedAmount;
                    payment.paidAmount = 0;
                    payment.paymentDone = false;
                        payment.paidAmount = 0;
                    payment.plannedInstallment = savedPI;
                    payment.user = participantUsers.get(split.userId)!;

                    await transactionalEntityManager.save(payment);
                }
            }

            return savedSpend;
        });
    }

    async update(id: number, updateSpendDTO: updateSpendDTO): Promise<SpendEntity> {
        const spend = await this.findOneById(id);

        const hasPaid = spend.plannedInstallments?.some(pi => 
            pi.fk_installmentUserPayment?.some(p => p.paymentDone)
        );
        if (hasPaid) {
            throw new Error("No se puede editar un gasto que ya tiene cuotas pagadas.");
        }

        if(updateSpendDTO.userId){
            spend.user = await this.userService.findOneById(updateSpendDTO.userId);
        }
        if(updateSpendDTO.subcategoryId){
            spend.subcategory = await this.subcategoryService.findOneById(updateSpendDTO.subcategoryId);
        }
        if(updateSpendDTO.fkTypeSpend){
            const typeSpend = await myDataSource.getRepository(TypeSpendEntity).findOneBy({ id: updateSpendDTO.fkTypeSpend });
            if(!typeSpend){
                throw new NotFoundError('TypeSpend', updateSpendDTO.fkTypeSpend);
            }
            spend.type = typeSpend;
        }
        if(updateSpendDTO.name !== undefined){
            spend.name = updateSpendDTO.name;
        }
        
        let needsRecalculation = false;
        
        if (updateSpendDTO.amount !== undefined && updateSpendDTO.amount !== spend.amount) {
            if (updateSpendDTO.amount <= 0) throw new Error("El monto debe ser mayor a cero.");
            spend.amount = updateSpendDTO.amount;
            needsRecalculation = true;
        }
        
        if (updateSpendDTO.totalInstallment !== undefined && updateSpendDTO.totalInstallment !== spend.totalInstallment) {
            if (updateSpendDTO.totalInstallment <= 0) throw new Error("La cantidad de cuotas debe ser mayor a cero.");
            spend.totalInstallment = updateSpendDTO.totalInstallment;
            needsRecalculation = true;
        }

        if(updateSpendDTO.minDayToPayment !== undefined){
            if (updateSpendDTO.minDayToPayment <= 0 || updateSpendDTO.minDayToPayment > 31) throw new Error("Día de pago inválido.");
            spend.minDayToPayment = updateSpendDTO.minDayToPayment;
        }
        if(updateSpendDTO.maxDayToPayment !== undefined){
            spend.maxDayToPayment = updateSpendDTO.maxDayToPayment;
        }

        if (needsRecalculation) {
            await myDataSource.transaction(async (tx) => {
                const oldInstallments = spend.plannedInstallments || [];
                const participants = [];
                
                if (oldInstallments.length > 0) {
                    const firstQuota = oldInstallments[0]!;
                    const quotaTotalAmount = firstQuota.amount || (spend.amount / oldInstallments.length);
                    
                    for (const payment of firstQuota.fk_installmentUserPayment || []) {
                        const percentage = payment.assignedAmount / quotaTotalAmount;
                        participants.push({ user: payment.user, percentage });
                    }
                }
                
                if (participants.length === 0) {
                    participants.push({ user: spend.user, percentage: 1 });
                }

                const paymentRepo = tx.getRepository(InstallmentUserPayment);
                const plannedRepo = tx.getRepository(PlannedInstallmentEntity);
                
                for (const pi of oldInstallments) {
                    if (pi.fk_installmentUserPayment) {
                        await paymentRepo.remove(pi.fk_installmentUserPayment);
                    }
                    await plannedRepo.remove(pi);
                }

                const N = spend.totalInstallment;
                const newAmountPerInstallment = Math.round((spend.amount / N) * 100) / 100;
                
                spend.plannedInstallments = [];

                for (let i = 0; i < N; i++) {
                    const pi = new PlannedInstallmentEntity();
                    pi.idPI = `${spend.id}-${i + 1}`;
                    pi.amount = newAmountPerInstallment;
                    pi.piId = spend;
                    
                    let paymentDate = new Date(spend.startPayment);
                    paymentDate.setMonth(paymentDate.getMonth() + i);
                    paymentDate.setDate(spend.minDayToPayment);
                    pi.expirationDate = paymentDate;
                    pi.availableDate = paymentDate;
                    
                    const savedPI = await plannedRepo.save(pi);
                    
                    const newPayments = [];
                    for (const p of participants) {
                        const payment = new InstallmentUserPayment();
                        payment.idPayment = crypto.randomUUID();
                        payment.plannedInstallment = savedPI;
                        payment.assignedAmount = Math.round(newAmountPerInstallment * p.percentage * 100) / 100;
                        payment.paymentDone = false;
                        payment.paidAmount = 0;
                        payment.accepted = p.user.id === spend.user.id; // El creador acepta automáticamente su deuda
                        payment.rejected = false;
                        payment.user = p.user;
                        const savedPayment = await paymentRepo.save(payment);
                        newPayments.push(savedPayment);
                    }
                    savedPI.fk_installmentUserPayment = newPayments;
                    spend.plannedInstallments.push(savedPI);
                }
            });
        }

        await myDataSource.getRepository(SpendEntity).save(spend);
        return this.findOneById(id);
    }

    async delete(id: number): Promise<void> {
        const spend = await this.findOneById(id);
        await myDataSource.getRepository(SpendEntity).remove(spend);
    }
}
