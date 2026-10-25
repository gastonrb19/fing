import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    type Relation,
} from "typeorm";
import { User } from "./UserEntity.js";
import { CategoryIncomeEntity } from "./CategoryIncomeEntity.js";

@Entity({ name: "INCOME" })
export class IncomeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false })
    name: string;

    @Column({ type: "double precision", nullable: false })
    amount: number;

    @Column({ type: "varchar", nullable: true })
    comentary: string;

    @Column({ type: "date", nullable: false })
    date: Date | string;

    @Column({ type: "boolean", nullable: false, default: false })
    isPayed: boolean;

    @CreateDateColumn({ type: "timestamp" })
    createDate: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateDate: Date;

    @ManyToOne(() => User, (user) => user.incomes, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: Relation<User>;

    @ManyToOne(() => CategoryIncomeEntity, (categoryIncome) => categoryIncome.incomes, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "categoryIncomeId" })
    categoryIncome: Relation<CategoryIncomeEntity>;
}
