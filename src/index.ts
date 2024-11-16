import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./ormConfig";
import bodyParser from "body-parser";
import userRouter from "../src/users/userRoute";
dotenv.config();

const app = express();
// app.use(bodyParser.json());
app.use(express.json());

const port = process.env.PORT || 4000;

app.use("/users", userRouter);

app.get("/test", (req: Request, res: Response) => {
  res.status(200).send("Test route working");
});

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
    console.log("Entities Loaded:", AppDataSource.options.entities);
    // console.log("Entities Path:", entitiesPath);

    console.log("Database connected successfully");
  })
  .catch((error) => console.error("Error connecting to the database", error));
app.listen(port, () => {
  console.log(`server running on ${port}`);
});
