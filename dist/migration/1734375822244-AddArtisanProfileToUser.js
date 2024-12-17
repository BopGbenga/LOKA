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
exports.AddArtisanProfileToUser1640995200000 = void 0;
class AddArtisanProfileToUser1640995200000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE "users" ADD CONSTRAINT "FK_artisanProfileId" FOREIGN KEY ("artisanProfileId") REFERENCES "artisan_profile"("id") ON DELETE CASCADE;
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_artisanProfileId";
        `);
        });
    }
}
exports.AddArtisanProfileToUser1640995200000 = AddArtisanProfileToUser1640995200000;
