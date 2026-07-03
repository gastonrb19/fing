import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

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
}
