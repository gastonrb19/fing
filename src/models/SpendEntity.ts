import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./UserEntity.js";
import { SubcategoryEntity } from "./SubcategoryEntity.js";
import { TypeSpendEntity } from "./TypeSpendEntity.js";
import { PlannedInstallmentEntity } from "./PlannedInstallmentEntity.js";


@Entity({name: 'SPEND'})
export class SpendEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false, unique: false })
    name: string;

    @Column({ type: "double precision", nullable: false })
    totalAmount: number;

    @Column({type: "int", nullable: false})
    minDayToPayment: number;

    @Column({type: "int"})
    maxDayToPayment: number;

    @Column({type: "int"})
    totalInstallment : number;

    @Column({type: "date"})
    startPayment: Date;

    @CreateDateColumn({ type: "timestamp" })
    createDate: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateDate: Date;

    @ManyToOne(() => User, (user) => user.spends, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => SubcategoryEntity, (subcategory) => subcategory.spends, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "subcategoryId" })
    subcategory: SubcategoryEntity;

    @ManyToOne(() => TypeSpendEntity, (typeSpend) => typeSpend.spends, {nullable: false, onDelete: "CASCADE"})
    @JoinColumn({name : "fkTypeSpend"})
    type: TypeSpendEntity;

    @OneToMany(() => PlannedInstallmentEntity, (pi) => pi.piId)
    plannedInstallments: PlannedInstallmentEntity[];
}
