import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SpendEntity } from "./SpendEntity.js";


@Entity({name: 'TYPESPEND'})
export class TypeSpendEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", nullable: false})
    name: string;

    @OneToMany(() => SpendEntity, (spend) => spend.type)
    spends: SpendEntity[];
    
}