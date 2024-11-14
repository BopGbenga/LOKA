import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./ormConfig";
import bodyParser from "body-parser";
import userRoute from "./users/userRoute";
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(bodyParser.json());

app.use("/users", userRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error("Not Found");
  (err as any).status = 404;
  next(err);
});
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ message: err.message });
  }
);
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => console.error("Error connecting to the database", error));
app.listen(port, () => {
  console.log(`server running on ${port}`);
});
