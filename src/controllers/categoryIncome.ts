import { Request, Response, NextFunction } from "express";
import { CategoryIncomeService } from "../services/categoryIncome.js";
import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";
import { GeneralError } from "../utils/classError.js";

export class CategoryIncomeController {
    private readonly serviceCategoryIncome: CategoryIncomeService;

    constructor(serviceCategoryIncome: CategoryIncomeService) {
        this.serviceCategoryIncome = serviceCategoryIncome;
    }

    findAll = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit as string | undefined,
            offset: req.query.offset as string | undefined,
        });

        const categories = await this.serviceCategoryIncome.findAll({
            limit,
            offset,
        });

        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: categories.length,
            data: categories,
        });
    });

    create = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const newCategory = await this.serviceCategoryIncome.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newCategory,
        });
    });

    findOne = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        const category = await this.serviceCategoryIncome.findOneById(
            Number(req.params.id)
        );
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: category,
        });
    });

    update = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.categoryIncome) {
            throw new GeneralError(
                "Bad request, categoryIncome not provided.",
                400
            );
        }
        const updatedCategory = await this.serviceCategoryIncome.update(
            Number(req.params.id),
            req.body.categoryIncome
        );
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updatedCategory,
        });
    });

    delete = dryFn(async (req: Request, res: Response, next: NextFunction) => {
        await this.serviceCategoryIncome.delete(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
