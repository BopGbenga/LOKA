import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../entities/users";
import { ArtisanProfile } from "../entities/artisans";
import { AppDataSource } from "../ormConfig";
import { CreateArtisanDTO } from "../interfaces/user.DTO";

//Role selection
export const selectRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Incoming Request Body:", req.body);
    console.log("Headers:", req.headers);
    console.log("Request Method:", req.method);
    console.log("Request URL:", req.url);

    const { userId, role } = req.body;

    if (!role) {
      res.status(400).json({ message: "Please select a role" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.role = role;
    await userRepository.save(user);

    res.status(200).json({
      message:
        role === "buyer"
          ? "Role selected, redirecting to buyer dashboard"
          : "Role selected, redirecting to artisan details page",
    });
  } catch (error) {
    console.error("Error selecting role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//create Artisan
export const artisandetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      userId,
      businessName,
      businessDescription,
      businessCategory,
      state,
      contactInformation,
    } = req.body as CreateArtisanDTO;

    const userRepository = AppDataSource.getRepository(User);
    const artisanProfileRepository =
      AppDataSource.getRepository(ArtisanProfile);
    const user = await userRepository.findOne({
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

    await artisanProfileRepository.save(artisanProfile);
    user.artisanProfile = artisanProfile;
    await userRepository.save(user);

    console.log("Artisan profile created and user updated");

    res.status(200).json({
      message: "Artisan profile created successfully",
      artisanProfile,
    });
  } catch (error) {
    console.error("Error saving artisan details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
