import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";
import { GeneralError } from "../utils/classError.js";
export class CategoryIncomeController {
    serviceCategoryIncome;
    constructor(serviceCategoryIncome) {
        this.serviceCategoryIncome = serviceCategoryIncome;
    }
    findAll = dryFn(async (req, res, next) => {
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
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
    create = dryFn(async (req, res, next) => {
        const newCategory = await this.serviceCategoryIncome.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newCategory,
        });
    });
    findOne = dryFn(async (req, res, next) => {
        const category = await this.serviceCategoryIncome.findOneById(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: category,
        });
    });
    update = dryFn(async (req, res, next) => {
        if (!req.body.categoryIncome) {
            throw new GeneralError("Bad request, categoryIncome not provided.", 400);
        }
        const updatedCategory = await this.serviceCategoryIncome.update(Number(req.params.id), req.body.categoryIncome);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updatedCategory,
        });
    });
    delete = dryFn(async (req, res, next) => {
        await this.serviceCategoryIncome.delete(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
//# sourceMappingURL=categoryIncome.js.map