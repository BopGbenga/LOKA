import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./ormConfig";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoute";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import oauthRoutes from "./services/outhRouter";
import buyersRouter from "./routes/buyersRoute";
import artisanRouter from "./routes/artisanRoute";
import categoryRouter from "./routes/categoryRoute";
import orderRouter from "./routes/orderRoute";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

const server = http.createServer(app);
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "https://loka-1.onrender.com",
      // "http://localhost:5173",
      // "https://lokatest.vercel.app",
      "https://loka-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

export const io = new Server(server, {
  cors: {
    origin: ["https://lokatest.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const port = process.env.PORT || 4000;
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(oauthRoutes);
app.use("/users", userRouter);
app.use("/dashboard", buyersRouter);
app.use("/dashboard", artisanRouter);
app.use("category", categoryRouter);
app.use("/order", orderRouter);

app.get("/api/data", (req: Request, res: Response) => {
  res.json({ message: "CORS is working with TypeScript!" });
});

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
    console.log("Database connected successfully");
  })
  .catch((error) => console.error("Error connecting to the database", error));
app.listen(port, () => {
  console.log(`server running on ${port}`);
});
