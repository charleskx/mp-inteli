import cors from "cors";
import express from "express";

import { paymentsRoutes } from "./routes/payments.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, response) => {
  response.json({ message: "welcome inteli" });
});
app.use("/payments", paymentsRoutes);

app.listen(3333, () => console.log("Server is running!"));
