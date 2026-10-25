import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";
export class SubcategoryController {
    serviceSubcategory;
    constructor(serviceSubcategory) {
        this.serviceSubcategory = serviceSubcategory;
    }
    findAll = dryFn(async (req, res, next) => {
        // Check values
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const subcategories = await this.serviceSubcategory.findAll({ limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: subcategories.length,
            data: subcategories,
        });
    });
    findByCategory = dryFn(async (req, res, next) => {
        // Check values
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const subcategories = await this.serviceSubcategory.findByCategory(Number(req.params.categoryId), { limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: subcategories.length,
            data: subcategories,
        });
    });
    create = dryFn(async (req, res, next) => {
        const newSubcategory = await this.serviceSubcategory.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newSubcategory,
        });
    });
    findOne = dryFn(async (req, res, next) => {
        const subcategory = await this.serviceSubcategory.findOneById(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: subcategory,
        });
    });
    update = dryFn(async (req, res, next) => {
        if (!req.body.subcategory) {
            throw new Error("Bad request, all fields for subcategory are required. (subcategory not provided)");
        }
        const updatedSubcategory = await this.serviceSubcategory.update(Number(req.params.id), req.body.subcategory);
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: updatedSubcategory,
        });
    });
    delete = dryFn(async (req, res, next) => {
        await this.serviceSubcategory.delete(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 0,
            data: null,
        });
    });
}
//# sourceMappingURL=subcategory.js.map