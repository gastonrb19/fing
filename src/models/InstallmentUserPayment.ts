import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { PlannedInstallmentEntity } from "./PlannedInstallmentEntity.js";
import { User } from "./UserEntity.js";

@Entity({name: 'INSTALLMENTUSERPAYMENT'})
export class InstallmentUserPayment {
    @PrimaryColumn({type: "uuid"})
    idPayment: string;

    @Column({type: "boolean", nullable: false})
    accepted: boolean;

    @Column({type: "double precision", nullable: false})
    paidAmount: number;

    @Column({type: "boolean", nullable: false})
    paymentDone: boolean;

    @ManyToOne(() => PlannedInstallmentEntity, (pi) => pi.fk_installmentUserPayment, {onDelete: "CASCADE", nullable: false})
    @JoinColumn({ name: "plannedInstallmentId" })
    plannedInstallment: PlannedInstallmentEntity;

    @ManyToOne(() => User, (user) => user.installmentUserPayments)
    @JoinColumn({ name: "userId" })
    user : User;
}