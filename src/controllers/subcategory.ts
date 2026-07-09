import { Request, Response, NextFunction } from "express";
import { SubcategoryService } from "../services/subcategory.js";
import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";

export class SubcategoryController {
  private readonly serviceSubcategory: SubcategoryService;
  constructor(serviceSubcategory: SubcategoryService) {
    this.serviceSubcategory = serviceSubcategory;
  }


  findAll = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    // Check values
    const { limit, offset } = checkAndConvertPagination({
      limit: req.query.limit as string | undefined,
      offset: req.query.offset as string | undefined,
    });

    const subcategories = await this.serviceSubcategory.findAll({ limit, offset });

    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: subcategories.length,
      data: subcategories,
    });
  });

  findByCategory = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    // Check values
    const { limit, offset } = checkAndConvertPagination({
      limit: req.query.limit as string | undefined,
      offset: req.query.offset as string | undefined,
    });

    const subcategories = await this.serviceSubcategory.findByCategory(Number(req.params.categoryId), { limit, offset });

    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: subcategories.length,
      data: subcategories,
    });
  });

  create = dryFn(async(req: Request, res: Response, next: NextFunction)=> {
    const newSubcategory = await this.serviceSubcategory.create(req.body);
    res.status(201).json({
      success: true,
      code_message: "ABC",
      len: 1,
      data: newSubcategory,
    });
  })

  findOne = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    const subcategory = await this.serviceSubcategory.findOneById(Number(req.params.id));
    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: 1,
      data: subcategory,
    });
  });

  update = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.subcategory){
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

  delete = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    await this.serviceSubcategory.delete(Number(req.params.id));
    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: 0,
      data: null,
    });
  });

}
