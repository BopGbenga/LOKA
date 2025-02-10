"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ormConfig_1 = require("./ormConfig");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const outhRouter_1 = __importDefault(require("./services/outhRouter"));
const buyersRoute_1 = __importDefault(require("./routes/buyersRoute"));
const artisanRoute_1 = __importDefault(require("./routes/artisanRoute"));
const categoryRoute_1 = __importDefault(require("./routes/categoryRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// app.use(bodyParser.json());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: [
        "https://loka-1.onrender.com",
        "http://localhost:5173",
        // "https://lokatest.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: ["https://lokatest.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
exports.io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
const port = process.env.PORT || 4000;
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(outhRouter_1.default);
app.use("/users", userRoute_1.default);
app.use("/dashboard", buyersRoute_1.default);
app.use("/dashboard", artisanRoute_1.default);
app.use("category", categoryRoute_1.default);
app.use("/order", orderRoute_1.default);
app.get("/api/data", (req, res) => {
    res.json({ message: "CORS is working with TypeScript!" });
});
app.get("/test", (req, res) => {
    res.status(200).send("Test route working");
});
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
ormConfig_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected successfully");
})
    .catch((error) => console.error("Error connecting to the database", error));
app.listen(port, () => {
    console.log(`server running on ${port}`);
});
