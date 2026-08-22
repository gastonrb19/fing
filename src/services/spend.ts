import { Pagination } from "../utils/pagination.js";
import { SpendEntity } from "../models/SpendEntity.js";
import { TypeSpendEntity } from "../models/TypeSpendEntity.js";
import { PlannedInstallmentEntity } from "../models/PlannedInstallmentEntity.js";
import { InstallmentUserPayment } from "../models/InstallmentUserPayment.js";
import { myDataSource } from "../config/app-data-source.js";
import { NotFoundError } from "../utils/classError.js";
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
            relations: { user: true, subcategory: true, type: true },
        });
    }

    async findOneById(id: number): Promise<SpendEntity> {
        const getSpend = await myDataSource.getRepository(SpendEntity).findOne({
            where: { id },
            relations: { user: true, subcategory: true, type: true },
        });
        if(!getSpend){
            throw new NotFoundError('Spend', id);
        }
        return getSpend;
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

        // Perform transactional creation of Spend, PlannedInstallments and InstallmentUserPayments
        return await myDataSource.transaction(async (transactionalEntityManager) => {
            const savedSpend = await transactionalEntityManager.save(newSpend);

            const N = savedSpend.totalInstallment;
            const amountPerInstallment = Math.round((savedSpend.amount / N) * 100) / 100;
            const startPaymentDate = new Date(savedSpend.startPayment);

            // Helper to secure date calculation without month rollovers (UTC safe)
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

                // Create associated InstallmentUserPayment pending record
                const payment = new InstallmentUserPayment();
                payment.idPayment = crypto.randomUUID();
                payment.accepted = false;
                payment.paidAmount = 0;
                payment.paymentDone = false;
                payment.plannedInstallment = savedPI;
                payment.user = user;

                await transactionalEntityManager.save(payment);
            }

            return savedSpend;
        });
    }

    async update(id: number, updateSpendDTO: updateSpendDTO): Promise<SpendEntity> {
        const spend = await this.findOneById(id);

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
        if(updateSpendDTO.amount !== undefined){
            spend.amount = updateSpendDTO.amount;
        }
        if(updateSpendDTO.minDayToPayment !== undefined){
            spend.minDayToPayment = updateSpendDTO.minDayToPayment;
        }
        if(updateSpendDTO.maxDayToPayment !== undefined){
            spend.maxDayToPayment = updateSpendDTO.maxDayToPayment;
        }
        if(updateSpendDTO.totalInstallment !== undefined){
            spend.totalInstallment = updateSpendDTO.totalInstallment;
        }
        if(updateSpendDTO.startPayment !== undefined){
            spend.startPayment = new Date(updateSpendDTO.startPayment);
        }

        return await myDataSource.getRepository(SpendEntity).save(spend);
    }

    async delete(id: number): Promise<void> {
        const spend = await this.findOneById(id);
        await myDataSource.getRepository(SpendEntity).remove(spend);
    }
}
