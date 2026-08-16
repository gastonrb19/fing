import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.js";
import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";

export class CategoryController {
  private readonly serviceCategory: CategoryService;
  constructor(serviceCategory: CategoryService) {
    this.serviceCategory = serviceCategory;
  }

  findAll = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    // Check values
    const { limit, offset } = checkAndConvertPagination({
      limit: req.query.limit as string | undefined,
      offset: req.query.offset as string | undefined,
    });

    const categories = await this.serviceCategory.findAll({ limit, offset });

    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: categories.length,
      data: categories,
    });
  });

  create = dryFn(async(req: Request, res: Response, next: NextFunction)=> {
    const newCategory = await this.serviceCategory.create(req.body);
    res.status(201).json({
      success: true,
      code_message: "ABC",
      len: 1,
      data: newCategory,
    });
  })

  findOne = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    const category = await this.serviceCategory.findOneById(Number(req.params.id));
    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: 1,
      data: category,
    });
  });

  update = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.category){
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

  delete = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    await this.serviceCategory.delete(Number(req.params.id));
    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: 0,
      data: null,
    });
  });

}
