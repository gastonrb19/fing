import { NextFunction } from "express";
import { Request } from "express";
import { Response } from "express";

export const dryFn = (fn:(req: Request, res: Response, next: NextFunction)=>void) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};