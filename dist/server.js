"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const payments_routes_1 = require("./routes/payments.routes");
const app = (0, express_1.default)();
const port = process.env.PORT || 3333;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_, response) => {
    response.json({ message: "welcome inteli" });
});
app.use("/payments", payments_routes_1.paymentsRoutes);
app.listen(port, () => console.log("Server is running!"));
