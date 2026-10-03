import { Request, Response } from "express";
import { InstallmentUserPaymentService } from "../services/installmentUserPayment.js";
import { dryFn } from "../utils/dryFn.js";

const service = new InstallmentUserPaymentService();

export const getAllPayments = dryFn(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const payments = await service.findAll({ offset: (page - 1) * limit, limit });
    res.status(200).json(payments);
});

export const getPaymentById = dryFn(async (req: Request, res: Response) => {
    const payment = await service.findOneById(req.params.id as string);
    res.status(200).json(payment);
});

export const getPaymentsByUser = dryFn(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId as string);
    const done = req.query.done ? req.query.done === 'true' : undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const payments = await service.findByUser(userId, done, { offset: (page - 1) * limit, limit });
    res.status(200).json(payments);
});

export const createPayment = dryFn(async (req: Request, res: Response) => {
    const payment = await service.create(req.body);
    res.status(201).json(payment);
});

export const updatePayment = dryFn(async (req: Request, res: Response) => {
    const payment = await service.update(req.params.id as string, req.body);
    res.status(200).json(payment);
});

export const deletePayment = dryFn(async (req: Request, res: Response) => {
    await service.delete(req.params.id as string);
    res.status(204).send();
});

// NUEVOS ENDPOINTS DE RECHAZO
export const rejectPayment = dryFn(async (req: Request, res: Response) => {
    const userId = req.body.currentUser || 1; // Mismo auth hardcoded
    const idPayment = req.params.id;

    const payment = await service.rejectPayment(idPayment as string, userId);
    res.status(200).json(payment);
});

export const getRejectedPayments = dryFn(async (req: Request, res: Response) => {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const payments = await service.getRejectedPayments({ offset: (page - 1) * limit, limit }, userId);
    res.status(200).json(payments);
});
