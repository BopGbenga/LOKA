"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ormConfig_1 = require("./ormConfig");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// app.use(bodyParser.json());
app.use(express_1.default.json());
const port = process.env.PORT || 4000;
app.use("/users", userRoute_1.default);
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
