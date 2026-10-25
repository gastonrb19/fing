import { Router } from "express";
import { getAllPayments, getPaymentById, getPaymentsByUser, createPayment, updatePayment, deletePayment, rejectPayment, getRejectedPayments } from "../controllers/installmentUserPayment.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = Router();
router.get("/installmentuserpayments", requireAuth, getAllPayments);
router.get("/installmentuserpayments/rejected", requireAuth, getRejectedPayments); // Debe ir arriba de /:id para no confundir ruteo
router.get("/installmentuserpayments/:id", requireAuth, getPaymentById);
router.get("/users/:userId/installmentuserpayments", requireAuth, getPaymentsByUser);
router.post("/installmentuserpayments", requireAuth, createPayment);
router.put("/installmentuserpayments/:id", requireAuth, updatePayment);
router.put("/installmentuserpayments/:id/reject", requireAuth, rejectPayment);
router.delete("/installmentuserpayments/:id", requireAuth, deletePayment);
export default router;
//# sourceMappingURL=installmentUserPayment_routes.js.map