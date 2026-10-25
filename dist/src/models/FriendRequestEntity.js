var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./UserEntity.js";
export var FriendRequestStatus;
(function (FriendRequestStatus) {
    FriendRequestStatus["PENDING"] = "PENDING";
    FriendRequestStatus["ACCEPTED"] = "ACCEPTED";
    FriendRequestStatus["REJECTED"] = "REJECTED";
})(FriendRequestStatus || (FriendRequestStatus = {}));
let FriendRequestEntity = class FriendRequestEntity {
    id;
    senderId;
    receiverId;
    status;
    sender;
    receiver;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], FriendRequestEntity.prototype, "id", void 0);
__decorate([
    Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], FriendRequestEntity.prototype, "senderId", void 0);
__decorate([
    Column({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], FriendRequestEntity.prototype, "receiverId", void 0);
__decorate([
    Column({ type: 'enum', enum: FriendRequestStatus, default: FriendRequestStatus.PENDING }),
    __metadata("design:type", String)
], FriendRequestEntity.prototype, "status", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'senderId' }),
    __metadata("design:type", Object)
], FriendRequestEntity.prototype, "sender", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'receiverId' }),
    __metadata("design:type", Object)
], FriendRequestEntity.prototype, "receiver", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], FriendRequestEntity.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], FriendRequestEntity.prototype, "updatedAt", void 0);
FriendRequestEntity = __decorate([
    Entity({ name: 'FRIENDREQUEST' })
], FriendRequestEntity);
export { FriendRequestEntity };
//# sourceMappingURL=FriendRequestEntity.js.map