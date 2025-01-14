import { Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";

export const getStates = (req: Request, res: Response): void => {
  try {
    const filePath = path.resolve(__dirname, "../../data/states.json"); // Adjust path based on your project structure
    const data = fs.readFileSync(filePath, "utf-8");
    const states = JSON.parse(data);

    res.status(200).json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch states",
    });
  }
};
