import { Request, Response, NextFunction } from "express";
import { SpendService } from "../services/spend.js";
import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";
import { GeneralError } from "../utils/classError.js";

export class SpendController {
  private readonly serviceSpend: SpendService;
  constructor(serviceSpend: SpendService) {
    this.serviceSpend = serviceSpend;
  }


  findAll = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    // Check values
    const { limit, offset } = checkAndConvertPagination({
      limit: req.query.limit as string | undefined,
      offset: req.query.offset as string | undefined,
    });

    const spends = await this.serviceSpend.findAll({ limit, offset });

    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: spends.length,
      data: spends,
    });
  });

  
  
  // GET /users/:id_user/spends (con soporte para filtros de query)
  findByUserAndSubcategory = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    const { limit, offset } = checkAndConvertPagination({
      limit: req.query.limit as string | undefined,
      offset: req.query.offset as string | undefined,
    });

    const userId = Number(req.params.id_user);
    
    // Parseo de filtros
    const filters: any = {};
    if (req.query.category) filters.categoryId = Number(req.query.category);
    if (req.query.subcategory) filters.subcategoryId = Number(req.query.subcategory);
    if (req.query.from) filters.from = req.query.from as string;
    if (req.query.until) filters.until = req.query.until as string;
    if (req.query.done !== undefined) {
        filters.done = req.query.done === 'true';
    }

    const spends = await this.serviceSpend.findByUser(userId, { limit, offset }, filters);

    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: spends.length,
      data: spends,
    });
  });

  create = dryFn(async(req: Request, res: Response, next: NextFunction)=> {
    const newSpend = await this.serviceSpend.create(req.body);
    res.status(201).json({
      success: true,
      code_message: "ABC",
      len: 1,
      data: newSpend,
    });
  })

  findOne = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    const spend = await this.serviceSpend.findOneById(Number(req.params.id));
    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: 1,
      data: spend,
    });
  });

  update = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.spend){
      throw new Error("Bad request, all fields for spend are required. (spend not provided)");
    }
    const updatedSpend = await this.serviceSpend.update(Number(req.params.id), req.body.spend);
    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: 1,
      data: updatedSpend,
    });
  });

  delete = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    await this.serviceSpend.delete(Number(req.params.id));
    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: 0,
      data: null,
    });
  });

}
