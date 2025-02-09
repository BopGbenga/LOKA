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
exports.review = void 0;
const typeorm_1 = require("typeorm");
const users_1 = require("./users");
const products_1 = require("./products");
let review = class review {
};
exports.review = review;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], review.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_1.User, (user) => user.reviews),
    __metadata("design:type", users_1.User)
], review.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => products_1.products, (product) => product.reviews),
    __metadata("design:type", products_1.products)
], review.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", width: 1 }),
    __metadata("design:type", Number)
], review.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], review.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], review.prototype, "createdAt", void 0);
exports.review = review = __decorate([
    (0, typeorm_1.Entity)()
], review);
