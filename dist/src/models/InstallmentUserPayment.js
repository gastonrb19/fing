var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { PlannedInstallmentEntity } from "./PlannedInstallmentEntity.js";
import { User } from "./UserEntity.js";
let InstallmentUserPayment = class InstallmentUserPayment {
    idPayment;
    accepted;
    rejected;
    assignedAmount;
    paidAmount;
    paymentDone;
    plannedInstallment;
    user;
    assumedByUser;
};
__decorate([
    PrimaryColumn({ type: "uuid" }),
    __metadata("design:type", String)
], InstallmentUserPayment.prototype, "idPayment", void 0);
__decorate([
    Column({ type: "boolean", nullable: false }),
    __metadata("design:type", Boolean)
], InstallmentUserPayment.prototype, "accepted", void 0);
__decorate([
    Column({ type: "boolean", nullable: false, default: false }),
    __metadata("design:type", Boolean)
], InstallmentUserPayment.prototype, "rejected", void 0);
__decorate([
    Column({ type: "double precision", nullable: false, default: 0 }),
    __metadata("design:type", Number)
], InstallmentUserPayment.prototype, "assignedAmount", void 0);
__decorate([
    Column({ type: "double precision", nullable: false }),
    __metadata("design:type", Number)
], InstallmentUserPayment.prototype, "paidAmount", void 0);
__decorate([
    Column({ type: "boolean", nullable: false }),
    __metadata("design:type", Boolean)
], InstallmentUserPayment.prototype, "paymentDone", void 0);
__decorate([
    ManyToOne(() => PlannedInstallmentEntity, (pi) => pi.fk_installmentUserPayment, { onDelete: "CASCADE", nullable: false }),
    JoinColumn({ name: "plannedInstallmentId" }),
    __metadata("design:type", Object)
], InstallmentUserPayment.prototype, "plannedInstallment", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.installmentUserPayments),
    JoinColumn({ name: "userId" }),
    __metadata("design:type", Object)
], InstallmentUserPayment.prototype, "user", void 0);
__decorate([
    ManyToOne(() => User, { nullable: true }),
    JoinColumn({ name: "assumedByUserId" }),
    __metadata("design:type", Object)
], InstallmentUserPayment.prototype, "assumedByUser", void 0);
InstallmentUserPayment = __decorate([
    Entity({ name: 'INSTALLMENTUSERPAYMENT' })
], InstallmentUserPayment);
export { InstallmentUserPayment };
//# sourceMappingURL=InstallmentUserPayment.js.map