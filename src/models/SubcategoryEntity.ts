import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { CategoryEntity } from "./CategoryEntity.js";
import { SpendEntity } from "./SpendEntity.js";


@Entity({name: 'SUBCATEGORY'})
export class SubcategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false})
    name: string;

    @Column({ type: "varchar", nullable: true })
    description: string;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => CategoryEntity, (category) => category.subcategories, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "categoryId" })
    category: Relation<CategoryEntity>;

    @OneToMany(() => SpendEntity, (spend) => spend.subcategory)
    spends: Relation<SpendEntity[]>;
}
