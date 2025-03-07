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
exports.products = void 0;
const typeorm_1 = require("typeorm");
const category_1 = require("./category");
const users_1 = require("./users");
const orderItems_1 = require("./orderItems");
const review_1 = require("./review");
let products = class products {
};
exports.products = products;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], products.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], products.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], products.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal"),
    __metadata("design:type", String)
], products.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], products.prototype, "stockQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: false, default: "default-image-url.jpg" }),
    __metadata("design:type", String)
], products.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_1.review, (review) => review.products),
    __metadata("design:type", Array)
], products.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orderItems_1.OrderItem, (orderItem) => orderItem.product),
    __metadata("design:type", Array)
], products.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_1.Category, (category) => category.products, { eager: true }),
    __metadata("design:type", category_1.Category)
], products.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_1.User, (user) => user.products, { onDelete: "CASCADE" }),
    __metadata("design:type", users_1.User)
], products.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], products.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], products.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], products.prototype, "updatedAt", void 0);
exports.products = products = __decorate([
    (0, typeorm_1.Entity)()
], products);
