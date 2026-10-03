export interface ParticipantSplit {
    userId: number;
    percentage: number;
}

export interface createSpendDTO {
    name: string;
    amount: number;
    userId: number;
    subcategoryId: number;
    minDayToPayment: number;
    maxDayToPayment?: number;
    totalInstallment?: number;
    startPayment?: Date | string;
    fkTypeSpend: number;
    participants?: ParticipantSplit[];
}
