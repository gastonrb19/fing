var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./UserEntity.js";
let FriendshipEntity = class FriendshipEntity {
    id;
    userId;
    friendId;
    user;
    friend;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], FriendshipEntity.prototype, "id", void 0);
__decorate([
    Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], FriendshipEntity.prototype, "userId", void 0);
__decorate([
    Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], FriendshipEntity.prototype, "friendId", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'userId' }),
    __metadata("design:type", Object)
], FriendshipEntity.prototype, "user", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'friendId' }),
    __metadata("design:type", Object)
], FriendshipEntity.prototype, "friend", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], FriendshipEntity.prototype, "createdAt", void 0);
FriendshipEntity = __decorate([
    Entity({ name: 'FRIENDSHIP' })
], FriendshipEntity);
export { FriendshipEntity };
//# sourceMappingURL=FriendshipEntity.js.map