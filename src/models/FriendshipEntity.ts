import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, type Relation } from "typeorm";
import { User } from "./UserEntity.js";

@Entity({ name: 'FRIENDSHIP' })
export class FriendshipEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: false })
    userId: number;

    @Column({ type: 'int', nullable: false })
    friendId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: Relation<User>;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'friendId' })
    friend: Relation<User>;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
