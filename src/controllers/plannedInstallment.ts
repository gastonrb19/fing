import { Request, Response, NextFunction } from "express";
import { PlannedInstallmentService } from "../services/plannedInstallment.js";
import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";

export class PlannedInstallmentController {
    private readonly service: PlannedInstallmentService;
    constructor(service: PlannedInstallmentService) {
        this.service = service;
    }

    findAll = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit as string | undefined,
            offset: req.query.offset as string | undefined,
        });

        const installments = await this.service.findAll({ limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: installments.length,
            data: installments,
        });
    });

    findOne = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const installment = await this.service.findOneById(req.params.idPI as string);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: installment,
        });
    });

    findBySpend = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit as string | undefined,
            offset: req.query.offset as string | undefined,
        });

        const installments = await this.service.findBySpend(Number(req.params.spendId), { limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: installments.length,
            data: installments,
        });
    });

    create = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const newInstallment = await this.service.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newInstallment,
        });
    });

    update = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.plannedInstallment) {
            throw new Error("Bad request, 'plannedInstallment' body object is required.");
        }
        const updated = await this.service.update(req.params.idPI as string, req.body.plannedInstallment);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updated,
        });
    });

    delete = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        await this.service.delete(req.params.idPI as string);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
