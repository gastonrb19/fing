var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity } from "./CategoryEntity.js";
import { SpendEntity } from "./SpendEntity.js";
let SubcategoryEntity = class SubcategoryEntity {
    id;
    name;
    description;
    deletedAt;
    category;
    spends;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], SubcategoryEntity.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], SubcategoryEntity.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], SubcategoryEntity.prototype, "description", void 0);
__decorate([
    DeleteDateColumn({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], SubcategoryEntity.prototype, "deletedAt", void 0);
__decorate([
    ManyToOne(() => CategoryEntity, (category) => category.subcategories, { nullable: false, onDelete: "CASCADE" }),
    JoinColumn({ name: "categoryId" }),
    __metadata("design:type", CategoryEntity)
], SubcategoryEntity.prototype, "category", void 0);
__decorate([
    OneToMany(() => SpendEntity, (spend) => spend.subcategory),
    __metadata("design:type", Array)
], SubcategoryEntity.prototype, "spends", void 0);
SubcategoryEntity = __decorate([
    Entity({ name: 'SUBCATEGORY' })
], SubcategoryEntity);
export { SubcategoryEntity };
//# sourceMappingURL=SubcategoryEntity.js.map