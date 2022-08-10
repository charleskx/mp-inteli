import { Router } from "express";

const welcomeRoutes = Router();

welcomeRoutes.get("/", (request, response) => {
  response.json({ message: "Inteli" });
});

export { welcomeRoutes };
