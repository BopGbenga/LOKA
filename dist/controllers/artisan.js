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
exports.artisandetails = exports.selectRole = void 0;
const users_1 = require("../entities/users");
const artisans_1 = require("../entities/artisans");
const ormConfig_1 = require("../ormConfig");
//Role selection
const selectRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Request body:", req.body);
        const { userId, role } = req.body;
        // ✅ Ensure role is provided and valid
        const validRoles = ["buyer", "artisan"];
        if (!role || !validRoles.includes(role)) {
            res
                .status(403)
                .json({ message: "Please select a valid role before proceeding" });
            return; // ✅ Stops execution
        }
        // ✅ Fetch user from the database
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // ✅ Update role and save user
        user.role = role;
        yield userRepository.save(user);
        // ✅ Return success response
        res.status(200).json({
            message: role === "buyer"
                ? "Role selected, redirecting to buyer dashboard"
                : "Role selected, redirecting to artisan details page",
        });
    }
    catch (error) {
        console.error("Error selecting role:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.selectRole = selectRole;
//create Artisan
const artisandetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, businessName, businessDescription, businessCategory, state, contactInformation, } = req.body;
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const artisanProfileRepository = ormConfig_1.AppDataSource.getRepository(artisans_1.ArtisanProfile);
        const user = yield userRepository.findOne({
            where: { id: userId },
            relations: ["artisanProfile"],
        });
        if (!user || user.role !== "artisan") {
            res.status(404).json({ message: "Artisan not found." });
            return;
        }
        if (user.artisanProfile) {
            res
                .status(400)
                .json({ message: "Artisan profile already exists for this user." });
            return;
        }
        const artisanProfile = artisanProfileRepository.create({
            businessName,
            businessDescription,
            businessCategory,
            state,
            contactInformation,
            user,
        });
        yield artisanProfileRepository.save(artisanProfile);
        user.artisanProfile = artisanProfile;
        yield userRepository.save(user);
        console.log("Artisan profile created and user updated");
        res.status(200).json({
            message: "Artisan profile created successfully",
            artisanProfile,
        });
    }
    catch (error) {
        console.error("Error saving artisan details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.artisandetails = artisandetails;
