import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, type Relation } from "typeorm";
import { User } from "./UserEntity.js";

export enum FriendRequestStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}

@Entity({ name: 'FRIENDREQUEST' })
export class FriendRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: false })
    senderId: number;

    @Column({ type: 'int', nullable: false })
    receiverId: number;

    @Column({ type: 'enum', enum: FriendRequestStatus, default: FriendRequestStatus.PENDING })
    status: FriendRequestStatus;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'senderId' })
    sender: Relation<User>;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'receiverId' })
    receiver: Relation<User>;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
