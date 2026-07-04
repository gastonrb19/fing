import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.js";
import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";

export class UserController {
  private readonly serviceUser: UserService;
  constructor(serviceUser: UserService) {
    this.serviceUser = serviceUser;
  }


  findAll = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    // Check values
    const { limit, offset } = checkAndConvertPagination({
      limit: req.query.limit as string | undefined,
      offset: req.query.offset as string | undefined,
    });

    const users = await this.serviceUser.findAll({ limit, offset });

    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: users.length,
      data: users,
    });
  });

  create = dryFn(async(req: Request, res: Response, next: NextFunction)=> {
    const newUser = await this.serviceUser.create(req.body);
    res.status(201).json({
      success: true,
      code_message: "ABC",
      len: 1,
      data: newUser,
    });
  })

  findOne = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.serviceUser.findOneById(Number(req.params.id));
    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: 1,
      data: user,
    });
  });

  update = dryFn(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.user){
      throw new Error("Bad request, all fields for user are required. (user not provided)");
    }
    const updatedUser = await this.serviceUser.update(Number(req.params.id), req.body.user);
    res.status(200).json({
      success: true,
      code_message: "ABC",
      len: 1,
      data: updatedUser,
    });
  });

}
