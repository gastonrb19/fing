import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { GeneralError } from "../utils/classError.js";

export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errMsgs = result.error.issues
                .map((issue) => `"${issue.path.join(".")}": ${issue.message}`)
                .join("; ");
            throw new GeneralError(`Validation Error: ${errMsgs}`, 400, "BAD_REQUEST");
        }
        req.body = result.data;
        next();
    };
};
