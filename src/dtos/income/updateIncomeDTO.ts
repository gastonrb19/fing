export interface updateIncomeDTO {
    name?: string;
    amount?: number;
    comentary?: string;
    date?: Date | string;
    isPayed?: boolean;
    userId?: number;
    categoryIncomeId?: number;
}
