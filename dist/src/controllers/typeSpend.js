import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";
export class TypeSpendController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll = dryFn(async (req, res, next) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const types = await this.service.findAll({ limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: types.length,
            data: types,
        });
    });
    findOne = dryFn(async (req, res, next) => {
        const type = await this.service.findOneById(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: type,
        });
    });
    create = dryFn(async (req, res, next) => {
        const newType = await this.service.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newType,
        });
    });
    update = dryFn(async (req, res, next) => {
        if (!req.body.typeSpend) {
            throw new Error("Bad request, 'typeSpend' body object is required.");
        }
        const updated = await this.service.update(Number(req.params.id), req.body.typeSpend);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updated,
        });
    });
    delete = dryFn(async (req, res, next) => {
        await this.service.delete(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
//# sourceMappingURL=typeSpend.js.map