import { InstallmentUserPaymentService } from "../services/installmentUserPayment.js";
import { dryFn } from "../utils/dryFn.js";
const service = new InstallmentUserPaymentService();
export const getAllPayments = dryFn(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const payments = await service.findAll({ offset: (page - 1) * limit, limit });
    res.status(200).json(payments);
});
export const getPaymentById = dryFn(async (req, res) => {
    const payment = await service.findOneById(req.params.id);
    res.status(200).json(payment);
});
export const getPaymentsByUser = dryFn(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const done = req.query.done ? req.query.done === 'true' : undefined;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const payments = await service.findByUser(userId, done, { offset: (page - 1) * limit, limit });
    res.status(200).json(payments);
});
export const createPayment = dryFn(async (req, res) => {
    const payment = await service.create(req.body);
    res.status(201).json(payment);
});
export const updatePayment = dryFn(async (req, res) => {
    const payment = await service.update(req.params.id, req.body);
    res.status(200).json(payment);
});
export const deletePayment = dryFn(async (req, res) => {
    await service.delete(req.params.id);
    res.status(204).send();
});
// ENDPOINTS DE RECHAZO
export const rejectPayment = dryFn(async (req, res) => {
    const userId = req.user?.id || req.body.currentUser || 1;
    const idPayment = req.params.id;
    const payment = await service.rejectPayment(idPayment, userId);
    res.status(200).json(payment);
});
export const getRejectedPayments = dryFn(async (req, res) => {
    const authUserId = req.user?.id;
    const userId = req.query.userId ? parseInt(req.query.userId) : undefined;
    const creatorId = req.query.creatorId
        ? parseInt(req.query.creatorId)
        : (req.query.asCreator === "true" && authUserId ? authUserId : undefined);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const payments = await service.getRejectedPayments({ offset: (page - 1) * limit, limit }, { userId, creatorId });
    res.status(200).json(payments);
});
//# sourceMappingURL=installmentUserPayment.js.map