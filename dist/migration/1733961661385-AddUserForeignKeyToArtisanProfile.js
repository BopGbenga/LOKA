"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserForeignKeyToArtisanProfile1733958638364 = void 0;
const typeorm_1 = require("typeorm");
class AddUserForeignKeyToArtisanProfile1733958638364 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createForeignKey("artisan_profile", new typeorm_1.TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropForeignKey("artisan_profile", "FK_5b8778554cd73170db5ea04bb2a");
        });
    }
}
exports.AddUserForeignKeyToArtisanProfile1733958638364 = AddUserForeignKeyToArtisanProfile1733958638364;
