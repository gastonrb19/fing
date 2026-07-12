import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity } from "./CategoryEntity.js";
import { SpendEntity } from "./SpendEntity.js";


@Entity()
export class SubcategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false})
    name: string;

    @Column({ type: "varchar", nullable: true })
    description: string;

    @ManyToOne(() => CategoryEntity, (category) => category.subcategories, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "categoryId" })
    category: CategoryEntity;

    @OneToMany(() => SpendEntity, (spend) => spend.subcategory)
    spends: SpendEntity[];
}
