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
        const incomes = req.user?.id
            ? await this.serviceIncome.findByUser(req.user.id, { limit, offset })
            : await this.serviceIncome.findAll({ limit, offset });
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
        if (req.user?.id && req.user.id !== userId) {
            throw new GeneralError("No tienes permiso para consultar los ingresos de otro usuario.", 403);
        }
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
        if (req.user?.id && Number(req.body.userId) !== req.user.id) {
            throw new GeneralError("No puedes registrar ingresos a nombre de otro usuario.", 403);
        }
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
        if (req.user?.id && income.user?.id !== req.user.id) {
            throw new GeneralError("No tienes permiso para visualizar este ingreso.", 403);
        }
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
        const id = Number(req.params.id);
        const existing = await this.serviceIncome.findOneById(id);
        if (req.user?.id && existing.user?.id !== req.user.id) {
            throw new GeneralError("No tienes permiso para editar este ingreso.", 403);
        }
        if (req.user?.id && req.body.income.userId && Number(req.body.income.userId) !== req.user.id) {
            throw new GeneralError("No puedes reasignar un ingreso a otro usuario.", 403);
        }
        const updatedIncome = await this.serviceIncome.update(id, req.body.income);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updatedIncome,
        });
    });
    delete = dryFn(async (req, res, next) => {
        const id = Number(req.params.id);
        const existing = await this.serviceIncome.findOneById(id);
        if (req.user?.id && existing.user?.id !== req.user.id) {
            throw new GeneralError("No tienes permiso para eliminar este ingreso.", 403);
        }
        await this.serviceIncome.delete(id);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
//# sourceMappingURL=income.js.map