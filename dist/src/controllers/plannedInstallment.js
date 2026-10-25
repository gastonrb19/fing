import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";
export class PlannedInstallmentController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll = dryFn(async (req, res, next) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const installments = await this.service.findAll({ limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: installments.length,
            data: installments,
        });
    });
    findOne = dryFn(async (req, res, next) => {
        const installment = await this.service.findOneById(req.params.idPI);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: installment,
        });
    });
    findBySpend = dryFn(async (req, res, next) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const installments = await this.service.findBySpend(Number(req.params.spendId), { limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: installments.length,
            data: installments,
        });
    });
    create = dryFn(async (req, res, next) => {
        const newInstallment = await this.service.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newInstallment,
        });
    });
    update = dryFn(async (req, res, next) => {
        if (!req.body.plannedInstallment) {
            throw new Error("Bad request, 'plannedInstallment' body object is required.");
        }
        const updated = await this.service.update(req.params.idPI, req.body.plannedInstallment);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updated,
        });
    });
    delete = dryFn(async (req, res, next) => {
        await this.service.delete(req.params.idPI);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
//# sourceMappingURL=plannedInstallment.js.map