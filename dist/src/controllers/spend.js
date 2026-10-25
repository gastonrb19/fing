import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";
import { GeneralError } from "../utils/classError.js";
export class SpendController {
    serviceSpend;
    constructor(serviceSpend) {
        this.serviceSpend = serviceSpend;
    }
    findAll = dryFn(async (req, res, next) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const spends = req.user?.id
            ? await this.serviceSpend.findByUser(req.user.id, { limit, offset })
            : await this.serviceSpend.findAll({ limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: spends.length,
            data: spends,
        });
    });
    // GET /users/:id_user/spends (con soporte para filtros de query)
    findByUserAndSubcategory = dryFn(async (req, res, next) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const userId = Number(req.params.id_user);
        if (req.user?.id && req.user.id !== userId) {
            throw new GeneralError("No tienes permiso para consultar los gastos de otro usuario.", 403);
        }
        // Parseo de filtros
        const filters = {};
        if (req.query.category)
            filters.categoryId = Number(req.query.category);
        if (req.query.subcategory)
            filters.subcategoryId = Number(req.query.subcategory);
        if (req.query.from)
            filters.from = req.query.from;
        if (req.query.until)
            filters.until = req.query.until;
        if (req.query.done !== undefined) {
            filters.done = req.query.done === 'true';
        }
        if (req.query.role) {
            filters.role = req.query.role;
        }
        const spends = await this.serviceSpend.findByUser(userId, { limit, offset }, filters);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: spends.length,
            data: spends,
        });
    });
    create = dryFn(async (req, res, next) => {
        if (req.user?.id && Number(req.body.userId) !== req.user.id) {
            throw new GeneralError("No puedes registrar gastos a nombre de otro usuario.", 403);
        }
        const newSpend = await this.serviceSpend.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newSpend,
        });
    });
    findOne = dryFn(async (req, res, next) => {
        const spend = await this.serviceSpend.findOneById(Number(req.params.id));
        if (req.user?.id) {
            const isOwner = spend.user?.id === req.user.id;
            const isParticipant = spend.plannedInstallments?.some((pi) => pi.fk_installmentUserPayment?.some((p) => p.user?.id === req.user?.id));
            if (!isOwner && !isParticipant) {
                throw new GeneralError("No tienes permiso para visualizar este gasto.", 403);
            }
        }
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: spend,
        });
    });
    update = dryFn(async (req, res, next) => {
        if (!req.body.spend) {
            throw new GeneralError("Bad request, all fields for spend are required. (spend not provided)", 400);
        }
        const id = Number(req.params.id);
        if (req.user?.id) {
            const existing = await this.serviceSpend.findOneById(id);
            if (existing.user?.id !== req.user.id) {
                throw new GeneralError("Solo el creador del gasto puede editarlo.", 403);
            }
        }
        const updatedSpend = await this.serviceSpend.update(id, req.body.spend);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updatedSpend,
        });
    });
    delete = dryFn(async (req, res, next) => {
        const id = Number(req.params.id);
        if (req.user?.id) {
            const existing = await this.serviceSpend.findOneById(id);
            if (existing.user?.id !== req.user.id) {
                throw new GeneralError("Solo el creador del gasto puede eliminarlo.", 403);
            }
        }
        await this.serviceSpend.delete(id);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
//# sourceMappingURL=spend.js.map