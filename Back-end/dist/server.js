"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); //fetch .env from env file
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
app.get("/", (req, res) => {
    res.send("home");
});
app.listen(port, () => {
    console.log(`server running on port: ${port}`);
});
