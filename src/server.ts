import cors from "cors";
import express from "express";

import { paymentsRoutes } from "./routes/payments.routes";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (_, response) => {
  response.json({ message: "welcome inteli" });
});
app.use("/payments", paymentsRoutes);

app.listen(port, () => console.log("Server is running!"));
