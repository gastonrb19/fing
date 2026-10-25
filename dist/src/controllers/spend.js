import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";
export class SpendController {
    serviceSpend;
    constructor(serviceSpend) {
        this.serviceSpend = serviceSpend;
    }
    findAll = dryFn(async (req, res, next) => {
        // Check values
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const spends = await this.serviceSpend.findAll({ limit, offset });
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
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: spend,
        });
    });
    update = dryFn(async (req, res, next) => {
        if (!req.body.spend) {
            throw new Error("Bad request, all fields for spend are required. (spend not provided)");
        }
        const updatedSpend = await this.serviceSpend.update(Number(req.params.id), req.body.spend);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updatedSpend,
        });
    });
    delete = dryFn(async (req, res, next) => {
        await this.serviceSpend.delete(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
//# sourceMappingURL=spend.js.map