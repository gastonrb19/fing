import { IncomeEntity } from "../models/IncomeEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { NotFoundError, GeneralError } from "../utils/classError.js";
export class IncomeService {
    userService;
    categoryIncomeService;
    constructor(userService, categoryIncomeService) {
        this.userService = userService;
        this.categoryIncomeService = categoryIncomeService;
    }
    normalizeDate(date) {
        if (typeof date === "string") {
            return date.split("T")[0] || date;
        }
        return date;
    }
    async findAll(pagination) {
        return await myDataSource.getRepository(IncomeEntity).find({
            skip: pagination.offset,
            take: pagination.limit,
            relations: {
                user: true,
                categoryIncome: true,
            },
            order: {
                date: "DESC",
            },
        });
    }
    async findOneById(id) {
        const income = await myDataSource.getRepository(IncomeEntity).findOne({
            where: { id },
            withDeleted: true,
            relations: {
                user: true,
                categoryIncome: true,
            },
        });
        if (!income) {
            throw new NotFoundError("Income", id);
        }
        return income;
    }
    async findByUser(userId, pagination, filters) {
        const qb = myDataSource
            .getRepository(IncomeEntity)
            .createQueryBuilder("income")
            .withDeleted()
            .leftJoinAndSelect("income.user", "user")
            .leftJoinAndSelect("income.categoryIncome", "categoryIncome")
            .where("income.userId = :userId", { userId });
        if (filters?.categoryIncomeId) {
            qb.andWhere("categoryIncome.id = :categoryIncomeId", {
                categoryIncomeId: filters.categoryIncomeId,
            });
        }
        if (filters?.from) {
            qb.andWhere("income.date >= :from", { from: filters.from });
        }
        if (filters?.until) {
            qb.andWhere("income.date <= :until", { until: filters.until });
        }
        if (filters?.isPayed !== undefined) {
            qb.andWhere("income.isPayed = :isPayed", {
                isPayed: filters.isPayed,
            });
        }
        return await qb
            .skip(pagination.offset)
            .take(pagination.limit)
            .orderBy("income.date", "DESC")
            .getMany();
    }
    async create(dto) {
        if (dto.amount <= 0) {
            throw new GeneralError("El monto debe ser mayor a cero.", 400);
        }
        const user = await this.userService.findOneById(dto.userId);
        const categoryIncome = await this.categoryIncomeService.findOneById(dto.categoryIncomeId);
        const newIncome = new IncomeEntity();
        newIncome.name = dto.name;
        newIncome.amount = dto.amount;
        newIncome.comentary = (dto.comentary ?? null);
        newIncome.date = this.normalizeDate(dto.date);
        newIncome.isPayed = dto.isPayed ?? false;
        newIncome.user = user;
        newIncome.categoryIncome = categoryIncome;
        return await myDataSource.getRepository(IncomeEntity).save(newIncome);
    }
    async update(id, dto) {
        const income = await this.findOneById(id);
        if (dto.amount !== undefined) {
            if (dto.amount <= 0) {
                throw new GeneralError("El monto debe ser mayor a cero.", 400);
            }
            income.amount = dto.amount;
        }
        if (dto.name !== undefined) {
            income.name = dto.name;
        }
        if (dto.comentary !== undefined) {
            income.comentary = dto.comentary;
        }
        if (dto.date !== undefined) {
            income.date = this.normalizeDate(dto.date);
        }
        if (dto.isPayed !== undefined) {
            income.isPayed = dto.isPayed;
        }
        await myDataSource.getRepository(IncomeEntity).save(income);
        // Regla #7: Uso obligatorio de QueryBuilder para actualizar llaves foráneas
        const fkUpdates = {};
        if (dto.userId !== undefined) {
            fkUpdates.user = await this.userService.findOneById(dto.userId);
        }
        if (dto.categoryIncomeId !== undefined) {
            fkUpdates.categoryIncome =
                await this.categoryIncomeService.findOneById(dto.categoryIncomeId);
        }
        if (Object.keys(fkUpdates).length > 0) {
            await myDataSource
                .createQueryBuilder()
                .update(IncomeEntity)
                .set(fkUpdates)
                .where("id = :id", { id })
                .execute();
        }
        return await this.findOneById(id);
    }
    async delete(id) {
        const income = await this.findOneById(id);
        await myDataSource.getRepository(IncomeEntity).remove(income);
    }
}
//# sourceMappingURL=income.js.map