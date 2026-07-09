import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./UserEntity.js";
import { SubcategoryEntity } from "./SubcategoryEntity.js";


@Entity()
export class SpendEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false, unique: false })
    name: string;

    @Column({ type: "double precision", nullable: false })
    amount: number;

    @CreateDateColumn({ type: "timestamp" })
    createDate: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateDate: Date;

    @ManyToOne(() => User, (user) => user.spends, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => SubcategoryEntity, (subcategory) => subcategory.spends, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "subcategoryId" })
    subcategory: SubcategoryEntity;
}
