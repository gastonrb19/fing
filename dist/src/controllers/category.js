import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";
export class CategoryController {
    serviceCategory;
    constructor(serviceCategory) {
        this.serviceCategory = serviceCategory;
    }
    findAll = dryFn(async (req, res, next) => {
        // Check values
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const categories = await this.serviceCategory.findAll({ limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: categories.length,
            data: categories,
        });
    });
    create = dryFn(async (req, res, next) => {
        const newCategory = await this.serviceCategory.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newCategory,
        });
    });
    findOne = dryFn(async (req, res, next) => {
        const category = await this.serviceCategory.findOneById(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: category,
        });
    });
    update = dryFn(async (req, res, next) => {
        if (!req.body.category) {
            throw new Error("Bad request, all fields for category are required. (category not provided)");
        }
        const updatedCategory = await this.serviceCategory.update(Number(req.params.id), req.body.category);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updatedCategory,
        });
    });
    delete = dryFn(async (req, res, next) => {
        await this.serviceCategory.delete(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
//# sourceMappingURL=category.js.map