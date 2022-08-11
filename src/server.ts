import cors from "cors";
import express from "express";

import { paymentsRoutes } from "./routes/payments.routes";
import { webhooksRoutes } from "./routes/webhooks.routes";

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get("/", (_, response) => {
  response.json({ message: "welcome inteli" });
});

app.use("/payments", paymentsRoutes);
app.use("/webhooks", webhooksRoutes);

app.listen(port, () => console.log("Server is running!"));
