import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { SubcategoryEntity } from "./SubcategoryEntity.js";


@Entity({name: 'CATEGORY'})
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false, unique: true })
    name: string;

    @Column({ type: "varchar", nullable: true })
    description: string;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt?: Date;

    @OneToMany(() => SubcategoryEntity, (subcategory) => subcategory.category)
    subcategories: Relation<SubcategoryEntity[]>;
}