import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubcategoryEntity } from "./SubcategoryEntity.js";


@Entity({name: 'CATEGORY'})
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false, unique: true })
    name: string;

    @Column({ type: "varchar", nullable: true })
    description: string;

    @OneToMany(() => SubcategoryEntity, (subcategory) => subcategory.category)
    subcategories: SubcategoryEntity[];
}