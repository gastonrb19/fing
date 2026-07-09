import {Entity, Column, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { SpendEntity } from "./SpendEntity.js";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: "varchar", nullable : false, unique: true})
	username: string;

	@Column({type: "varchar", nullable : false, unique: true})
	email: string;

	@Column({type: "varchar", nullable : false})
	hashedPassword: string;

	@Column({type: "varchar", nullable: true, unique: true})
	phone: string;

	@OneToMany(() => SpendEntity, (spend) => spend.user)
	spends: SpendEntity[];
}
