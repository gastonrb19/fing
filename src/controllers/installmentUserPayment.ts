import { Request, Response, NextFunction } from "express";
import { InstallmentUserPaymentService } from "../services/installmentUserPayment.js";
import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";

export class InstallmentUserPaymentController {
    private readonly service: InstallmentUserPaymentService;
    constructor(service: InstallmentUserPaymentService) {
        this.service = service;
    }

    findAll = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit as string | undefined,
            offset: req.query.offset as string | undefined,
        });

        const payments = await this.service.findAll({ limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: payments.length,
            data: payments,
        });
    });

    findOne = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const payment = await this.service.findOneById(req.params.idPayment as string);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: payment,
        });
    });

    findByUser = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit as string | undefined,
            offset: req.query.offset as string | undefined,
        });

        let done: boolean | undefined = undefined;
        if (req.query.done !== undefined) {
            done = req.query.done === "true";
        }

        const payments = await this.service.findByUser(
            Number(req.params.userId),
            done,
            { limit, offset }
        );

        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: payments.length,
            data: payments,
        });
    });

    create = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const newPayment = await this.service.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newPayment,
        });
    });

    update = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.installmentUserPayment) {
            throw new Error("Bad request, 'installmentUserPayment' body object is required.");
        }
        const updated = await this.service.update(req.params.idPayment as string, req.body.installmentUserPayment);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updated,
        });
    });

    delete = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        await this.service.delete(req.params.idPayment as string);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
