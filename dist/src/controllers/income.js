import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";
import { GeneralError } from "../utils/classError.js";
export class IncomeController {
    serviceIncome;
    constructor(serviceIncome) {
        this.serviceIncome = serviceIncome;
    }
    findAll = dryFn(async (req, res, next) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const incomes = await this.serviceIncome.findAll({ limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: incomes.length,
            data: incomes,
        });
    });
    findByUser = dryFn(async (req, res, next) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const userId = Number(req.params.id_user);
        const filters = {};
        if (req.query.categoryIncome) {
            filters.categoryIncomeId = Number(req.query.categoryIncome);
        }
        if (req.query.from) {
            filters.from = req.query.from;
        }
        if (req.query.until) {
            filters.until = req.query.until;
        }
        if (req.query.isPayed !== undefined && req.query.isPayed !== "") {
            filters.isPayed = req.query.isPayed === "true";
        }
        const incomes = await this.serviceIncome.findByUser(userId, { limit, offset }, filters);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: incomes.length,
            data: incomes,
        });
    });
    create = dryFn(async (req, res, next) => {
        const newIncome = await this.serviceIncome.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newIncome,
        });
    });
    findOne = dryFn(async (req, res, next) => {
        const income = await this.serviceIncome.findOneById(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: income,
        });
    });
    update = dryFn(async (req, res, next) => {
        if (!req.body.income) {
            throw new GeneralError("Bad request, income not provided.", 400);
        }
        const updatedIncome = await this.serviceIncome.update(Number(req.params.id), req.body.income);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updatedIncome,
        });
    });
    delete = dryFn(async (req, res, next) => {
        await this.serviceIncome.delete(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
//# sourceMappingURL=income.js.map