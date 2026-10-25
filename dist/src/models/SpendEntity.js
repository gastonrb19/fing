var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { User } from "./UserEntity.js";
import { SubcategoryEntity } from "./SubcategoryEntity.js";
import { TypeSpendEntity } from "./TypeSpendEntity.js";
import { PlannedInstallmentEntity } from "./PlannedInstallmentEntity.js";
let SpendEntity = class SpendEntity {
    id;
    name;
    amount;
    minDayToPayment;
    maxDayToPayment;
    totalInstallment;
    startPayment;
    createDate;
    updateDate;
    user;
    subcategory;
    type;
    plannedInstallments;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], SpendEntity.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", nullable: false, unique: false }),
    __metadata("design:type", String)
], SpendEntity.prototype, "name", void 0);
__decorate([
    Column({ type: "double precision", nullable: false }),
    __metadata("design:type", Number)
], SpendEntity.prototype, "amount", void 0);
__decorate([
    Column({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], SpendEntity.prototype, "minDayToPayment", void 0);
__decorate([
    Column({ type: "int" }),
    __metadata("design:type", Number)
], SpendEntity.prototype, "maxDayToPayment", void 0);
__decorate([
    Column({ type: "int" }),
    __metadata("design:type", Number)
], SpendEntity.prototype, "totalInstallment", void 0);
__decorate([
    Column({ type: "date" }),
    __metadata("design:type", Date)
], SpendEntity.prototype, "startPayment", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], SpendEntity.prototype, "createDate", void 0);
__decorate([
    UpdateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], SpendEntity.prototype, "updateDate", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.spends, { nullable: false, onDelete: "CASCADE" }),
    JoinColumn({ name: "userId" }),
    __metadata("design:type", User)
], SpendEntity.prototype, "user", void 0);
__decorate([
    ManyToOne(() => SubcategoryEntity, (subcategory) => subcategory.spends, { nullable: false, onDelete: "CASCADE" }),
    JoinColumn({ name: "subcategoryId" }),
    __metadata("design:type", SubcategoryEntity)
], SpendEntity.prototype, "subcategory", void 0);
__decorate([
    ManyToOne(() => TypeSpendEntity, (typeSpend) => typeSpend.spends, { nullable: false, onDelete: "CASCADE" }),
    JoinColumn({ name: "fkTypeSpend" }),
    __metadata("design:type", TypeSpendEntity)
], SpendEntity.prototype, "type", void 0);
__decorate([
    OneToMany(() => PlannedInstallmentEntity, (pi) => pi.piId),
    __metadata("design:type", Array)
], SpendEntity.prototype, "plannedInstallments", void 0);
SpendEntity = __decorate([
    Entity({ name: 'SPEND' })
], SpendEntity);
export { SpendEntity };
//# sourceMappingURL=SpendEntity.js.map