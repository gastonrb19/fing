var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { SpendEntity } from "./SpendEntity.js";
import { InstallmentUserPayment } from "./InstallmentUserPayment.js";
let PlannedInstallmentEntity = class PlannedInstallmentEntity {
    /* This fields is compose by concateneted:
        Spend-ID
        A counter of the planned rows associated to the SpendEntity
    */
    idPI;
    amount;
    expirationDate;
    availableDate;
    piId;
    fk_installmentUserPayment;
};
__decorate([
    PrimaryColumn({ type: "varchar" }),
    __metadata("design:type", String)
], PlannedInstallmentEntity.prototype, "idPI", void 0);
__decorate([
    Column({ type: "double precision", nullable: false }),
    __metadata("design:type", Number)
], PlannedInstallmentEntity.prototype, "amount", void 0);
__decorate([
    Column({ type: "date", nullable: false }),
    __metadata("design:type", Date)
], PlannedInstallmentEntity.prototype, "expirationDate", void 0);
__decorate([
    Column({ type: "date", nullable: false }),
    __metadata("design:type", Date)
], PlannedInstallmentEntity.prototype, "availableDate", void 0);
__decorate([
    ManyToOne(() => SpendEntity, (spend) => spend.plannedInstallments, { nullable: false, onDelete: "CASCADE" }),
    JoinColumn({ name: "spendId" }),
    __metadata("design:type", Object)
], PlannedInstallmentEntity.prototype, "piId", void 0);
__decorate([
    OneToMany(() => InstallmentUserPayment, (iup) => iup.plannedInstallment),
    __metadata("design:type", Object)
], PlannedInstallmentEntity.prototype, "fk_installmentUserPayment", void 0);
PlannedInstallmentEntity = __decorate([
    Entity({ name: 'PLANNEDINSTALLMENT' })
], PlannedInstallmentEntity);
export { PlannedInstallmentEntity };
//# sourceMappingURL=PlannedInstallmentEntity.js.map