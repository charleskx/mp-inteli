import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN ?? "",
});

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
        payment_created_at: payment.body.date_created,
        payment_updated_at: payment.body.date_last_updated,
      },
      update: {
        status: payment.body.status,
        status_detail: payment.body.status_detail,
        payment_updated_at: payment.body.date_last_updated,
      },
    });

    response.status(200).json(payment);
  }

  response.status(400).send();
});

webhooksRoutes.get("/", async (request, response) => {
  const payments = await mercadopago.payment.get(Number(request.query.id));

  response.status(200).json(payments);
});

export { webhooksRoutes };
