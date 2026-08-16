import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { SpendEntity } from "./SpendEntity.js";
import { InstallmentUserPayment } from "./InstallmentUserPayment.js";

@Entity()
export class PlannedInstallmentEntity {
    /* This fields is compose by concateneted:
        Spend-ID
        A counter of the planned rows associated to the SpendEntity
    */
   @PrimaryColumn({primary: true})
   idPI: string;

   @Column({type: "double precision", nullable: false})
    amount: number;

    @Column({type: "date", nullable: false})
    expirationDate: Date;

    @Column({type: "date", nullable: false})
    availableDate: Date;

    @ManyToOne(() => SpendEntity, (spend) => spend.plannedInstallments, {nullable: false, onDelete: "CASCADE"})
    piId: SpendEntity;

    @OneToMany(() => InstallmentUserPayment, (iup) => iup.plannedInstallment)
    fk_installmentUserPayment: InstallmentUserPayment[];
}