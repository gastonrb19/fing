import {Entity, Column, OneToMany, PrimaryGeneratedColumn, type Relation} from "typeorm";
import { SpendEntity } from "./SpendEntity.js";
import { InstallmentUserPayment } from "./InstallmentUserPayment.js";
import { IncomeEntity } from "./IncomeEntity.js";

@Entity({name: 'USERS'})
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: "varchar", nullable : false, unique: true})
	username: string;

	@Column({type: "varchar", nullable : false, unique: true})
	email: string;

	@Column({type: "varchar", nullable : false, select: false})
	hashedPassword: string;

	@Column({type: "varchar", nullable: true, unique: true})
	phone: string;

	@OneToMany(() => SpendEntity, (spend) => spend.user)
	spends : Relation<SpendEntity[]>;

	@OneToMany(() => InstallmentUserPayment, (iup) => iup.user)	
	installmentUserPayments: Relation<InstallmentUserPayment[]>;

	@OneToMany(() => IncomeEntity, (income) => income.user)
	incomes: Relation<IncomeEntity[]>;
}
