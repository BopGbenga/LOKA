"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtisanProfile = void 0;
const typeorm_1 = require("typeorm");
const users_1 = require("./users");
let ArtisanProfile = class ArtisanProfile {
};
exports.ArtisanProfile = ArtisanProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ArtisanProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ArtisanProfile.prototype, "businessName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ArtisanProfile.prototype, "businessCategory", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ArtisanProfile.prototype, "businessLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], ArtisanProfile.prototype, "businessDescription", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ArtisanProfile.prototype, "contactInformation", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => users_1.User, (user) => user.artisanProfile, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", users_1.User)
], ArtisanProfile.prototype, "user", void 0);
exports.ArtisanProfile = ArtisanProfile = __decorate([
    (0, typeorm_1.Entity)()
], ArtisanProfile);
