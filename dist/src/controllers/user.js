import { dryFn } from "../utils/dryFn.js";
import { checkAndConvertPagination } from "../utils/checkPagination.js";
export class UserController {
    serviceUser;
    constructor(serviceUser) {
        this.serviceUser = serviceUser;
    }
    findAll = dryFn(async (req, res, next) => {
        // Check values
        const { limit, offset } = checkAndConvertPagination({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        const users = await this.serviceUser.findAll({ limit, offset });
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: users.length,
            data: users,
        });
    });
    create = dryFn(async (req, res, next) => {
        const newUser = await this.serviceUser.create(req.body);
        res.status(201).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: newUser,
        });
    });
    findOne = dryFn(async (req, res, next) => {
        const user = await this.serviceUser.findOneById(Number(req.params.id));
        res.status(200).json({
            success: true,
            code_message: "ABC",
            len: 1,
            data: user,
        });
    });
    update = dryFn(async (req, res, next) => {
        if (!req.body.user) {
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
//# sourceMappingURL=user.js.map