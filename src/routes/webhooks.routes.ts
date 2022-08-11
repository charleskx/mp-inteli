import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import mercadopago from "mercadopago";

mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_TOKEN);

const webhooksRoutes = Router();
const prisma = new PrismaClient();

webhooksRoutes.post("/", async (request, response) => {
  const { data, type } = request.body;

  const id = Number(data.id);

  if (type === "payment") {
    const payment = await mercadopago.payment.findById(id);

    await prisma.payments.upsert({
      where: {
        payment_id: id,
      },
      create: {
        payment_id: id,
        price: payment.body.transaction_amount,
        status: payment.body.status,
        status_detail: payment.body.status_detail,
      },
      update: {
        status: payment.body.status,
        status_detail: payment.body.status_detail,
      },
    });

    response.status(201).json(payment);
  }

  response.status(400).send();
});

export { webhooksRoutes };
