export interface updateSpendDTO {
    name?: string;
    amount?: number;
    userId?: number;
    subcategoryId?: number;
    minDayToPayment?: number;
    maxDayToPayment?: number;
    totalInstallment?: number;
    startPayment?: Date | string;
    fkTypeSpend?: number;
}
