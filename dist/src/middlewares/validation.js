import { GeneralError } from "../utils/classError.js";
export const validateBody = (schema) => {
    return (req, res, next) => {
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
//# sourceMappingURL=validation.js.map