var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SpendEntity } from "./SpendEntity.js";
let TypeSpendEntity = class TypeSpendEntity {
    id;
    name;
    spends;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], TypeSpendEntity.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], TypeSpendEntity.prototype, "name", void 0);
__decorate([
    OneToMany(() => SpendEntity, (spend) => spend.type),
    __metadata("design:type", Array)
], TypeSpendEntity.prototype, "spends", void 0);
TypeSpendEntity = __decorate([
    Entity({ name: 'TYPESPEND' })
], TypeSpendEntity);
export { TypeSpendEntity };
//# sourceMappingURL=TypeSpendEntity.js.map