import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const webhooksRoutes = Router();
const prisma = new PrismaClient();

webhooksRoutes.post("/", (request, response) => {
  response.status(201).json({
    message: "success",
  });
});

export { webhooksRoutes };
