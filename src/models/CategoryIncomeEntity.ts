import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IncomeEntity } from "./IncomeEntity.js";

@Entity({ name: "CATEGORY_INCOME" })
export class CategoryIncomeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false, unique: true })
    name: string;

    @Column({ type: "varchar", nullable: true })
    description: string;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt?: Date;

    @OneToMany(() => IncomeEntity, (income) => income.categoryIncome)
    incomes: IncomeEntity[];
}
