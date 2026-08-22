export interface createInstallmentUserPaymentDTO {
    idPayment: string;
    accepted: boolean;
    paidAmount: number;
    paymentDone: boolean;
    plannedInstallmentId: string;
    userId: number;
}
