import { Request, Response, NextFunction } from "express";
import { TypeSpendService } from "../services/typeSpend.js";
import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";

export class TypeSpendController {
    private readonly service: TypeSpendService;
    constructor(service: TypeSpendService) {
        this.service = service;
    }

    findAll = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit as string | undefined,
            offset: req.query.offset as string | undefined,
        });

        const types = await this.service.findAll({ limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: types.length,
            data: types,
        });
    });

    findOne = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const type = await this.service.findOneById(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: type,
        });
    });

    create = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const newType = await this.service.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newType,
        });
    });

    update = dryFn(async (req: Request, res: Response, next: NextFunction) => {
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

    delete = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        await this.service.delete(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
