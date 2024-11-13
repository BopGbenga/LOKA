import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./ormConfig";
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => console.error("Error connecting to the database", error));
app.listen(port, () => {
  console.log(`server running on ${port}`);
});
