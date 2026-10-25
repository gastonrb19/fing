var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { User } from "./UserEntity.js";
import { CategoryIncomeEntity } from "./CategoryIncomeEntity.js";
let IncomeEntity = class IncomeEntity {
    id;
    name;
    amount;
    comentary;
    date;
    isPayed;
    createDate;
    updateDate;
    user;
    categoryIncome;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], IncomeEntity.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], IncomeEntity.prototype, "name", void 0);
__decorate([
    Column({ type: "double precision", nullable: false }),
    __metadata("design:type", Number)
], IncomeEntity.prototype, "amount", void 0);
__decorate([
    Column({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], IncomeEntity.prototype, "comentary", void 0);
__decorate([
    Column({ type: "date", nullable: false }),
    __metadata("design:type", Object)
], IncomeEntity.prototype, "date", void 0);
__decorate([
    Column({ type: "boolean", nullable: false, default: false }),
    __metadata("design:type", Boolean)
], IncomeEntity.prototype, "isPayed", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], IncomeEntity.prototype, "createDate", void 0);
__decorate([
    UpdateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], IncomeEntity.prototype, "updateDate", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.incomes, { nullable: false, onDelete: "CASCADE" }),
    JoinColumn({ name: "userId" }),
    __metadata("design:type", User)
], IncomeEntity.prototype, "user", void 0);
__decorate([
    ManyToOne(() => CategoryIncomeEntity, (categoryIncome) => categoryIncome.incomes, {
        nullable: false,
        onDelete: "CASCADE",
    }),
    JoinColumn({ name: "categoryIncomeId" }),
    __metadata("design:type", CategoryIncomeEntity)
], IncomeEntity.prototype, "categoryIncome", void 0);
IncomeEntity = __decorate([
    Entity({ name: "INCOME" })
], IncomeEntity);
export { IncomeEntity };
//# sourceMappingURL=IncomeEntity.js.map