import { Router } from "express";
import mercadopago from "mercadopago";

mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_TOKEN);

const paymentsRoutes = Router();

paymentsRoutes.post("/card", (request, response) => {
  const {
    transaction_amount,
    token,
    description,
    installments,
    payment_method_id,
    issuer_id,
    payer,
  } = request.body;

  const payment_data = {
    transaction_amount,
    token,
    description,
    installments: Number(installments),
    payment_method_id,
    issuer_id,
    payer: {
      email: payer.email,
      identification: {
        type: payer.identification.type,
        number: payer.identification.number,
      },
    },
  };

  // create payment in gateway
  mercadopago.payment
    .save(payment_data)
    .then(async (res) => {
      response.status(res.status).json({
        status: res.body.status,
        status_detail: res.body.status_detail,
        id: res.body.id,
      });
    })
    .catch((err) => {
      response.status(400).json({
        message: err.message,
      });
    });
});

paymentsRoutes.post("/ticket", (request, response) => {
  const { transaction_amount, description, payment_method_id, payer } =
    request.body;

  const payment_data: any = {
    transaction_amount,
    description,
    payment_method_id,
    payer: {
      email: payer.email,
      first_name: payer.first_name,
      last_name: payer.last_name,
      identification: {
        type: payer.identification.type,
        number: payer.identification.number,
      },
    },
  };

  // create payment in gateway
  mercadopago.payment
    .create(payment_data)
    .then(async (res) => {
      if (payment_method_id === "pix") {
        // response json user
        response.status(res.status).json({
          id: res.response.id,
          date_created: res.response.date_created,
          date_of_expiration: res.response.date_of_expiration,
          payment_method_id: res.response.payment_method_id,
          status: res.response.status,
          status_detail: res.response.status_detail,
          transaction_details: res.response.transaction_details,
          point_of_interaction: {
            transaction_data: {
              qr_code:
                res.response.point_of_interaction.transaction_data.qr_code,
              qr_code_base64:
                res.response.point_of_interaction.transaction_data
                  .qr_code_base64,
              ticket_url:
                res.response.point_of_interaction.transaction_data.ticket_url,
            },
          },
        });
      }

      // response json user
      response.status(res.status).json({
        id: res.response.id,
        date_created: res.response.date_created,
        date_of_expiration: res.response.date_of_expiration,
        payment_method_id: res.response.payment_method_id,
        status: res.response.status,
        status_detail: res.response.status_detail,
        transaction_details: res.response.transaction_details,
        barcode: res.response.barcode.content,
      });
    })
    .catch((err) => {
      response.status(400).json({ message: err.message });
    });
});

export { paymentsRoutes };
