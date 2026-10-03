import { Router } from "express";
import { 
    getAllPayments, 
    getPaymentById, 
    getPaymentsByUser, 
    createPayment, 
    updatePayment, 
    deletePayment,
    rejectPayment,
    getRejectedPayments
} from "../controllers/installmentUserPayment.js";

const router = Router();

router.get("/installmentuserpayments", getAllPayments);
router.get("/installmentuserpayments/rejected", getRejectedPayments); // Debe ir arriba de /:id para no confundir ruteo
router.get("/installmentuserpayments/:id", getPaymentById);
router.get("/users/:userId/installmentuserpayments", getPaymentsByUser);
router.post("/installmentuserpayments", createPayment);
router.put("/installmentuserpayments/:id", updatePayment);
router.put("/installmentuserpayments/:id/reject", rejectPayment);
router.delete("/installmentuserpayments/:id", deletePayment);

export default router;
