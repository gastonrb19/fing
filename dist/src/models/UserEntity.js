var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SpendEntity } from "./SpendEntity.js";
import { InstallmentUserPayment } from "./InstallmentUserPayment.js";
import { IncomeEntity } from "./IncomeEntity.js";
let User = class User {
    id;
    username;
    email;
    hashedPassword;
    phone;
    spends;
    installmentUserPayments;
    incomes;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", nullable: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Column({ type: "varchar", nullable: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ type: "varchar", nullable: false, select: false }),
    __metadata("design:type", String)
], User.prototype, "hashedPassword", void 0);
__decorate([
    Column({ type: "varchar", nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    OneToMany(() => SpendEntity, (spend) => spend.user),
    __metadata("design:type", Array)
], User.prototype, "spends", void 0);
__decorate([
    OneToMany(() => InstallmentUserPayment, (iup) => iup.user),
    __metadata("design:type", Array)
], User.prototype, "installmentUserPayments", void 0);
__decorate([
    OneToMany(() => IncomeEntity, (income) => income.user),
    __metadata("design:type", Array)
], User.prototype, "incomes", void 0);
User = __decorate([
    Entity({ name: 'USERS' })
], User);
export { User };
//# sourceMappingURL=UserEntity.js.map