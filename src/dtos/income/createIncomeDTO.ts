export interface createIncomeDTO {
    name: string;
    amount: number;
    comentary?: string;
    date: Date | string;
    isPayed?: boolean;
    userId: number;
    categoryIncomeId: number;
}
