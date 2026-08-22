export interface createPlannedInstallmentDTO {
    idPI: string;
    amount: number;
    expirationDate: Date | string;
    availableDate: Date | string;
    spendId: number;
}
